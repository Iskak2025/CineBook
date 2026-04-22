package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM Ticket t WHERE t.show.date < :date OR (t.show.date = :date AND t.show.time < :time)")
    void deleteExpiredTickets(@Param("date") LocalDate date, @Param("time") LocalTime time);
}
