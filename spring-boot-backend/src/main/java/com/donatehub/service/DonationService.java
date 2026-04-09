package com.donatehub.service;

import com.donatehub.dto.ApproveDonationRequest;
import com.donatehub.dto.CreateDonationRequest;
import com.donatehub.dto.DonationResponse;
import com.donatehub.entity.*;
import com.donatehub.exception.ResourceNotFoundException;
import com.donatehub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private ApparelDonationRepository apparelDonationRepository;

    @Autowired
    private MoneyDonationRepository moneyDonationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional
    public DonationResponse createDonation(String userId, CreateDonationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String donationId = "d_" + UUID.randomUUID().toString().substring(0, 12);

        Donation donation = Donation.builder()
                .id(donationId)
                .userId(userId)
                .type(Donation.DonationType.valueOf(request.getType().toUpperCase()))
                .trustId(request.getTrustId())
                .status(Donation.DonationStatus.PENDING)
                .build();

        donation = donationRepository.save(donation);

        // Handle specific donation types
        if ("food".equalsIgnoreCase(request.getType())) {
            FoodDonation foodDonation = FoodDonation.builder()
                    .id("fd_" + UUID.randomUUID().toString().substring(0, 12))
                    .donationId(donationId)
                    .riceQty(request.getRiceQty() != null ? request.getRiceQty() : 0)
                    .vegQty(request.getVegQty() != null ? request.getVegQty() : 0)
                    .fruitsQty(request.getFruitsQty() != null ? request.getFruitsQty() : 0)
                    .build();
            foodDonationRepository.save(foodDonation);
        } else if ("apparel".equalsIgnoreCase(request.getType())) {
            ApparelDonation apparelDonation = ApparelDonation.builder()
                    .id("ad_" + UUID.randomUUID().toString().substring(0, 12))
                    .donationId(donationId)
                    .targetAge(request.getTargetAge())
                    .build();
            apparelDonationRepository.save(apparelDonation);
        } else if ("money".equalsIgnoreCase(request.getType())) {
            MoneyDonation moneyDonation = MoneyDonation.builder()
                    .id("md_" + UUID.randomUUID().toString().substring(0, 12))
                    .donationId(donationId)
                    .transactionId(request.getTransactionId())
                    .amount(request.getAmount())
                    .qrPayload(request.getQrPayload())
                    .paymentStatus(true)
                    .build();
            moneyDonationRepository.save(moneyDonation);
        }

        // Update user stats
        user.setDonationsCount(user.getDonationsCount() + 1);
        if ("money".equalsIgnoreCase(request.getType()) && request.getAmount() != null) {
            user.setTotalDonated(user.getTotalDonated().add(request.getAmount()));
        }
        userRepository.save(user);

        return convertToResponse(donation, request);
    }

    public Page<DonationResponse> getUserDonations(String userId, Pageable pageable) {
        Page<Donation> donations = donationRepository.findByUserId(userId, pageable);
        return donations.map(this::convertToResponse);
    }

    public Page<DonationResponse> getPendingDonations(Pageable pageable) {
        Page<Donation> donations = donationRepository.findByStatus(
                Donation.DonationStatus.PENDING, pageable);
        return donations.map(this::convertToResponse);
    }

    public DonationResponse getDonationById(String donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        return convertToResponse(donation);
    }

    @Transactional
    public DonationResponse approveDonation(String donationId, ApproveDonationRequest request, 
                                           String approvedBy) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));

        if (request.getApproved()) {
            donation.setStatus(Donation.DonationStatus.APPROVED);
            donation.setApprovedBy(approvedBy);
            donation.setApprovedAt(LocalDateTime.now());

            // Create notification
            Notification notification = Notification.builder()
                    .userId(donation.getUserId())
                    .donationId(donationId)
                    .message("Your donation has been approved!")
                    .type(Notification.NotificationType.APPROVAL)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        } else {
            donation.setStatus(Donation.DonationStatus.REJECTED);
            donation.setApprovedBy(approvedBy);
            donation.setRejectionReason(request.getRejectionReason());

            // Create notification
            Notification notification = Notification.builder()
                    .userId(donation.getUserId())
                    .donationId(donationId)
                    .message("Your donation has been rejected: " + request.getRejectionReason())
                    .type(Notification.NotificationType.REJECTION)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }

        donation = donationRepository.save(donation);
        return convertToResponse(donation);
    }

    private DonationResponse convertToResponse(Donation donation) {
        DonationResponse response = DonationResponse.builder()
                .id(donation.getId())
                .userId(donation.getUserId())
                .type(donation.getType().toString())
                .status(donation.getStatus().toString())
                .trustId(donation.getTrustId())
                .createdAt(donation.getCreatedAt())
                .updatedAt(donation.getUpdatedAt())
                .approvedBy(donation.getApprovedBy())
                .approvedAt(donation.getApprovedAt())
                .rejectionReason(donation.getRejectionReason())
                .build();

        // Add type-specific details
        if (Donation.DonationType.FOOD.equals(donation.getType())) {
            foodDonationRepository.findByDonationId(donation.getId()).ifPresent(fd -> {
                response.setRiceQty(fd.getRiceQty());
                response.setVegQty(fd.getVegQty());
                response.setFruitsQty(fd.getFruitsQty());
            });
        } else if (Donation.DonationType.APPAREL.equals(donation.getType())) {
            apparelDonationRepository.findByDonationId(donation.getId()).ifPresent(ad -> {
                response.setTargetAge(ad.getTargetAge());
            });
        } else if (Donation.DonationType.MONEY.equals(donation.getType())) {
            moneyDonationRepository.findByDonationId(donation.getId()).ifPresent(md -> {
                response.setTransactionId(md.getTransactionId());
                response.setAmount(md.getAmount());
            });
        }

        return response;
    }

    private DonationResponse convertToResponse(Donation donation, CreateDonationRequest request) {
        DonationResponse response = convertToResponse(donation);
        
        if ("food".equalsIgnoreCase(request.getType())) {
            response.setRiceQty(request.getRiceQty());
            response.setVegQty(request.getVegQty());
            response.setFruitsQty(request.getFruitsQty());
        } else if ("apparel".equalsIgnoreCase(request.getType())) {
            response.setTargetAge(request.getTargetAge());
        } else if ("money".equalsIgnoreCase(request.getType())) {
            response.setTransactionId(request.getTransactionId());
            response.setAmount(request.getAmount());
        }

        return response;
    }
}
