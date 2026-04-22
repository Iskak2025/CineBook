package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Movie findByMovieName(String movieName);
    Optional<Movie> findByTmdbId(Long tmdbId);
}
