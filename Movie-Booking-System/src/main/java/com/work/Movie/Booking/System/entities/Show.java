package com.work.Movie.Booking.System.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "shows")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long showId;

    private LocalTime time;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "theater_id")
    private Theater theater;

    @JsonIgnore
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
    private List<ShowSeat> showSeatList = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL)
    private List<Ticket> ticketList = new ArrayList<>();
}
