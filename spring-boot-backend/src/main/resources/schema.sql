-- H2 In-Memory Database Schema for DonateHub
-- Tables auto-created by Hibernate, this ensures default data is populated

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    avatar VARCHAR(255),
    total_donated DECIMAL(10, 2) NOT NULL DEFAULT 0,
    donations_count INT NOT NULL DEFAULT 0,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

-- Donations Table (Master)
CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    trust_id VARCHAR(50),
    donation_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    approved_by VARCHAR(50),
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON donations(user_id);
CREATE INDEX idx_type ON donations(type);
CREATE INDEX idx_status ON donations(donation_status);
CREATE INDEX idx_created_at ON donations(created_at);

-- Food Donations Table
CREATE TABLE IF NOT EXISTS food_donations (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL UNIQUE,
    rice_qty INT NOT NULL DEFAULT 0,
    veg_qty INT NOT NULL DEFAULT 0,
    fruits_qty INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE INDEX idx_donation_id_food ON food_donations(donation_id);

-- Apparel Donations Table
CREATE TABLE IF NOT EXISTS apparel_donations (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL UNIQUE,
    target_age INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE INDEX idx_donation_id_apparel ON apparel_donations(donation_id);

-- Money Donations Table
CREATE TABLE IF NOT EXISTS money_donations (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    qr_payload TEXT,
    payment_status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE INDEX idx_donation_id_money ON money_donations(donation_id);
CREATE INDEX idx_transaction_id ON money_donations(transaction_id);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    donation_id VARCHAR(36),
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE SET NULL
);

CREATE INDEX idx_user_id_notif ON notifications(user_id);
CREATE INDEX idx_is_read ON notifications(is_read);

-- Insert Default Admin User (password: Admin@123 hashed with BCrypt)
-- BCrypt hash of "Admin@123": $2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu
INSERT INTO users (id, full_name, email, password, role, total_donated, donations_count, joined_at, updated_at)
SELECT 'admin-001', 'Admin User', 'admin@donatehub.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'ADMIN', 0, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@donatehub.com');
