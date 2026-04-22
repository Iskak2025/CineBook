package com.work.Movie.Booking.System.Dto;

import com.work.Movie.Booking.System.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

    private String username;

    private String password;

    private Role role;

    private String email;

    private List<Long> ticketIds = new ArrayList<>();
}
