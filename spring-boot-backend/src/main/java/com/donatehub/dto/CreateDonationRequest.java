package com.donatehub.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateDonationRequest {

    @NotBlank(message = "Type is required (food, apparel, money)")
    private String type;

    private String trustId;

    // Food donation fields
    private Integer riceQty;
    private Integer vegQty;
    private Integer fruitsQty;

    // Apparel donation fields
    private Integer targetAge;

    // Money donation fields
    private String transactionId;

    @NotNull(message = "Amount is required for money donations")
    private BigDecimal amount;

    private String qrPayload;

    public CreateDonationRequest() {
    }

    public CreateDonationRequest(String type, String trustId, Integer riceQty, Integer vegQty, Integer fruitsQty, Integer targetAge, String transactionId, BigDecimal amount, String qrPayload) {
        this.type = type;
        this.trustId = trustId;
        this.riceQty = riceQty;
        this.vegQty = vegQty;
        this.fruitsQty = fruitsQty;
        this.targetAge = targetAge;
        this.transactionId = transactionId;
        this.amount = amount;
        this.qrPayload = qrPayload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTrustId() {
        return trustId;
    }

    public void setTrustId(String trustId) {
        this.trustId = trustId;
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

    public String getQrPayload() {
        return qrPayload;
    }

    public void setQrPayload(String qrPayload) {
        this.qrPayload = qrPayload;
    }

    public static CreateDonationRequestBuilder builder() {
        return new CreateDonationRequestBuilder();
    }

    public static class CreateDonationRequestBuilder {
        private String type;
        private String trustId;
        private Integer riceQty;
        private Integer vegQty;
        private Integer fruitsQty;
        private Integer targetAge;
        private String transactionId;
        private BigDecimal amount;
        private String qrPayload;

        public CreateDonationRequestBuilder type(String type) {
            this.type = type;
            return this;
        }

        public CreateDonationRequestBuilder trustId(String trustId) {
            this.trustId = trustId;
            return this;
        }

        public CreateDonationRequestBuilder riceQty(Integer riceQty) {
            this.riceQty = riceQty;
            return this;
        }

        public CreateDonationRequestBuilder vegQty(Integer vegQty) {
            this.vegQty = vegQty;
            return this;
        }

        public CreateDonationRequestBuilder fruitsQty(Integer fruitsQty) {
            this.fruitsQty = fruitsQty;
            return this;
        }

        public CreateDonationRequestBuilder targetAge(Integer targetAge) {
            this.targetAge = targetAge;
            return this;
        }

        public CreateDonationRequestBuilder transactionId(String transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public CreateDonationRequestBuilder amount(BigDecimal amount) {
            this.amount = amount;
            return this;
        }

        public CreateDonationRequestBuilder qrPayload(String qrPayload) {
            this.qrPayload = qrPayload;
            return this;
        }

        public CreateDonationRequest build() {
            return new CreateDonationRequest(type, trustId, riceQty, vegQty, fruitsQty, targetAge, transactionId, amount, qrPayload);
        }
    }
}
