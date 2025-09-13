package com.reservation.springapp.service;

import com.reservation.springapp.model.Restaurant;
import com.reservation.springapp.model.User;
import com.reservation.springapp.repository.RestaurantRepository;
import com.reservation.springapp.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ReservationRepository reservationRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, ReservationRepository reservationRepository) {
        this.restaurantRepository = restaurantRepository;
        this.reservationRepository = reservationRepository;
    }

    public Restaurant addRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public int getAvailableCapacity(Long restaurantId, java.time.LocalDate date, java.time.LocalTime time) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        int totalReserved = reservationRepository.findByRestaurantAndDateAndTime(restaurant, date, time)
                .stream()
                .filter(r -> r.getStatus() != com.reservation.springapp.model.ReservationStatus.CANCELLED)
                .mapToInt(r -> r.getPartySize())
                .sum();
        
        return Math.max(0, restaurant.getCapacity() - totalReserved);
    }

    public Restaurant updateAvailability(Long restaurantId, Boolean available, Long ownerId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        if (!restaurant.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not the owner of this restaurant");
        }
        
        restaurant.setAvailable(available);
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public List<Restaurant> searchByLocation(String location) {
        return restaurantRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Restaurant> searchByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineContainingIgnoreCase(cuisine);
    }

    public List<Restaurant> getByOwner(User owner) {
        return restaurantRepository.findByOwner(owner);
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurant) {
        Restaurant existing = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        existing.setName(restaurant.getName());
        existing.setLocation(restaurant.getLocation());
        existing.setCuisine(restaurant.getCuisine());
        existing.setCapacity(restaurant.getCapacity());
        existing.setOwner(restaurant.getOwner());
        
        return restaurantRepository.save(existing);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public void deleteMyRestaurant(Long restaurantId, Long ownerId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        
        if (!restaurant.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not the owner of this restaurant");
        }
        
        restaurantRepository.deleteById(restaurantId);
    }
}
