package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.Dto.MovieDto;
import com.work.Movie.Booking.System.Dto.ShowDto;
import com.work.Movie.Booking.System.Dto.TheaterDto;
import com.work.Movie.Booking.System.convertor.MovieConvertor;
import com.work.Movie.Booking.System.convertor.ShowConvertor;
import com.work.Movie.Booking.System.entities.Movie;
import com.work.Movie.Booking.System.entities.Show;
import com.work.Movie.Booking.System.entities.Theater;
import com.work.Movie.Booking.System.repositories.MovieRepository;
import com.work.Movie.Booking.System.repositories.ShowRepository;
import com.work.Movie.Booking.System.repositories.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Autowired
    private TmdbService tmdbService;

    @Autowired
    private TheaterService theaterService;

    @Autowired
    private ShowService showService;

    public List<MovieDto> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(MovieConvertor::entityToDto)
                .collect(Collectors.toList());
    }

    public MovieDto addMovie(MovieDto movieDto) {
        Movie movie = MovieConvertor.dtoToEntity(movieDto);
        Movie savedMovie = movieRepository.save(movie);
        return MovieConvertor.entityToDto(savedMovie);
    }

    public MovieDto updateMovie(MovieDto movieDto, Long id) {
        movieDto.setId(id);
        
        Optional<Movie> existingMovie = movieRepository.findById(id);
        if (existingMovie.isPresent()) {
            Movie movieToUpdate = MovieConvertor.dtoToEntity(movieDto);
            Movie updatedMovie = movieRepository.save(movieToUpdate);
            return MovieConvertor.entityToDto(updatedMovie);
        } else {
            throw new RuntimeException("Movie not found with id: " + id);
        }
    }

    @Transactional
    public void deleteMovie(Long id) {
        List<Show> shows = showRepository.getAllShowsOfMovie(id);
        if (shows != null && !shows.isEmpty()) {
            showRepository.deleteAll(shows);
        }
        movieRepository.deleteById(id);
    }

    public MovieDto getMovieById(Long id) {
        Optional<Movie> movie = movieRepository.findById(id);

        if (movie.isEmpty()) {
            movie = movieRepository.findByTmdbId(id);
        }
        
        return MovieConvertor.entityToDto(movie.orElseThrow(() -> 
            new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.NOT_FOUND, 
                    "Movie with ID " + id + " not found locally. Try fetching from TMDB proxy.")));
    }

    @Transactional
    public ShowDto quickRelease(Long tmdbId, LocalDate requestedDate, LocalTime requestedTime) {
        Optional<Movie> movieOpt = movieRepository.findByTmdbId(tmdbId);
        Movie movie;
        if (movieOpt.isEmpty()) {
            try {
                movie = tmdbService.fetchAndMapMovie(tmdbId);
                movie = movieRepository.save(movie);
            } catch (Exception e) {
                throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_GATEWAY, 
                    "Failed to fetch movie from TMDB. Check TMDB_API_KEY on server. " + e.getMessage());
            }
        } else {
            movie = movieOpt.get();
        }

        List<Theater> theaters = theaterRepository.findAll();
        Theater theater;
        if (theaters.isEmpty()) {
            TheaterDto theaterDto = TheaterDto.builder()
                    .name("Grand Cinema 1")
                    .address("Golden Square, 42")
                    .build();
            theaterDto = theaterService.addTheater(theaterDto);
            theater = theaterRepository.findById(theaterDto.getId()).orElseThrow();
        } else {
            theater = theaters.get(0);
        }

        theaterService.ensureGridSeats(theater);

        List<Show> existingShows = showRepository.getAllShowsOfMovie(movie.getId());
        if (existingShows != null && !existingShows.isEmpty()) {
            if (requestedDate != null && requestedTime != null) {
                Optional<Show> match = existingShows.stream()
                        .filter(s -> s.getDate().equals(requestedDate) && s.getTime().equals(requestedTime))
                        .findFirst();
                if (match.isPresent()) return ShowConvertor.entityToDto(match.get());
            } else {
                Show currentShow = existingShows.get(0);
                LocalDateTime showDateTime = LocalDateTime.of(currentShow.getDate(), currentShow.getTime());
                if (showDateTime.isAfter(LocalDateTime.now().plusMinutes(5))) {
                    return ShowConvertor.entityToDto(currentShow);
                }
                
                try {
                    showRepository.delete(currentShow);
                } catch (Exception e) {
                    System.out.println("Past show has tickets, preserving history.");
                }
            }
        }

        LocalDate showDate;
        LocalTime showTime;

        if (requestedDate != null && requestedTime != null) {
            showDate = requestedDate;
            showTime = requestedTime;
        } else {
            showDate = LocalDate.now();
            showTime = LocalTime.now().plusHours(1).withMinute(0).withSecond(0);
            while (showTime.isBefore(LocalTime.of(23, 0))) {
                boolean isOccupied = showRepository.existsByTheaterIdAndDateAndTime(theater.getId(), showDate, showTime);
                if (!isOccupied) break;
                showTime = showTime.plusHours(2);
            }
        }

        ShowDto showDto = ShowDto.builder()
                .date(showDate)
                .time(showTime)
                .movieId(movie.getId())
                .theaterId(theater.getId())
                .build();
        
        return showService.addShow(showDto);
    }
}
