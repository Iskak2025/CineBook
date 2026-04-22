package com.work.Movie.Booking.System.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long totalMovies;
    private long totalTickets;
    private double totalRevenue;
}
