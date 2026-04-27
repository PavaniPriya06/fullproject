-- ============================================
-- MYSQL COMMANDS FOR DONATEHUB SYSTEM
-- ============================================

-- ============================================
-- 1. CONNECTION & DATABASE INFO
-- ============================================

-- Check MySQL version and current user
SELECT VERSION(), USER();

-- List all databases
SHOW DATABASES;

-- Switch to donation_hub database
USE donation_hub;

-- Show current database
SELECT DATABASE();

-- ============================================
-- 2. TABLE INFORMATION
-- ============================================

-- List all tables
SHOW TABLES;

-- Show users table structure
DESCRIBE users;

-- Show donations table structure
DESCRIBE donations;

-- Show all table structures
SHOW CREATE TABLE users\G
SHOW CREATE TABLE donations\G
SHOW CREATE TABLE food_donations\G
SHOW CREATE TABLE apparel_donations\G
SHOW CREATE TABLE money_donations\G
SHOW CREATE TABLE notifications\G

-- ============================================
-- 3. VIEW USERS DATA
-- ============================================

-- Get all users
SELECT * FROM users;

-- Get all users in formatted view
SELECT id, full_name, email, role, total_donated, donations_count, joined_at FROM users;

-- Get admin user
SELECT * FROM users WHERE role = 'ADMIN';

-- Get all regular users
SELECT * FROM users WHERE role = 'USER';

-- Get user by email
SELECT * FROM users WHERE email = 'admin@donatehub.com';

-- Count total users
SELECT COUNT(*) AS total_users FROM users;

-- ============================================
-- 4. ADD NEW USERS
-- ============================================

-- Add a single user
INSERT INTO users (id, full_name, email, password, role, total_donated, donations_count, joined_at, updated_at)
VALUES (
    'user-001',
    'Rajesh Kumar',
    'rajesh@example.com',
    '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu',
    'USER',
    1500.00,
    5,
    NOW(),
    NOW()
);

-- Add multiple users at once
INSERT INTO users (id, full_name, email, password, role, total_donated, donations_count, joined_at, updated_at)
VALUES 
('user-002', 'Priya Sharma', 'priya@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 2500.00, 8, NOW(), NOW()),
('user-003', 'Amit Patel', 'amit@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 500.00, 2, NOW(), NOW()),
('user-004', 'Neha Gupta', 'neha@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 3000.00, 10, NOW(), NOW()),
('user-005', 'Vikram Singh', 'vikram@example.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu', 'USER', 1200.00, 4, NOW(), NOW());

-- ============================================
-- 5. VIEW DONATIONS DATA
-- ============================================

-- Get all donations
SELECT * FROM donations;

-- Get donations with donor info
SELECT d.id, d.type, d.donation_status, u.full_name, u.email, d.created_at 
FROM donations d 
JOIN users u ON d.user_id = u.id;

-- Get pending donations
SELECT * FROM donations WHERE donation_status = 'PENDING';

-- Get approved donations
SELECT * FROM donations WHERE donation_status = 'APPROVED';

-- Get donations by type
SELECT * FROM donations WHERE type = 'MONEY';
SELECT * FROM donations WHERE type = 'FOOD';
SELECT * FROM donations WHERE type = 'APPAREL';

-- Count donations by status
SELECT donation_status, COUNT(*) as count FROM donations GROUP BY donation_status;

-- ============================================
-- 6. ADD DONATIONS
-- ============================================

-- Add a money donation
INSERT INTO donations (id, user_id, type, donation_status, created_at, updated_at)
VALUES ('donation-001', 'user-001', 'MONEY', 'PENDING', NOW(), NOW());

-- Add food donation
INSERT INTO donations (id, user_id, type, donation_status, created_at, updated_at)
VALUES ('donation-002', 'user-002', 'FOOD', 'PENDING', NOW(), NOW());

-- ============================================
-- 7. ADD MONEY DONATION DETAILS
-- ============================================

-- Add money donation details
INSERT INTO money_donations (id, donation_id, transaction_id, amount, payment_status, created_at)
VALUES ('money-001', 'donation-001', 'TXN123456', 500.00, TRUE, NOW());

-- ============================================
-- 8. ADD FOOD DONATION DETAILS
-- ============================================

-- Add food donation details
INSERT INTO food_donations (id, donation_id, rice_qty, veg_qty, fruits_qty, created_at)
VALUES ('food-001', 'donation-002', 10, 5, 3, NOW());

-- ============================================
-- 9. UPDATE DATA
-- ============================================

-- Update user total donated
UPDATE users SET total_donated = 2000.00 WHERE id = 'user-001';

-- Update donation status to APPROVED
UPDATE donations SET donation_status = 'APPROVED', approved_at = NOW() WHERE id = 'donation-001';

-- Update donation status to REJECTED
UPDATE donations SET donation_status = 'REJECTED', rejection_reason = 'Invalid documentation' WHERE id = 'donation-001';

-- Increment user's donation count
UPDATE users SET donations_count = donations_count + 1 WHERE id = 'user-001';

-- ============================================
-- 10. DELETE DATA
-- ============================================

-- Delete a specific user
DELETE FROM users WHERE id = 'user-001';

-- Delete a donation
DELETE FROM donations WHERE id = 'donation-001';

-- ============================================
-- 11. STATISTICS & REPORTS
-- ============================================

-- Total donations by type
SELECT type, COUNT(*) as count FROM donations GROUP BY type;

-- Total money donated
SELECT SUM(amount) as total_money FROM money_donations WHERE payment_status = TRUE;

-- Top donors (by amount)
SELECT u.full_name, u.email, SUM(md.amount) as total_donated 
FROM users u 
JOIN donations d ON u.id = d.user_id 
JOIN money_donations md ON d.id = md.donation_id 
GROUP BY u.id 
ORDER BY total_donated DESC;

-- Donation statistics
SELECT 
    COUNT(*) as total_donations,
    SUM(CASE WHEN donation_status = 'APPROVED' THEN 1 ELSE 0 END) as approved,
    SUM(CASE WHEN donation_status = 'PENDING' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN donation_status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
FROM donations;

-- Database size information
SELECT 
    table_name, 
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES 
WHERE table_schema = 'donation_hub'
ORDER BY (data_length + index_length) DESC;

-- ============================================
-- 12. CLEANUP & RESET (USE WITH CAUTION!)
-- ============================================

-- Clear all data but keep tables
TRUNCATE TABLE notifications;
TRUNCATE TABLE money_donations;
TRUNCATE TABLE food_donations;
TRUNCATE TABLE apparel_donations;
TRUNCATE TABLE donations;
-- Don't truncate users unless you want to delete everyone including admin

-- Delete all test users (keep admin)
DELETE FROM users WHERE id != 'admin-001';

-- ============================================
-- PASSWORD REFERENCE
-- ============================================
-- All demo users use this password hash: Admin@123
-- Hash: $2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2CjSu
--
-- Admin Login:
-- Email: admin@donatehub.com
-- Password: Admin@123
-- ============================================
