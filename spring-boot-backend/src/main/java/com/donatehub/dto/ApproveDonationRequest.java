package com.donatehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApproveDonationRequest {

    @NotBlank(message = "Donation ID is required")
    private String donationId;

    @NotNull(message = "Approved flag is required")
    private Boolean approved;

    private String rejectionReason;

    public ApproveDonationRequest() {
    }

    public ApproveDonationRequest(String donationId, Boolean approved, String rejectionReason) {
        this.donationId = donationId;
        this.approved = approved;
        this.rejectionReason = rejectionReason;
    }

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public static ApproveDonationRequestBuilder builder() {
        return new ApproveDonationRequestBuilder();
    }

    public static class ApproveDonationRequestBuilder {
        private String donationId;
        private Boolean approved;
        private String rejectionReason;

        public ApproveDonationRequestBuilder donationId(String donationId) {
            this.donationId = donationId;
            return this;
        }

        public ApproveDonationRequestBuilder approved(Boolean approved) {
            this.approved = approved;
            return this;
        }

        public ApproveDonationRequestBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public ApproveDonationRequest build() {
            return new ApproveDonationRequest(donationId, approved, rejectionReason);
        }
    }
}
