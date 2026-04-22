package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.Dto.ShowDto;
import com.work.Movie.Booking.System.convertor.ShowConvertor;
import com.work.Movie.Booking.System.entities.*;
import com.work.Movie.Booking.System.enums.SeatType;
import com.work.Movie.Booking.System.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Autowired
    private ShowSeatRepository showSeatRepository;

    @Transactional
    public ShowDto addShow(ShowDto showDto) {
        // 1. Validate Movie and Theater existence
        Movie movie = movieRepository.findById(showDto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + showDto.getMovieId()));
        
        Theater theater = theaterRepository.findById(showDto.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found with id: " + showDto.getTheaterId()));

        // 2. Check for scheduling conflicts
        boolean isHallOccupied = showRepository.existsByTheaterIdAndDateAndTime(showDto.getTheaterId(), showDto.getDate(), showDto.getTime());
        if (isHallOccupied) {
            throw new RuntimeException("This hall is already booked for the selected date and time.");
        }

        // 3. Create and Save the Show
        Show show = ShowConvertor.dtoToEntity(showDto);
        show.setMovie(movie);
        show.setTheater(theater);
        Show savedShow = showRepository.save(show);
        
        // 4. Generate Seats based on Theater's seat configuration
        List<ShowSeat> showSeats = new ArrayList<>();
        List<TheaterSeat> physicalSeats = theater.getTheaterSeatList();
        
        for (TheaterSeat physicalSeat : physicalSeats) {
            ShowSeat sessionSeat = ShowSeat.builder()
                    .seatNo(physicalSeat.getSeatNo())
                    .seatType(physicalSeat.getSeatType())
                    .isAvailable(true)
                    .isFoodContains(false)
                    .show(savedShow)
                    .build();
            
            // Set dynamic pricing based on seat type (Premium vs Classic)
            if (physicalSeat.getSeatType().equals(SeatType.PREMIUM)) {
                sessionSeat.setPrice(500);
            } else {
                sessionSeat.setPrice(300);
            }
            showSeats.add(sessionSeat);
        }
        
        // 5. Persist seats and return result
        showSeatRepository.saveAll(showSeats);
        savedShow.setShowSeatList(showSeats); // Update relationship in memory
        
        return ShowConvertor.entityToDto(savedShow);
    }

    /**
     * Retrieves all shows scheduled for a specific movie.
     */
    public List<ShowDto> getShowsByMovie(Long movieId) {
        return showRepository.getAllShowsOfMovie(movieId).stream()
                .map(ShowConvertor::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all shows scheduled for a specific date across all theaters.
     */
    public List<ShowDto> getShowsByDate(LocalDate date) {
        return showRepository.findAll().stream()
                .filter(s -> s.getDate().equals(date))
                .map(ShowConvertor::entityToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Fetches detailed information about a specific show.
     */
    public ShowDto getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found with id: " + id));
        return ShowConvertor.entityToDto(show);
    }

    /**
     * Gets the current status of all seats for a specific show.
     */
    public List<ShowSeat> getSeatsForShow(Long showId) {
        return showSeatRepository.findAllByShowShowId(showId);
    }

}
