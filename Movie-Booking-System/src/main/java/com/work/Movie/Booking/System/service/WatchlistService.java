package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.entities.Movie;
import com.work.Movie.Booking.System.entities.User;
import com.work.Movie.Booking.System.entities.Watchlist;
import com.work.Movie.Booking.System.repositories.MovieRepository;
import com.work.Movie.Booking.System.repositories.UserRepository;
import com.work.Movie.Booking.System.repositories.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TmdbService tmdbService;

    @Transactional
    public Watchlist addToWatchlist(Long userId, Long movieId) {
        Optional<Movie> movieOpt = movieRepository.findById(movieId);
        if (movieOpt.isEmpty()) {
            movieOpt = movieRepository.findByTmdbId(movieId);}

        Movie movie;
        if (movieOpt.isEmpty()) {
            try {
                movie = tmdbService.fetchAndMapMovie(movieId);
                movie = movieRepository.save(movie);
            } catch (Exception e) {
                System.err.println("Error saving movie to DB or fetching from TMDB: " + e.getMessage());
                throw new RuntimeException("Movie not found locally and failed to fetch from TMDB: " + movieId + ". Reason: " + e.getMessage());
            }
        } else {
            movie = movieOpt.get();
        }

        Optional<Watchlist> existing = watchlistRepository.findByUserIdAndMovieId(userId, movie.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        Watchlist watchlist = Watchlist.builder()
                .user(user)
                .movie(movie)
                .build();

        return watchlistRepository.save(watchlist);
    }

    @Transactional
    public void removeFromWatchlist(Long userId, Long movieId) {
        Optional<Watchlist> watchlist = watchlistRepository.findByUserIdAndMovieId(userId, movieId);

        if (watchlist.isEmpty()) {
            watchlist = watchlistRepository.findByUserIdAndMovieTmdbId(userId, movieId);
        }
        watchlist.ifPresent(w -> watchlistRepository.delete(w));
    }
    public List<Watchlist> getWatchlistByUser(Long userId) {
        return watchlistRepository.findByUserId(userId);
    }
}
