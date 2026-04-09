package com.donatehub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DonationResponse {

    private String id;
    private String userId;
    private String type;
    private String status;
    private String trustId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Food donation details
    private Integer riceQty;
    private Integer vegQty;
    private Integer fruitsQty;

    // Apparel donation details
    private Integer targetAge;

    // Money donation details
    private String transactionId;
    private BigDecimal amount;

    private String approvedBy;
    private LocalDateTime approvedAt;
    private String rejectionReason;

    public DonationResponse() {
    }

    public DonationResponse(String id, String userId, String type, String status, String trustId, LocalDateTime createdAt, LocalDateTime updatedAt, Integer riceQty, Integer vegQty, Integer fruitsQty, Integer targetAge, String transactionId, BigDecimal amount, String approvedBy, LocalDateTime approvedAt, String rejectionReason) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.status = status;
        this.trustId = trustId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.riceQty = riceQty;
        this.vegQty = vegQty;
        this.fruitsQty = fruitsQty;
        this.targetAge = targetAge;
        this.transactionId = transactionId;
        this.amount = amount;
        this.approvedBy = approvedBy;
        this.approvedAt = approvedAt;
        this.rejectionReason = rejectionReason;
    }

    // Getters and setters
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTrustId() {
        return trustId;
    }

    public void setTrustId(String trustId) {
        this.trustId = trustId;
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

    public Integer getTargetAge() {
        return targetAge;
    }

    public void setTargetAge(Integer targetAge) {
        this.targetAge = targetAge;
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

    public static DonationResponseBuilder builder() {
        return new DonationResponseBuilder();
    }

    public static class DonationResponseBuilder {
        private String id;
        private String userId;
        private String type;
        private String status;
        private String trustId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Integer riceQty;
        private Integer vegQty;
        private Integer fruitsQty;
        private Integer targetAge;
        private String transactionId;
        private BigDecimal amount;
        private String approvedBy;
        private LocalDateTime approvedAt;
        private String rejectionReason;

        public DonationResponseBuilder id(String id) {
            this.id = id;
            return this;
        }

        public DonationResponseBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public DonationResponseBuilder type(String type) {
            this.type = type;
            return this;
        }

        public DonationResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public DonationResponseBuilder trustId(String trustId) {
            this.trustId = trustId;
            return this;
        }

        public DonationResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public DonationResponseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public DonationResponseBuilder riceQty(Integer riceQty) {
            this.riceQty = riceQty;
            return this;
        }

        public DonationResponseBuilder vegQty(Integer vegQty) {
            this.vegQty = vegQty;
            return this;
        }

        public DonationResponseBuilder fruitsQty(Integer fruitsQty) {
            this.fruitsQty = fruitsQty;
            return this;
        }

        public DonationResponseBuilder targetAge(Integer targetAge) {
            this.targetAge = targetAge;
            return this;
        }

        public DonationResponseBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public DonationResponseBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public DonationResponseBuilder approvedBy(String approvedBy) {
            this.approvedBy = approvedBy;
            return this;
        }

        public DonationResponseBuilder approvedAt(LocalDateTime approvedAt) {
            this.approvedAt = approvedAt;
            return this;
        }

        public DonationResponseBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public DonationResponse build() {
            return new DonationResponse(id, userId, type, status, trustId, createdAt, updatedAt, riceQty, vegQty, fruitsQty, targetAge, transactionId, amount, approvedBy, approvedAt, rejectionReason);
        }
    }
}
