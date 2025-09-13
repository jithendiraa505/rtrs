package com.reservation.springapp.controller;

import com.reservation.springapp.dto.ReservationRequest;
import com.reservation.springapp.dto.ReservationResponse;
import com.reservation.springapp.dto.ReservationStatusUpdateRequest;
import com.reservation.springapp.model.ReservationStatus;
import com.reservation.springapp.security.CustomUserDetails;
import com.reservation.springapp.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * CUSTOMER only: Book a reservation
     */
    @PostMapping("/book")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReservationResponse> bookReservation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ReservationRequest request) {

        Long customerId = userDetails.getId();
        return ResponseEntity.ok(reservationService.createReservation(customerId, request));
    }

    /**
     * CUSTOMER only: View my reservations
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reservationService.getReservationsForCustomer(userDetails.getId()));
    }

    /**
     * OWNER only: View reservations for their restaurant
     */
   @GetMapping("/restaurant/{id}")
@PreAuthorize("hasRole('OWNER')")
public ResponseEntity<List<ReservationResponse>> getRestaurantReservations(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails) {

    return ResponseEntity.ok(
            reservationService.getReservationsForRestaurant(id, userDetails.getId(), userDetails.getRole().name())
    );
}


    /**
     * ADMIN / OWNER / CUSTOMER: Update reservation status (query param)
     * Example: PUT /api/reservations/101/status?status=CONFIRMED
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER','CUSTOMER')")
    public ResponseEntity<ReservationResponse> updateStatusWithQuery(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        ReservationStatus newStatus = ReservationStatus.valueOf(status.toUpperCase(java.util.Locale.ROOT));

        return ResponseEntity.ok(
                reservationService.updateStatusWithQuery(
                        id,
                        newStatus,
                        userDetails.getId(),
                        userDetails.getRole().name()
                )
        );
    }

    /**
     * ADMIN / OWNER / CUSTOMER: Update reservation status (JSON body)
     * Example: PUT /api/reservations/101/status-body
     * { "status": "CANCELLED" }
     */
    @PutMapping("/{id}/status-body")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER','CUSTOMER')")
    public ResponseEntity<ReservationResponse> updateStatusWithBody(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(
                reservationService.updateStatusWithBody(
                        id,
                        request,
                        userDetails.getId(),
                        userDetails.getRole().name()
                )
        );
    }
}
