package com.work.Movie.Booking.System.config;

import com.work.Movie.Booking.System.entities.User;
import com.work.Movie.Booking.System.enums.Role;
import com.work.Movie.Booking.System.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
        } catch (Exception e) {
            System.out.println("Could not sync sequence, maybe it doesn't exist: " + e.getMessage());
        }

        try {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@test.com")
                        .role(Role.Admin)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user successfully created with username 'admin' and password 'admin'");
            }
        } catch (Exception e) {
            System.err.println("Error creating admin user: " + e.getMessage());
        }
    }
}
