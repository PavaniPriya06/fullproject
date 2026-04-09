package com.donatehub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "apparel_donations", indexes = {
        @Index(name = "idx_donation_id_apparel", columnList = "donation_id")
})
public class ApparelDonation {

    @Id
    private String id;

    @Column(name = "donation_id", nullable = false, unique = true)
    private String donationId;

    @Column(nullable = false)
    private Integer targetAge;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ApparelDonation() {
        this.id = UUID.randomUUID().toString();
    }

    public ApparelDonation(String donationId, Integer targetAge) {
        this();
        this.donationId = donationId;
        this.targetAge = targetAge;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

    public Integer getTargetAge() {
        return targetAge;
    }

    public void setTargetAge(Integer targetAge) {
        this.targetAge = targetAge;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
    }

    public static ApparelDonationBuilder builder() {
        return new ApparelDonationBuilder();
    }

    public static class ApparelDonationBuilder {
        private String id;
        private String donationId;
        private Integer targetAge;
        private LocalDateTime createdAt;

        public ApparelDonationBuilder id(String id) {
            this.id = id;
            return this;
        }

        public ApparelDonationBuilder donationId(String donationId) {
            this.donationId = donationId;
            return this;
        }

        public ApparelDonationBuilder targetAge(Integer targetAge) {
            this.targetAge = targetAge;
            return this;
        }

        public ApparelDonationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ApparelDonation build() {
            ApparelDonation apparelDonation = new ApparelDonation();
            apparelDonation.id = (this.id != null) ? this.id : UUID.randomUUID().toString();
            apparelDonation.donationId = this.donationId;
            apparelDonation.targetAge = this.targetAge;
            apparelDonation.createdAt = this.createdAt;
            return apparelDonation;
        }
    }
}
