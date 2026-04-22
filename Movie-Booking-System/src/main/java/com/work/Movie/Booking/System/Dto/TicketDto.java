package com.work.Movie.Booking.System.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto {

    private Long id;

    private Integer price;

    private String bookedSeats;

    private LocalDateTime bookedAt;

    private Long showId;

    private Long userId;

    private Long movieId;

    private String movieName;

    private String showDate;

    private String showTime;
}
