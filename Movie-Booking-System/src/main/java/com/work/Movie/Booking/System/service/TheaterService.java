package com.work.Movie.Booking.System.service;

import com.work.Movie.Booking.System.Dto.TheaterDto;
import com.work.Movie.Booking.System.convertor.TheaterConvertor;
import com.work.Movie.Booking.System.entities.Theater;
import com.work.Movie.Booking.System.entities.TheaterSeat;
import com.work.Movie.Booking.System.enums.SeatType;
import com.work.Movie.Booking.System.repositories.TheaterRepository;
import com.work.Movie.Booking.System.repositories.TheaterSeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TheaterService {

    @Autowired
    private TheaterRepository theaterRepository;

    @Autowired
    private TheaterSeatRepository theaterSeatRepository;

    @Transactional
    public TheaterDto addTheater(TheaterDto theaterDto) {
        Theater theater = TheaterConvertor.dtoToEntity(theaterDto);
        
        List<TheaterSeat> theaterSeatList = new ArrayList<>();
        
        // Define rows for the theater layout
        String[] rows = {"A", "B", "C", "D"};
        
        for (String rowName : rows) {
            for (int i = 1; i <= 10; i++) {
                String seatNo = rowName + i;
                
                // Row A is designated as Premium, other rows are Classic
                SeatType type = rowName.equals("A") ? SeatType.PREMIUM : SeatType.CLASSIC;
                
                theaterSeatList.add(TheaterSeat.builder()
                        .seatNo(seatNo)
                        .seatType(type)
                        .theater(theater)
                        .build());
            }
        }
        
        theater.setTheaterSeatList(theaterSeatList);
        Theater savedTheater = theaterRepository.save(theater);
        
        return TheaterConvertor.entityToDto(savedTheater);
    }

    public TheaterDto getTheaterById(Long id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Театр не найден"));
        return TheaterConvertor.entityToDto(theater);
    }

    public TheaterDto getTheaterByName(String name) {
        Theater theater = theaterRepository.findByName(name);
        if (theater == null) {
            throw new RuntimeException("Театр " + name + " не найден");
        }
        return TheaterConvertor.entityToDto(theater);
    }

    @Transactional
    public void ensureGridSeats(Theater theater) {
        boolean hasCorrectGrid = theater.getTheaterSeatList().stream()
                .anyMatch(s -> s.getSeatNo().equals("A1"));

        if (!hasCorrectGrid) {
            // Wipe old mismatched seats
            theaterSeatRepository.deleteAll(theater.getTheaterSeatList());
            theater.getTheaterSeatList().clear();
            
            // Re-generate standard grid (A1-D10)
            String[] rows = {"A", "B", "C", "D"};
            for (String rowName : rows) {
                for (int i = 1; i <= 10; i++) {
                    String seatNo = rowName + i;
                    SeatType type = rowName.equals("A") ? SeatType.PREMIUM : SeatType.CLASSIC;
                    
                    TheaterSeat seat = TheaterSeat.builder()
                            .seatNo(seatNo)
                            .seatType(type)
                            .theater(theater)
                            .build();
                    theater.getTheaterSeatList().add(seat);
                }
            }
            theaterRepository.save(theater);
        }
    }

}
