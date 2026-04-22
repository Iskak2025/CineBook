package com.work.Movie.Booking.System.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowDto {

    private Long id;

    private LocalTime time;

    private LocalDate date;

    private Long movieId;

    private Long theaterId;
}
