package com.donatehub.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_user_id_notif", columnList = "user_id"),
        @Index(name = "idx_is_read", columnList = "is_read")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "donation_id")
    private String donationId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType type = NotificationType.GENERAL;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Notification() {
    }

    public Notification(String userId, String message, NotificationType type) {
        this.userId = userId;
        this.message = message;
        this.type = type;
    }

    public Notification(String userId, String donationId, String message, NotificationType type) {
        this.userId = userId;
        this.donationId = donationId;
        this.message = message;
        this.type = type;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDonationId() {
        return donationId;
    }

    public void setDonationId(String donationId) {
        this.donationId = donationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private Integer id;
        private String userId;
        private String donationId;
        private String message;
        private NotificationType type = NotificationType.GENERAL;
        private Boolean isRead = false;
        private LocalDateTime createdAt;

        public NotificationBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public NotificationBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public NotificationBuilder donationId(String donationId) {
            this.donationId = donationId;
            return this;
        }

        public NotificationBuilder message(String message) {
            this.message = message;
            return this;
        }

        public NotificationBuilder type(NotificationType type) {
            this.type = type;
            return this;
        }

        public NotificationBuilder isRead(Boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        public NotificationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Notification build() {
            Notification notification = new Notification();
            notification.id = this.id;
            notification.userId = this.userId;
            notification.donationId = this.donationId;
            notification.message = this.message;
            notification.type = this.type;
            notification.isRead = this.isRead;
            notification.createdAt = this.createdAt;
            return notification;
        }
    }

    public enum NotificationType {
        APPROVAL, REJECTION, GENERAL
    }
}
