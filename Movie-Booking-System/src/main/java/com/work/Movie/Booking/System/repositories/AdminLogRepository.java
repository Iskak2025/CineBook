package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminLogRepository extends JpaRepository<AdminLog, Long> {
}
