package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUserId(Long userId);
    Optional<Watchlist> findByUserIdAndMovieId(Long userId, Long movieId);
    Optional<Watchlist> findByUserIdAndMovieTmdbId(Long userId, Long tmdbId);
}
