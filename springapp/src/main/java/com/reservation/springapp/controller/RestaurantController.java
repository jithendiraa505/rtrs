package com.reservation.springapp.controller;

import com.reservation.springapp.model.Restaurant;
import com.reservation.springapp.model.User;
import com.reservation.springapp.security.CustomUserDetails;
import com.reservation.springapp.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    /**
     * OWNER only: Add a new restaurant
     */
    @PostMapping("/add")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Restaurant> addRestaurant(@RequestBody Restaurant restaurant,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        User owner = new User();
        owner.setId(userDetails.getId());
        restaurant.setOwner(owner);
        return ResponseEntity.ok(restaurantService.addRestaurant(restaurant));
    }

    /**
     * ADMIN only: Add restaurant for any owner
     */
    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Restaurant> addRestaurantByAdmin(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.addRestaurant(restaurant));
    }

    /**
     * ADMIN only: Update restaurant
     */
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
    }

    /**
     * ADMIN only: Delete restaurant
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Public: List all restaurants
     */
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAll() {
        try {
            List<Restaurant> restaurants = restaurantService.getAllRestaurants();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Arrays.asList());
        }
    }

    /**
     * Public: Search by location
     */
    @GetMapping("/search/location")
    public ResponseEntity<List<Restaurant>> searchByLocation(@RequestParam String location) {
        return ResponseEntity.ok(restaurantService.searchByLocation(location));
    }

    /**
     * Public: Search by cuisine
     */
    @GetMapping("/search/cuisine")
    public ResponseEntity<List<Restaurant>> searchByCuisine(@RequestParam String cuisine) {
        return ResponseEntity.ok(restaurantService.searchByCuisine(cuisine));
    }

    /**
     * Public: Get available capacity for a restaurant at specific date/time
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<Integer> getAvailableCapacity(
            @PathVariable Long id,
            @RequestParam String date,
            @RequestParam String time) {
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        java.time.LocalTime localTime = java.time.LocalTime.parse(time);
        int available = restaurantService.getAvailableCapacity(id, localDate, localTime);
        return ResponseEntity.ok(available);
    }

    /**
     * OWNER only: Get restaurants owned by current user
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Restaurant>> getMyRestaurants(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User owner = new User();
        owner.setId(userDetails.getId());
        return ResponseEntity.ok(restaurantService.getByOwner(owner));
    }

    /**
     * OWNER only: Update restaurant availability
     */
    @PutMapping("/my/{id}/availability")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Restaurant> updateAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(restaurantService.updateAvailability(id, available, userDetails.getId()));
    }

    /**
     * OWNER only: Delete own restaurant
     */
    @DeleteMapping("/my/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteMyRestaurant(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        restaurantService.deleteMyRestaurant(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }
}
