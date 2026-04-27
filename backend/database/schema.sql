-- DonateHub Database Schema
-- MySQL Database for Donation Management System

-- Create database
CREATE DATABASE IF NOT EXISTS donation_hub;
USE donation_hub;

-- Users table (both donors and admins)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(255),
    total_donated DECIMAL(10, 2) DEFAULT 0.00,
    donations_count INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Master Donations table
CREATE TABLE donations (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('food', 'apparel', 'money') NOT NULL,
    trust_id VARCHAR(50),
    donation_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by VARCHAR(50),
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (donation_status),
    INDEX idx_created_at (created_at)
);

-- Food Donations sub-table
CREATE TABLE food_donations (
    id VARCHAR(50) PRIMARY KEY,
    donation_id VARCHAR(50) UNIQUE NOT NULL,
    rice_qty INT NOT NULL DEFAULT 0,
    veg_qty INT NOT NULL DEFAULT 0,
    fruits_qty INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
    INDEX idx_donation_id (donation_id)
);

-- Apparel/Clothes Donations sub-table
CREATE TABLE apparel_donations (
    id VARCHAR(50) PRIMARY KEY,
    donation_id VARCHAR(50) UNIQUE NOT NULL,
    target_age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
    INDEX idx_donation_id (donation_id),
    CHECK (target_age IN (10, 19, 20, 30, 45))
);

-- Money Donations sub-table
CREATE TABLE money_donations (
    id VARCHAR(50) PRIMARY KEY,
    donation_id VARCHAR(50) UNIQUE NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    qr_payload TEXT,
    payment_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
    INDEX idx_donation_id (donation_id),
    INDEX idx_transaction_id (transaction_id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    donation_id VARCHAR(50),
    message TEXT NOT NULL,
    type ENUM('approval', 'rejection', 'general') DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- Insert default admin user
-- Password: Admin@123 (bcrypt hashed)
INSERT INTO users (id, full_name, email, password, role, joined_at) 
VALUES (
    'u_admin_seed',
    'System Administrator',
    'admin@donatehub.com',
    '$2a$10$YourHashedPasswordHere',  -- Replace with actual bcrypt hash
    'admin',
    CURRENT_TIMESTAMP
);
