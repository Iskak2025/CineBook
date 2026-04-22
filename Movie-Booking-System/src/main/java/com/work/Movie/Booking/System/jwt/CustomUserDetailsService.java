package com.work.Movie.Booking.System.jwt;

import com.work.Movie.Booking.System.entities.User;
import com.work.Movie.Booking.System.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        return user.map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("user not found " + username));

    }

    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findById(id);

        return user.map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("user not found with id " + id));
    }
}
