package com.work.Movie.Booking.System.convertor;

import com.work.Movie.Booking.System.Dto.ShowDto;
import com.work.Movie.Booking.System.entities.Show;

public class ShowConvertor {

    public static ShowDto entityToDto(Show show) {
        if (show == null) return null;
        return ShowDto.builder()
                .id(show.getShowId())
                .time(show.getTime())
                .date(show.getDate())
                .movieId(show.getMovie() != null ? show.getMovie().getId() : null)
                .theaterId(show.getTheater() != null ? show.getTheater().getId() : null)
                .build();
    }

    public static Show dtoToEntity(ShowDto showDto) {
        if (showDto == null) return null;
        return Show.builder()
                .showId(showDto.getId())
                .time(showDto.getTime())
                .date(showDto.getDate())
                .build();
    }
}
