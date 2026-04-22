package com.work.Movie.Booking.System.Dto;

import com.work.Movie.Booking.System.enums.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterSeatDto {

    private Long id;

    private String seatNo;

    private SeatType seatType;

    private Long theaterId;
}
