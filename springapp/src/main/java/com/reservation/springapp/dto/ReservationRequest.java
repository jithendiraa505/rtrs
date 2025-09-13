package com.reservation.springapp.dto;


import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationRequest {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotNull(message = "Reservation date is required")
    @FutureOrPresent(message = "Date must be today or future")
    private LocalDate date;

    @NotNull(message = "Reservation time is required")
    private LocalTime time;

    @NotNull(message = "Party size is required")
    @Min(value = 1, message = "At least 1 guest required")
    private Integer partySize;
}
