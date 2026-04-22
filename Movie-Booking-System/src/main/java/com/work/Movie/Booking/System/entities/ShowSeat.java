package com.work.Movie.Booking.System.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.work.Movie.Booking.System.enums.SeatType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@Table(name = "showSeats")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNo;

    @Enumerated(value = EnumType.STRING)
    private SeatType seatType;

    private Integer price;

    private Boolean isAvailable;

    private Boolean isFoodContains;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;
}
