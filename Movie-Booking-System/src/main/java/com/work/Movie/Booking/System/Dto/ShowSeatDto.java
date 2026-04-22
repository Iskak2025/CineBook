package com.work.Movie.Booking.System.Dto;

import com.work.Movie.Booking.System.enums.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for ShowSeat information.
 * Clean of JPA annotations and recursive relationships.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowSeatDto {
    private Long id;
    private String seatNo;
    private SeatType seatType;
    private Integer price;
    private Boolean isAvailable;
    private Boolean isFoodContains;
}
