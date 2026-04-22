package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.service.TmdbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tmdb")
public class TmdbController {

    @Autowired
    private TmdbService tmdbService;

    @GetMapping("/popular")
    public ResponseEntity<String> getPopularMovies() {
        return new ResponseEntity<>(tmdbService.getPopularMovies(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchMovies(@RequestParam String query) {
        return new ResponseEntity<>(tmdbService.searchMovies(query), HttpStatus.OK);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<String> getMovieDetails(@PathVariable Long id) {
        return new ResponseEntity<>(tmdbService.getMovieDetails(id), HttpStatus.OK);
    }

    @GetMapping("/top_rated")
    public ResponseEntity<String> getTopRatedMovies() {
        return new ResponseEntity<>(tmdbService.getTopRatedMovies(), HttpStatus.OK);
    }

    @GetMapping("/now_playing")
    public ResponseEntity<String> getNowPlayingMovies() {
        return new ResponseEntity<>(tmdbService.getNowPlayingMovies(), HttpStatus.OK);
    }
}
