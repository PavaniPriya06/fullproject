package com.donatehub.controller;

import com.donatehub.dto.ApproveDonationRequest;
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
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    @Autowired
    private DonationService donationService;

    @GetMapping("/donations/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<DonationResponse> donations = donationService.getPendingDonations(pageable);
            
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

    @PutMapping("/donations/{donationId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveDonation(
            @PathVariable String donationId,
            @Valid @RequestBody ApproveDonationRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String approverId = userDetails.getUsername();
            
            DonationResponse donation = donationService.approveDonation(
                    donationId, request, approverId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", request.getApproved() ? 
                    "Donation approved successfully" : "Donation rejected successfully");
            response.put("data", donation);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
