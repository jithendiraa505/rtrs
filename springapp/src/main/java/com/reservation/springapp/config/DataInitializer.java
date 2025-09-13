package com.reservation.springapp.config;

import com.reservation.springapp.model.Role;
import com.reservation.springapp.model.User;
import com.reservation.springapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@restaurant.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }
}