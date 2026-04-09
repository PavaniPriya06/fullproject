package com.donatehub.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "money_donations", indexes = {
        @Index(name = "idx_donation_id_money", columnList = "donation_id"),
        @Index(name = "idx_transaction_id", columnList = "transaction_id")
})
public class MoneyDonation {

    @Id
    private String id;

    @Column(name = "donation_id", nullable = false, unique = true)
    private String donationId;

    @Column(nullable = false, length = 100)
    private String transactionId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "qr_payload", columnDefinition = "TEXT")
    private String qrPayload;

    @Column(name = "payment_status", nullable = false)
    private Boolean paymentStatus = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public MoneyDonation() {
        this.id = UUID.randomUUID().toString();
    }

    public MoneyDonation(String donationId, String transactionId, BigDecimal amount) {
        this();
        this.donationId = donationId;
        this.transactionId = transactionId;
        this.amount = amount;
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

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getQrPayload() {
        return qrPayload;
    }

    public void setQrPayload(String qrPayload) {
        this.qrPayload = qrPayload;
    }

    public Boolean getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(Boolean paymentStatus) {
        this.paymentStatus = paymentStatus;
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

    public static MoneyDonationBuilder builder() {
        return new MoneyDonationBuilder();
    }

    public static class MoneyDonationBuilder {
        private String id;
        private String donationId;
        private String transactionId;
        private BigDecimal amount;
        private String qrPayload;
        private Boolean paymentStatus = true;
        private LocalDateTime createdAt;

        public MoneyDonationBuilder id(String id) {
            this.id = id;
            return this;
        }

        public MoneyDonationBuilder donationId(String donationId) {
            this.donationId = donationId;
            return this;
        }

        public MoneyDonationBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public MoneyDonationBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public MoneyDonationBuilder qrPayload(String qrPayload) {
            this.qrPayload = qrPayload;
            return this;
        }

        public MoneyDonationBuilder paymentStatus(Boolean paymentStatus) {
            this.paymentStatus = paymentStatus;
            return this;
        }

        public MoneyDonationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public MoneyDonation build() {
            MoneyDonation moneyDonation = new MoneyDonation();
            moneyDonation.id = (this.id != null) ? this.id : UUID.randomUUID().toString();
            moneyDonation.donationId = this.donationId;
            moneyDonation.transactionId = this.transactionId;
            moneyDonation.amount = this.amount;
            moneyDonation.qrPayload = this.qrPayload;
            moneyDonation.paymentStatus = this.paymentStatus;
            moneyDonation.createdAt = this.createdAt;
            return moneyDonation;
        }
    }
}
