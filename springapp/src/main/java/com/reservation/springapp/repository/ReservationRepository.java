package com.reservation.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reservation.springapp.model.Reservation;
import com.reservation.springapp.model.ReservationStatus;
import com.reservation.springapp.model.Restaurant;
import com.reservation.springapp.model.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCustomer(User customer);
    List<Reservation> findByRestaurant(Restaurant restaurant);
    List<Reservation> findByStatus(ReservationStatus status);

    // Check if a reservation exists for a restaurant at given date/time
    boolean existsByRestaurantAndDateAndTime(Restaurant restaurant, LocalDate date, LocalTime time);
    
    // Get all reservations for a restaurant at given date/time
    List<Reservation> findByRestaurantAndDateAndTime(Restaurant restaurant, LocalDate date, LocalTime time);
}
