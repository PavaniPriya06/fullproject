package com.donatehub.controller;

import com.donatehub.dto.ApproveDonationRequest;
import com.donatehub.dto.CreateDonationRequest;
import com.donatehub.dto.DonationResponse;
import com.donatehub.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createDonation(
            @Valid @RequestBody CreateDonationRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();
            
            DonationResponse donation = donationService.createDonation(userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Donation created successfully");
            response.put("data", donation);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getDonation(@PathVariable String id) {
        try {
            DonationResponse donation = donationService.getDonationById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", donation);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserDonations(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String userId = userDetails.getUsername();
            
            Pageable pageable = PageRequest.of(page, size);
            Page<DonationResponse> donations = donationService.getUserDonations(userId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", donations.getContent());
            response.put("totalPages", donations.getTotalPages());
            response.put("totalElements", donations.getTotalElements());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
