package com.donatehub.service;

import com.donatehub.dto.*;
import com.donatehub.entity.User;
import com.donatehub.exception.ResourceAlreadyExistsException;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.UserRepository;
import com.donatehub.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already in use");
        }

        User user = User.builder()
                .id("u_" + UUID.randomUUID().toString().substring(0, 8))
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(User.UserRole.USER)
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateTokenFromUserId(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .success(true)
                .message("User registered successfully")
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .avatar(user.getAvatar())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .success(true)
                .message("User logged in successfully")
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .avatar(user.getAvatar())
                        .build())
                .build();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
