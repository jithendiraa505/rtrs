package com.reservation.springapp.controller;

import com.reservation.springapp.dto.RegisterRequest;
import com.reservation.springapp.dto.LoginRequest;
import com.reservation.springapp.dto.ApiResponse;
import com.reservation.springapp.model.User;
import com.reservation.springapp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Public: Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Public: Login and get JWT
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(new ApiResponse(true, "Bearer " + token));
    }

    /**
     * Admin Only: Get all users
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    /**
     * Admin Only: Delete a user
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.deleteUser(id));
    }

    /**
     * Admin Only: Change user role
     */
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> changeUserRole(@PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(authService.changeUserRole(id, role));
    }

    /**
     * Admin Only: Change user password
     */
    @PutMapping("/users/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> changeUserPassword(@PathVariable Long id, @RequestParam String password) {
        return ResponseEntity.ok(authService.changeUserPassword(id, password));
    }

    /**
     * Admin Only: Update user information
     */
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @RequestBody User userUpdate) {
        return ResponseEntity.ok(authService.updateUser(id, userUpdate));
    }
}
