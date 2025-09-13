package com.reservation.springapp.dto;


import com.reservation.springapp.model.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private ReservationStatus status;
}
