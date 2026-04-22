package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.Dto.TicketDto;
import com.work.Movie.Booking.System.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    public ResponseEntity<TicketDto> bookTicket(@RequestBody TicketDto ticketDto) {
        TicketDto savedTicket = ticketService.bookTicket(ticketDto);
        return new ResponseEntity<>(savedTicket, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDto>> getTicketsByUserId(@PathVariable Long userId) {
        return new ResponseEntity<>(ticketService.getTicketsByUserId(userId), HttpStatus.OK);
    }

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelTicket(@PathVariable Long id) {
        ticketService.cancelTicket(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
