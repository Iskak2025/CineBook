package com.work.Movie.Booking.System.convertor;

import com.work.Movie.Booking.System.Dto.TicketDto;
import com.work.Movie.Booking.System.entities.Ticket;

public class TicketConvertor {

    public static TicketDto entityToDto(Ticket ticket) {
        if (ticket == null) return null;
        return TicketDto.builder()
                .id(ticket.getId())
                .price(ticket.getPrice())
                .bookedSeats(ticket.getBookedSeats())
                .bookedAt(ticket.getBookedAt())
                .showId(ticket.getShow() != null ? ticket.getShow().getShowId() : null)
                .userId(ticket.getUser() != null ? ticket.getUser().getId() : null)
                .movieId(ticket.getShow() != null && ticket.getShow().getMovie() != null ? ticket.getShow().getMovie().getId() : null)
                .movieName(ticket.getShow() != null && ticket.getShow().getMovie() != null ? ticket.getShow().getMovie().getMovieName() : null)
                .showDate(ticket.getShow() != null ? ticket.getShow().getDate().toString() : null)
                .showTime(ticket.getShow() != null ? ticket.getShow().getTime().toString() : null)
                .build();
    }

    public static Ticket dtoToEntity(TicketDto ticketDto) {
        if (ticketDto == null) return null;
        return Ticket.builder()
                .id(ticketDto.getId())
                .price(ticketDto.getPrice())
                .bookedSeats(ticketDto.getBookedSeats())
                .bookedAt(ticketDto.getBookedAt())
                .build();
    }
}
