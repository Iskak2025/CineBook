package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.entities.Watchlist;
import com.work.Movie.Booking.System.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private static final Logger logger = LoggerFactory.getLogger(WatchlistController.class);

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping("/{userId}/{movieId}")
    public ResponseEntity<Watchlist> addToWatchlist(@PathVariable Long userId, @PathVariable Long movieId) {
        logger.info("Adding movie {} to watchlist for user {}", movieId, userId);
        return new ResponseEntity<>(watchlistService.addToWatchlist(userId, movieId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long userId, @PathVariable Long movieId) {
        watchlistService.removeFromWatchlist(userId, movieId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Watchlist>> getWatchlistByUser(@PathVariable Long userId) {
        return new ResponseEntity<>(watchlistService.getWatchlistByUser(userId), HttpStatus.OK);
    }
}
