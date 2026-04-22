package com.work.Movie.Booking.System.convertor;

import com.work.Movie.Booking.System.Dto.UserDto;
import com.work.Movie.Booking.System.entities.Ticket;
import com.work.Movie.Booking.System.entities.User;

import java.util.stream.Collectors;

public class UserConvertor {

    public static UserDto entityToDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .role(user.getRole())
                .email(user.getEmail())
                .isActive(user.isActive())
                .ticketIds(user.getTicketList() != null ? 
                        user.getTicketList().stream()
                                .map(Ticket::getId)
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public static User dtoToEntity(UserDto userDto) {
        if (userDto == null) return null;
        return User.builder()
                .id(userDto.getId())
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .role(userDto.getRole())
                .email(userDto.getEmail())
                .isActive(userDto.isActive())
                .build();
    }
}
