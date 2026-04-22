package com.work.Movie.Booking.System.convertor;

import com.work.Movie.Booking.System.Dto.TheaterDto;
import com.work.Movie.Booking.System.entities.Theater;

public class TheaterConvertor {

    public static TheaterDto entityToDto(Theater theater) {
        if (theater == null) return null;
        return TheaterDto.builder()
                .id(theater.getId())
                .name(theater.getName())
                .address(theater.getAddress())
                .build();
    }

    public static Theater dtoToEntity(TheaterDto theaterDto) {
        if (theaterDto == null) return null;
        return Theater.builder()
                .id(theaterDto.getId())
                .name(theaterDto.getName())
                .address(theaterDto.getAddress())
                .build();
    }
}
