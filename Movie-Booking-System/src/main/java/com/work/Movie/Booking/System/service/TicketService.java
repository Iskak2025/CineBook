package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.Dto.TicketDto;
import com.work.Movie.Booking.System.convertor.TicketConvertor;
import com.work.Movie.Booking.System.entities.Show;
import com.work.Movie.Booking.System.entities.ShowSeat;
import com.work.Movie.Booking.System.entities.Ticket;
import com.work.Movie.Booking.System.entities.User;
import com.work.Movie.Booking.System.repositories.ShowRepository;
import com.work.Movie.Booking.System.repositories.ShowSeatRepository;
import com.work.Movie.Booking.System.repositories.TicketRepository;
import com.work.Movie.Booking.System.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    @Autowired
    private TicketRepository ticketRepository;

    @Scheduled(cron = "0 0 * * * *") // Runs every hour
    @Transactional
    public void cleanupExpiredTickets() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        logger.info("Starting cleanup of expired tickets at {} {}", today, now);
        ticketRepository.deleteExpiredTickets(today, now);
        logger.info("Expired tickets cleanup completed.");
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private ShowSeatRepository showSeatRepository;
    @Transactional
    public TicketDto bookTicket(TicketDto ticketDto) {

        User participant = userRepository.findById(ticketDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + ticketDto.getUserId()));
        
        Show selectedShow = showRepository.findById(ticketDto.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found with id: " + ticketDto.getShowId()));

        LocalDateTime showTime = LocalDateTime.of(selectedShow.getDate(), selectedShow.getTime());
        if (LocalDateTime.now().isAfter(showTime)) {
             throw new RuntimeException("This show has already started or passed. Booking is no longer available.");
        }


        List<String> requestedSeats = Arrays.stream(ticketDto.getBookedSeats().split(","))
                .map(String::trim)
                .collect(Collectors.toList());

        List<ShowSeat> validatedSeats = new ArrayList<>();
        int totalCalculatedPrice = 0;

        for (String seatNo : requestedSeats) {
            ShowSeat seat = showSeatRepository.findByShowShowIdAndSeatNo(selectedShow.getShowId(), seatNo)
                    .orElseThrow(() -> new RuntimeException("Seat " + seatNo + " is not valid for this show."));
            
            if (!seat.getIsAvailable()) {
                throw new RuntimeException("Seat " + seatNo + " has already been booked by someone else.");
            }
            
            validatedSeats.add(seat);
            totalCalculatedPrice += seat.getPrice();
        }


        Ticket newTicket = TicketConvertor.dtoToEntity(ticketDto);
        newTicket.setUser(participant);
        newTicket.setShow(selectedShow);
        newTicket.setPrice(totalCalculatedPrice);
        newTicket.setBookedAt(LocalDateTime.now());


        for (ShowSeat seat : validatedSeats) {
            seat.setIsAvailable(false);
        }
        showSeatRepository.saveAll(validatedSeats);

        Ticket finalizedTicket = ticketRepository.save(newTicket);
        return TicketConvertor.entityToDto(finalizedTicket);
    }


    public List<TicketDto> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserId(userId).stream()
                .map(TicketConvertor::entityToDto)
                .collect(Collectors.toList());
    }


    @Transactional
    public void cancelTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket record not found with id: " + ticketId));

        List<String> seatsToRelease = Arrays.stream(ticket.getBookedSeats().split(","))
                .map(String::trim)
                .collect(Collectors.toList());
        
        for (String seatNo : seatsToRelease) {
            showSeatRepository.findByShowShowIdAndSeatNo(ticket.getShow().getShowId(), seatNo)
                    .ifPresent(seat -> seat.setIsAvailable(true));
        }

        ticketRepository.deleteById(ticketId);
    }
}
