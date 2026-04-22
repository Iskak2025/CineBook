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

    @Autowired
    private AdminService adminService;

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
                .isActive(updatedUser.isActive())
                .build();
    }

    public org.springframework.data.domain.Page<UserDto> getAllUsers(org.springframework.data.domain.Pageable pageable, String search, String role) {
        org.springframework.data.domain.Page<User> userPage;
        
        if (role != null && !role.isEmpty()) {
            userPage = userRepository.findByRole(Role.valueOf(role), pageable);
        } else if (search != null && !search.isEmpty()) {
            userPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
        return userPage.map(UserConvertor::entityToDto);
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateUserRole(Long id, Role role, Long adminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setRole(role);
        userRepository.save(user);
        adminService.logAction("Changed role for user ID " + id + " to " + role, adminId);
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateUserStatus(Long id, boolean isActive, Long adminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setActive(isActive);
        userRepository.save(user);
        adminService.logAction((isActive ? "Activated" : "Blocked") + " user ID " + id, adminId);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long id, Long adminId) {
        if (id.equals(adminId)) {
            throw new RuntimeException("You cannot delete yourself!");
        }
        userRepository.deleteById(id);
        adminService.logAction("Deleted user ID " + id, adminId);
    }

}
