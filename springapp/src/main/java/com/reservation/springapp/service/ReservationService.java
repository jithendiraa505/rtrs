package com.reservation.springapp.service;

import com.reservation.springapp.dto.ReservationRequest;
import com.reservation.springapp.dto.ReservationResponse;
import com.reservation.springapp.dto.ReservationStatusUpdateRequest;
import com.reservation.springapp.model.*;
import com.reservation.springapp.repository.ReservationRepository;
import com.reservation.springapp.repository.RestaurantRepository;
import com.reservation.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final RestaurantService restaurantService;

    public ReservationService(ReservationRepository reservationRepository,
                              RestaurantRepository restaurantRepository,
                              UserRepository userRepository,
                              RestaurantService restaurantService) {
        this.reservationRepository = reservationRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.restaurantService = restaurantService;
    }

    private int getAvailableCapacity(Long restaurantId, java.time.LocalDate date, java.time.LocalTime time) {
        return restaurantService.getAvailableCapacity(restaurantId, date, time);
    }

    // ------------------------
    // Create new reservation
    // ------------------------
    public ReservationResponse createReservation(Long customerId, ReservationRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // check if restaurant is available
        if (!restaurant.getAvailable()) {
            throw new RuntimeException("Restaurant is currently unavailable for reservations");
        }

        // check if already booked at same time
        if (reservationRepository.existsByRestaurantAndDateAndTime(restaurant, request.getDate(), request.getTime())) {
            throw new RuntimeException("This time slot is already booked!");
        }

        Reservation reservation = Reservation.builder()
                .customer(customer)
                .restaurant(restaurant)
                .date(request.getDate())
                .time(request.getTime())
                .partySize(request.getPartySize())
                .status(ReservationStatus.PENDING)
                .build();

        reservationRepository.save(reservation);

        return createReservationResponse(reservation);
    }

    // ------------------------
    // Customer reservations
    // ------------------------
    public List<ReservationResponse> getReservationsForCustomer(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return reservationRepository.findByCustomer(customer).stream()
                .map(r -> new ReservationResponse(
                        r.getId(),
                        r.getRestaurant().getName(),
                        r.getDate(),
                        r.getTime(),
                        r.getPartySize(),
                        r.getStatus()
                ))
                .collect(Collectors.toList());
    }

    // ------------------------
    // Restaurant reservations
    // ------------------------
    public List<ReservationResponse> getReservationsForRestaurant(Long restaurantId, Long ownerId, String role) {
    Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    // Ensure OWNER only accesses their own restaurant
    if ("OWNER".equals(role) && !restaurant.getOwner().getId().equals(ownerId)) {
        throw new RuntimeException("You are not the owner of this restaurant");
    }

    return reservationRepository.findByRestaurant(restaurant).stream()
            .map(r -> new ReservationResponse(
                    r.getId(),
                    restaurant.getName(),
                    r.getDate(),
                    r.getTime(),
                    r.getPartySize(),
                    r.getStatus(),
                    r.getCustomer().getUsername(),   // 👈 include customer details
                    r.getCustomer().getEmail()
            ))
            .collect(Collectors.toList());
}


    // ------------------------
    // Update Reservation (Method 1: via query param)
    // ------------------------
    public ReservationResponse updateStatusWithQuery(Long reservationId,
                                                     ReservationStatus newStatus,
                                                     Long userId,
                                                     String role) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        validateReservationAccess(reservation, userId, role, newStatus);
        reservation.setStatus(newStatus);
        reservationRepository.save(reservation);

        return createReservationResponse(reservation);
    }

    private void validateReservationAccess(Reservation reservation, Long userId, String role, ReservationStatus newStatus) {
        // OWNER validation
        if ("OWNER".equals(role) && !reservation.getRestaurant().getOwner().getId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this restaurant");
        }

        // CUSTOMER validation
        if ("CUSTOMER".equals(role)) {
            if (!reservation.getCustomer().getId().equals(userId)) {
                throw new RuntimeException("You can only update your own reservations");
            }
            if (newStatus != ReservationStatus.CANCELLED) {
                throw new RuntimeException("Customers can only cancel reservations");
            }
        }
    }

    private ReservationResponse createReservationResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getRestaurant().getName(),
                reservation.getDate(),
                reservation.getTime(),
                reservation.getPartySize(),
                reservation.getStatus()
        );
    }



    

    // ------------------------
    // Update Reservation (Method 2: via JSON body DTO)
    // ------------------------
    public ReservationResponse updateStatusWithBody(Long reservationId,
                                                    ReservationStatusUpdateRequest request,
                                                    Long userId,
                                                    String role) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        ReservationStatus newStatus = request.getStatus();
        validateReservationAccess(reservation, userId, role, newStatus);
        reservation.setStatus(newStatus);
        reservationRepository.save(reservation);

        return createReservationResponse(reservation);
    }
}
