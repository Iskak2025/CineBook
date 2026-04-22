package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.Dto.MovieDto;
import com.work.Movie.Booking.System.Dto.ShowDto;
import com.work.Movie.Booking.System.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/get_all")
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        return new ResponseEntity<>(movieService.getAllMovies(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<MovieDto> addMovie(@RequestBody MovieDto movieDto) {
        MovieDto savedMovie = movieService.addMovie(movieDto);
        return new ResponseEntity<>(savedMovie, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MovieDto> updateMovie(@RequestBody MovieDto movieDto, @PathVariable Long id) {
        MovieDto updatedMovie = movieService.updateMovie(movieDto, id);
        return new ResponseEntity<>(updatedMovie, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        return new ResponseEntity<>(movieService.getMovieById(id), HttpStatus.OK);
    }

    @PostMapping("/quick-release/{tmdbId}")
    public ResponseEntity<ShowDto> quickRelease(
            @PathVariable Long tmdbId,
            @RequestBody(required = false) com.work.Movie.Booking.System.Dto.QuickReleaseRequest request) {
        String date = (request != null) ? request.getDate() : null;
        String time = (request != null) ? request.getTime() : null;
        LocalDate parsedDate = (date != null && !date.isBlank()) ? LocalDate.parse(date) : null;
        LocalTime parsedTime = (time != null && !time.isBlank()) ? LocalTime.parse(time) : null;
        return new ResponseEntity<>(movieService.quickRelease(tmdbId, parsedDate, parsedTime), HttpStatus.OK);
    }
}
