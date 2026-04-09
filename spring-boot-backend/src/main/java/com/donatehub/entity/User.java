package com.donatehub.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_role", columnList = "role")
})
public class User implements UserDetails {

    @Id
    private String id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String fullName;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Column(length = 255)
    private String avatar;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalDonated = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer donationsCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public User(String fullName, String email, String password, UserRole role) {
        this();
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public User(String id, String fullName, String email, String password, UserRole role, String avatar, BigDecimal totalDonated, Integer donationsCount, LocalDateTime joinedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.avatar = avatar;
        this.totalDonated = totalDonated;
        this.donationsCount = donationsCount;
        this.joinedAt = joinedAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatar() {
        return avatar;
    }

    public BigDecimal getTotalDonated() {
        return totalDonated;
    }

    public Integer getDonationsCount() {
        return donationsCount;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public UserRole getRole() {
        return role;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public void setTotalDonated(BigDecimal totalDonated) {
        this.totalDonated = totalDonated;
    }

    public void setDonationsCount(Integer donationsCount) {
        this.donationsCount = donationsCount;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        joinedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + this.role.name())
        );
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum UserRole {
        USER, ADMIN
    }

    // Builder pattern for convenient construction
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String id;
        private String fullName;
        private String email;
        private String password;
        private UserRole role = UserRole.USER;
        private String avatar;
        private BigDecimal totalDonated = BigDecimal.ZERO;
        private Integer donationsCount = 0;
        private LocalDateTime joinedAt;
        private LocalDateTime updatedAt;

        public UserBuilder id(String id) {
            this.id = id;
            return this;
        }

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder role(UserRole role) {
            this.role = role;
            return this;
        }

        public UserBuilder avatar(String avatar) {
            this.avatar = avatar;
            return this;
        }

        public UserBuilder totalDonated(BigDecimal totalDonated) {
            this.totalDonated = totalDonated;
            return this;
        }

        public UserBuilder donationsCount(Integer donationsCount) {
            this.donationsCount = donationsCount;
            return this;
        }

        public UserBuilder joinedAt(LocalDateTime joinedAt) {
            this.joinedAt = joinedAt;
            return this;
        }

        public UserBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public User build() {
            User user = new User(id, fullName, email, password, role, avatar, totalDonated, donationsCount, joinedAt, updatedAt);
            return user;
        }
    }
}
