package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.Theater;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TheaterRepository extends JpaRepository<Theater, Long> {
    Theater findByAddress(String address);

    Theater findByName(String name);
}
