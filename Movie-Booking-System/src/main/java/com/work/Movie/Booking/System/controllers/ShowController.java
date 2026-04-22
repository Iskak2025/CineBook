package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.Dto.ShowDto;
import com.work.Movie.Booking.System.Dto.ShowSeatDto;
import com.work.Movie.Booking.System.convertor.ShowSeatConvertor;
import com.work.Movie.Booking.System.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/show")
public class ShowController {

    @Autowired
    private ShowService showService;

    @PostMapping("add_show")
    public ResponseEntity<ShowDto> addShow(@RequestBody ShowDto showDto) {
        ShowDto show = showService.addShow(showDto);
        return new ResponseEntity<>(show, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ShowDto> getShow(@PathVariable Long id) {
        ShowDto show = showService.getShowById(id);
        return new ResponseEntity<>(show, HttpStatus.OK);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<ShowDto>> getShowByDate(@PathVariable LocalDate date) {
        return new ResponseEntity<>(showService.getShowsByDate(date), HttpStatus.OK);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowDto>> getShowsByMovie(@PathVariable Long movieId) {
        return new ResponseEntity<>(showService.getShowsByMovie(movieId), HttpStatus.OK);
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<ShowSeatDto>> getSeatsByShow(@PathVariable Long id) {
        List<ShowSeatDto> seats = showService.getSeatsForShow(id).stream()
                .map(ShowSeatConvertor::entityToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(seats, HttpStatus.OK);
    }

}
