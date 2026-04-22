package com.work.Movie.Booking.System.controllers;

import com.work.Movie.Booking.System.Dto.AuthResponse;
import com.work.Movie.Booking.System.Dto.UserDto;
import com.work.Movie.Booking.System.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserDto userDto) {
        AuthResponse authResponse = userService.login(userDto);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto userDto) {
        UserDto registeredUser = userService.register(userDto);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return new ResponseEntity<>(userService.updateUser(id, userDto), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<UserDto>> getAllUsers(
            @org.springframework.data.web.PageableDefault(size = 10) org.springframework.data.domain.Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        return new ResponseEntity<>(userService.getAllUsers(pageable, search, role), HttpStatus.OK);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestParam com.work.Movie.Booking.System.enums.Role role, org.springframework.security.core.Authentication authentication) {
        com.work.Movie.Booking.System.jwt.CustomUserDetails admin = (com.work.Movie.Booking.System.jwt.CustomUserDetails) authentication.getPrincipal();
        userService.updateUserRole(id, role, admin.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateUserStatus(@PathVariable Long id, @RequestParam boolean isActive, org.springframework.security.core.Authentication authentication) {
        com.work.Movie.Booking.System.jwt.CustomUserDetails admin = (com.work.Movie.Booking.System.jwt.CustomUserDetails) authentication.getPrincipal();
        userService.updateUserStatus(id, isActive, admin.getId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        com.work.Movie.Booking.System.jwt.CustomUserDetails admin = (com.work.Movie.Booking.System.jwt.CustomUserDetails) authentication.getPrincipal();
        userService.deleteUser(id, admin.getId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
