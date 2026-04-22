package com.work.Movie.Booking.System.repositories;

import com.work.Movie.Booking.System.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    org.springframework.data.domain.Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String email, org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<User> findByRole(
            com.work.Movie.Booking.System.enums.Role role, org.springframework.data.domain.Pageable pageable);
}
