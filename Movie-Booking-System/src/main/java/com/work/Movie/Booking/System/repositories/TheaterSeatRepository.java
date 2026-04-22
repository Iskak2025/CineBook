package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.TheaterSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterSeatRepository extends JpaRepository<TheaterSeat, Long> {
    List<TheaterSeat> findAllByTheaterId(Long theaterId);
}
