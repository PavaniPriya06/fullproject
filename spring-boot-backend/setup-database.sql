DROP DATABASE IF EXISTS donation_hub;
CREATE DATABASE donation_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE donation_hub;

CREATE TABLE users (
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

CREATE TABLE donations (
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

CREATE TABLE food_donations (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL UNIQUE,
    rice_qty INT NOT NULL DEFAULT 0,
    veg_qty INT NOT NULL DEFAULT 0,
    fruits_qty INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE TABLE apparel_donations (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL UNIQUE,
    target_age INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE TABLE money_donations (
    id VARCHAR(36) PRIMARY KEY,
    donation_id VARCHAR(36) NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    qr_payload TEXT,
    payment_status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
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

INSERT INTO users (id, full_name, email, password, role, total_donated, donations_count, joined_at, updated_at)
VALUES 
('admin-001', 'Admin User', 'admin@donatehub.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'ADMIN', 0, 0, NOW(), NOW()),
('user-001', 'Rajesh Kumar', 'rajesh@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 1500.00, 5, NOW(), NOW()),
('user-002', 'Priya Sharma', 'priya@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 2500.00, 8, NOW(), NOW()),
('user-003', 'Amit Patel', 'amit@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 500.00, 2, NOW(), NOW()),
('user-004', 'Neha Gupta', 'neha@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 3000.00, 10, NOW(), NOW()),
('user-005', 'Vikram Singh', 'vikram@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 1200.00, 4, NOW(), NOW());
