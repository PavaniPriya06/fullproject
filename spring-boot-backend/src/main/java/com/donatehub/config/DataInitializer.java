package com.donatehub.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.donatehub.entity.User;
import com.donatehub.repository.UserRepository;

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
        // Check if admin user already exists
        if (userRepository.findByEmail("admin@donatehub.com").isEmpty()) {
            // Create admin user with BCrypt hashed password
            User adminUser = new User();
            adminUser.setId("admin-001");
            adminUser.setFullName("Admin User");
            adminUser.setEmail("admin@donatehub.com");
            // Password: Admin@123 - hashed with BCrypt
            adminUser.setPassword("$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu");
            adminUser.setRole(User.UserRole.ADMIN);
            adminUser.setTotalDonated(BigDecimal.ZERO);
            adminUser.setDonationsCount(0);
            adminUser.setJoinedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());

            userRepository.save(adminUser);
            System.out.println("✅ Admin user created successfully (admin@donatehub.com / Admin@123)");
        } else {
            System.out.println("✅ Admin user already exists");
        }
    }
}
