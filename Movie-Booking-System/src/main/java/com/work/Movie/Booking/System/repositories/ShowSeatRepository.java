package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.ShowSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {
    List<ShowSeat> findAllByShowShowId(Long showId);

    Optional<ShowSeat> findByShowShowIdAndSeatNo(Long showId, String seatNo);
}
