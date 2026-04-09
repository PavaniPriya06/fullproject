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
@Table(name = "food_donations", indexes = {
        @Index(name = "idx_donation_id_food", columnList = "donation_id")
})
public class FoodDonation {

    @Id
    private String id;

    @Column(name = "donation_id", nullable = false, unique = true)
    private String donationId;

    @Column(nullable = false)
    private Integer riceQty = 0;

    @Column(nullable = false)
    private Integer vegQty = 0;

    @Column(nullable = false)
    private Integer fruitsQty = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public FoodDonation() {
        this.id = UUID.randomUUID().toString();
    }

    public FoodDonation(String donationId, Integer riceQty, Integer vegQty, Integer fruitsQty) {
        this();
        this.donationId = donationId;
        this.riceQty = riceQty;
        this.vegQty = vegQty;
        this.fruitsQty = fruitsQty;
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

    public Integer getRiceQty() {
        return riceQty;
    }

    public void setRiceQty(Integer riceQty) {
        this.riceQty = riceQty;
    }

    public Integer getVegQty() {
        return vegQty;
    }

    public void setVegQty(Integer vegQty) {
        this.vegQty = vegQty;
    }

    public Integer getFruitsQty() {
        return fruitsQty;
    }

    public void setFruitsQty(Integer fruitsQty) {
        this.fruitsQty = fruitsQty;
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

    public static FoodDonationBuilder builder() {
        return new FoodDonationBuilder();
    }

    public static class FoodDonationBuilder {
        private String id;
        private String donationId;
        private Integer riceQty = 0;
        private Integer vegQty = 0;
        private Integer fruitsQty = 0;
        private LocalDateTime createdAt;

        public FoodDonationBuilder id(String id) {
            this.id = id;
            return this;
        }

        public FoodDonationBuilder donationId(String donationId) {
            this.donationId = donationId;
            return this;
        }

        public FoodDonationBuilder riceQty(Integer riceQty) {
            this.riceQty = riceQty;
            return this;
        }

        public FoodDonationBuilder vegQty(Integer vegQty) {
            this.vegQty = vegQty;
            return this;
        }

        public FoodDonationBuilder fruitsQty(Integer fruitsQty) {
            this.fruitsQty = fruitsQty;
            return this;
        }

        public FoodDonationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public FoodDonation build() {
            FoodDonation foodDonation = new FoodDonation();
            foodDonation.id = (this.id != null) ? this.id : UUID.randomUUID().toString();
            foodDonation.donationId = this.donationId;
            foodDonation.riceQty = this.riceQty;
            foodDonation.vegQty = this.vegQty;
            foodDonation.fruitsQty = this.fruitsQty;
            foodDonation.createdAt = this.createdAt;
            return foodDonation;
        }
    }
}
