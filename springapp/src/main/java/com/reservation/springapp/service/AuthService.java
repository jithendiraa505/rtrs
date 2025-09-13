package com.reservation.springapp.service;

import com.reservation.springapp.dto.RegisterRequest;
import com.reservation.springapp.dto.LoginRequest;
import com.reservation.springapp.dto.ApiResponse;
import com.reservation.springapp.model.Role;
import com.reservation.springapp.model.User;
import com.reservation.springapp.repository.UserRepository;
import com.reservation.springapp.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user
     */
    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new ApiResponse(false, "Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.valueOf(request.getRole().toUpperCase(java.util.Locale.ROOT)))
                .build();

        userRepository.save(user);
        return new ApiResponse(true, "User registered successfully");
    }

    /**
     * Login and return JWT token
     */
    public String login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtUtil.generateToken(user.getUsername(), user.getRole().name());
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Get user by username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * List all users (useful for admin)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Delete user by ID (admin-only)
     */
    public ApiResponse deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return new ApiResponse(false, "User not found");
        }
        userRepository.deleteById(id);
        return new ApiResponse(true, "User deleted successfully");
    }

    /**
     * Change user role (admin-only)
     */
    public ApiResponse changeUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(newRole.toUpperCase(java.util.Locale.ROOT)));
        userRepository.save(user);
        return new ApiResponse(true, "User role updated to " + newRole);
    }

    /**
     * Change user password (admin-only)
     */
    public ApiResponse changeUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return new ApiResponse(true, "Password updated successfully");
    }

    /**
     * Update user information (admin-only)
     */
    public ApiResponse updateUser(Long userId, User userUpdate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if username is being changed and if it already exists
        if (!user.getUsername().equals(userUpdate.getUsername()) && 
            userRepository.existsByUsername(userUpdate.getUsername())) {
            return new ApiResponse(false, "Username already exists");
        }
        
        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(userUpdate.getEmail()) && 
            userRepository.existsByEmail(userUpdate.getEmail())) {
            return new ApiResponse(false, "Email already registered");
        }
        
        user.setUsername(userUpdate.getUsername());
        user.setEmail(userUpdate.getEmail());
        userRepository.save(user);
        return new ApiResponse(true, "User updated successfully");
    }
}
