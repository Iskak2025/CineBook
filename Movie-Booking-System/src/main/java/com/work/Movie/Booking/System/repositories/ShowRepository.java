package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    @Query(value = "select time from shows where date = :date and movie_id = :movieId and theater_id = :theaterId" , nativeQuery = true)
    public List<LocalTime> getShowTimingsOnDate(@Param("date") LocalDate date, @Param("theaterId") Long theaterId, @Param("movieId") Long movieId);

    @Query(value = "select movie_id from shows group by movie_id order by count(*) desc limit 1" , nativeQuery = true)
    public Long getMostShowsMovie();

    @Query(value = "select * from shows where movie_id = :movieId" , nativeQuery = true)
    public List<Show> getAllShowsOfMovie(@Param("movieId") Long movieId);

    boolean existsByTheaterIdAndDateAndTime(Long theaterId, LocalDate date, LocalTime time);
}
