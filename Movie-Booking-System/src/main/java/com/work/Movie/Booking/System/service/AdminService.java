package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.Dto.AdminStatsDto;
import com.work.Movie.Booking.System.entities.AdminLog;
import com.work.Movie.Booking.System.entities.Ticket;
import com.work.Movie.Booking.System.repositories.AdminLogRepository;
import com.work.Movie.Booking.System.repositories.MovieRepository;
import com.work.Movie.Booking.System.repositories.TicketRepository;
import com.work.Movie.Booking.System.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private AdminLogRepository adminLogRepository;

    public AdminStatsDto getStats() {
        long totalUsers = userRepository.count();
        long totalMovies = movieRepository.count();
        long totalTickets = ticketRepository.count();
        Double totalRevenue = ticketRepository.sumTicketPrice();
        if (totalRevenue == null) totalRevenue = 0.0;

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalMovies(totalMovies)
                .totalTickets(totalTickets)
                .totalRevenue(totalRevenue)
                .build();
    }

    public void logAction(String action, Long adminId) {
        AdminLog log = AdminLog.builder()
                .action(action)
                .adminId(adminId)
                .timestamp(LocalDateTime.now())
                .build();
        adminLogRepository.save(log);
    }
}
