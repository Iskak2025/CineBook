package com.work.Movie.Booking.System.convertor;

import com.work.Movie.Booking.System.Dto.ShowSeatDto;
import com.work.Movie.Booking.System.entities.ShowSeat;

/**
 * Utility class to convert between ShowSeat Entity and DTO.
 */
public class ShowSeatConvertor {

    /**
     * Converts ShowSeat entity to DTO.
     */
    public static ShowSeatDto entityToDto(ShowSeat showSeat) {
        if (showSeat == null) return null;

        return ShowSeatDto.builder()
                .id(showSeat.getId())
                .seatNo(showSeat.getSeatNo())
                .seatType(showSeat.getSeatType())
                .price(showSeat.getPrice())
                .isAvailable(showSeat.getIsAvailable())
                .isFoodContains(showSeat.getIsFoodContains())
                .build();
    }

    /**
     * Converts ShowSeat DTO to entity (Note: back-reference to Show must be set manually).
     */
    public static ShowSeat dtoToEntity(ShowSeatDto showSeatDto) {
        if (showSeatDto == null) return null;

        return ShowSeat.builder()
                .id(showSeatDto.getId())
                .seatNo(showSeatDto.getSeatNo())
                .seatType(showSeatDto.getSeatType())
                .price(showSeatDto.getPrice())
                .isAvailable(showSeatDto.getIsAvailable())
                .isFoodContains(showSeatDto.getIsFoodContains())
                .build();
    }
}
