package com.work.Movie.Booking.System.entities;

import com.work.Movie.Booking.System.enums.Genre;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table (name = "movies")
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String movieName;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Column(scale = 2)
    private Double rating;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate releaseDate;

    private Long duration;

    @Column(columnDefinition = "TEXT")
    private String imgUrl;

    @Column(columnDefinition = "TEXT")
    private String backdropUrl;

    @Column(unique = true)
    private Long tmdbId;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "movie",cascade = CascadeType.ALL)
    private List<Show> shows = new ArrayList<>();
}
