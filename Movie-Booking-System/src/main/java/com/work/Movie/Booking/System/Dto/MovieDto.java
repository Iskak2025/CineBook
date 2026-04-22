package com.work.Movie.Booking.System.Dto;

import com.work.Movie.Booking.System.enums.Genre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {

    private Long id;
    
    private Double rating;

    private String movieName;

    private Genre genre;

    private String description;

    private LocalDate releaseDate;

    private Long duration;

    private Long tmdbId;

    private String imgUrl;

    private String backdropUrl;
}
