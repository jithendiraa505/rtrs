package com.reservation.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reservation.springapp.model.Restaurant;
import com.reservation.springapp.model.User;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwner(User owner);
    List<Restaurant> findByLocationContainingIgnoreCase(String location);
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);
}
