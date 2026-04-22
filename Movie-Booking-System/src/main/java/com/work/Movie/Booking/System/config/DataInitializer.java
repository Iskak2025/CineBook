package com.work.Movie.Booking.System.config;

import com.work.Movie.Booking.System.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository) {
        return args -> {
            try {
                // Ensure all existing users are active after the migration
                userRepository.findAll().forEach(user -> {
                    if (!user.isActive()) {
                        user.setActive(true);
                        userRepository.save(user);
                    }
                });
            } catch (Exception e) {
                System.err.println("Could not run data initialization: " + e.getMessage());
            }
        };
    }
}
