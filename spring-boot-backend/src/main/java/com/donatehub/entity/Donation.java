package com.donatehub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "donations", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_type", columnList = "type"),
        @Index(name = "idx_status", columnList = "donation_status"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
public class Donation {

    @Id
    private String id;

    @NotBlank
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DonationType type;

    @Column(name = "trust_id", length = 50)
    private String trustId;

    @Enumerated(EnumType.STRING)
    @Column(name = "donation_status", nullable = false, length = 20)
    private DonationStatus status = DonationStatus.PENDING;

    @Column(name = "approved_by", length = 50)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Donation() {
        this.id = UUID.randomUUID().toString();
    }

    public Donation(String userId, DonationType type, String trustId) {
        this();
        this.userId = userId;
        this.type = type;
        this.trustId = trustId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public DonationType getType() {
        return type;
    }

    public void setType(DonationType type) {
        this.type = type;
    }

    public String getTrustId() {
        return trustId;
    }

    public void setTrustId(String trustId) {
        this.trustId = trustId;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static DonationBuilder builder() {
        return new DonationBuilder();
    }

    public static class DonationBuilder {
        private String id;
        private String userId;
        private DonationType type;
        private String trustId;
        private DonationStatus status = DonationStatus.PENDING;
        private String approvedBy;
        private LocalDateTime approvedAt;
        private String rejectionReason;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public DonationBuilder id(String id) {
            this.id = id;
            return this;
        }

        public DonationBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public DonationBuilder type(DonationType type) {
            this.type = type;
            return this;
        }

        public DonationBuilder trustId(String trustId) {
            this.trustId = trustId;
            return this;
        }

        public DonationBuilder status(DonationStatus status) {
            this.status = status;
            return this;
        }

        public DonationBuilder approvedBy(String approvedBy) {
            this.approvedBy = approvedBy;
            return this;
        }

        public DonationBuilder approvedAt(LocalDateTime approvedAt) {
            this.approvedAt = approvedAt;
            return this;
        }

        public DonationBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public DonationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DonationBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Donation build() {
            Donation donation = new Donation();
            donation.id = (this.id != null) ? this.id : UUID.randomUUID().toString();
            donation.userId = this.userId;
            donation.type = this.type;
            donation.trustId = this.trustId;
            donation.status = this.status;
            donation.approvedBy = this.approvedBy;
            donation.approvedAt = this.approvedAt;
            donation.rejectionReason = this.rejectionReason;
            donation.createdAt = this.createdAt;
            donation.updatedAt = this.updatedAt;
            return donation;
        }
    }

    public enum DonationType {
        FOOD, APPAREL, MONEY
    }

    public enum DonationStatus {
        PENDING, APPROVED, REJECTED
    }
}
