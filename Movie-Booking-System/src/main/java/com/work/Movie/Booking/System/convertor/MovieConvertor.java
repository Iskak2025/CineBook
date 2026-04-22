package com.work.Movie.Booking.System.convertor;

import com.work.Movie.Booking.System.Dto.MovieDto;
import com.work.Movie.Booking.System.entities.Movie;

public class MovieConvertor {

    public static MovieDto entityToDto(Movie movie) {
        if (movie == null) return null;
        return MovieDto.builder()
                .id(movie.getId())
                .movieName(movie.getMovieName())
                .genre(movie.getGenre())
                .description(movie.getDescription())
                .releaseDate(movie.getReleaseDate())
                .duration(movie.getDuration())
                .rating(movie.getRating())
                .imgUrl(movie.getImgUrl())
                .backdropUrl(movie.getBackdropUrl())
                .tmdbId(movie.getTmdbId())
                .build();
    }

    public static Movie dtoToEntity(MovieDto movieDto) {
        if (movieDto == null) return null;
        return Movie.builder()
                .id(movieDto.getId())
                .movieName(movieDto.getMovieName())
                .genre(movieDto.getGenre())
                .description(movieDto.getDescription())
                .releaseDate(movieDto.getReleaseDate())
                .duration(movieDto.getDuration())
                .rating(movieDto.getRating())
                .imgUrl(movieDto.getImgUrl())
                .backdropUrl(movieDto.getBackdropUrl())
                .tmdbId(movieDto.getTmdbId())
                .build();
    }
}
