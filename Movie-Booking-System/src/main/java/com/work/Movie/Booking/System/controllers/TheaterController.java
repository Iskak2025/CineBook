package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.Dto.TheaterDto;
import com.work.Movie.Booking.System.service.TheaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theater")
public class TheaterController {

    @Autowired
    private TheaterService theaterService;

    @PostMapping("/add_theater")
    public ResponseEntity<TheaterDto> addTheater(TheaterDto theaterDto) {
        TheaterDto theater = theaterService.addTheater(theaterDto);
        return new ResponseEntity<>(theater, HttpStatus.CREATED);
    }

    @GetMapping("/get_theater/{id}")
    public ResponseEntity<TheaterDto> getTheater(@PathVariable Long id) {
        TheaterDto theater = theaterService.getTheaterById(id);
        return new ResponseEntity<>(theater, HttpStatus.OK);
    }

    @GetMapping("get_theater/{name}")
    public ResponseEntity<TheaterDto> getTheaterByName(@PathVariable String name) {
        TheaterDto theater = theaterService.getTheaterByName(name);
        return new ResponseEntity<>(theater, HttpStatus.OK);
    }

}
