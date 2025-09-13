package com.reservation.springapp.dto;

import com.reservation.springapp.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String restaurantName;
    private LocalDate date;
    private LocalTime time;
    private int partySize;
    private ReservationStatus status;

    // extra for owner/admin visibility
    private String customerName;
    private String customerEmail;

    // Existing constructor for customer’s own view (no customer info)
    public ReservationResponse(Long id, String restaurantName, LocalDate date,
                               LocalTime time, int partySize, ReservationStatus status) {
        this.id = id;
        this.restaurantName = restaurantName;
        this.date = date;
        this.time = time;
        this.partySize = partySize;
        this.status = status;
    }
}
