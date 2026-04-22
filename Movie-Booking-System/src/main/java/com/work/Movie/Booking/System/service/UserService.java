package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.Dto.AuthResponse;
import com.work.Movie.Booking.System.Dto.UserDto;
import com.work.Movie.Booking.System.convertor.UserConvertor;
import com.work.Movie.Booking.System.entities.User;
import com.work.Movie.Booking.System.enums.Role;
import com.work.Movie.Booking.System.jwt.JwtService;
import com.work.Movie.Booking.System.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserDto register(UserDto userDto) {
        User user = UserConvertor.dtoToEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole(Role.User);
        }
        
        User savedUser = userRepository.save(user);
        return UserConvertor.entityToDto(savedUser);
    }

    public AuthResponse login(UserDto userDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword())
        );

        if (authentication.isAuthenticated()) {
            User user = userRepository.findByUsername(userDto.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            String token = jwtService.generateToken(user.getId());
            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .id(user.getId())
                    .role(user.getRole() != null ? user.getRole().name() : "User")
                    .email(user.getEmail())
                    .build();
        } else {
            throw new UsernameNotFoundException("Неверный запрос");
        }
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
        return UserConvertor.entityToDto(user);
    }

    @org.springframework.transaction.annotation.Transactional
    public AuthResponse updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
        
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        
        // Generate new token with ID as subject
        String token = jwtService.generateToken(updatedUser.getId());
        
        return AuthResponse.builder()
                .token(token)
                .username(updatedUser.getUsername())
                .id(updatedUser.getId())
                .role(updatedUser.getRole() != null ? updatedUser.getRole().name() : "User")
                .email(updatedUser.getEmail())
                .build();
    }
}
