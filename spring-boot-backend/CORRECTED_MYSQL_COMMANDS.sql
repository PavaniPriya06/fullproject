-- ============================================
-- CORRECTED MYSQL COMMANDS
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

-- Show apparel donations table structure
DESCRIBE apparel_donations;

-- Show all table indexes
SHOW INDEX FROM donations;

-- ============================================
-- 3. VIEW DONATIONS DATA
-- ============================================

-- Get all donations with donor names
SELECT d.id, u.full_name, d.type, d.donation_status, d.created_at 
FROM donations d 
JOIN users u ON d.user_id = u.id;

-- Get all donations (full details)
SELECT * FROM donations;

-- Get all apparel donations
SELECT * FROM apparel_donations;

-- Get all users
SELECT * FROM users;

-- Get all food donations
SELECT * FROM food_donations;

-- Get all money donations
SELECT * FROM money_donations;

-- ============================================
-- 4. DETAILED VIEW WITH JOINS
-- ============================================

-- Donations with all details
SELECT 
    d.id as donation_id,
    u.full_name as donor_name,
    u.email,
    d.type as donation_type,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
ORDER BY d.created_at DESC;

-- Apparel donations with donor info
SELECT 
    d.id as donation_id,
    u.full_name,
    a.target_age,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
JOIN apparel_donations a ON d.id = a.donation_id
ORDER BY d.created_at DESC;

-- Food donations with donor info
SELECT 
    d.id as donation_id,
    u.full_name,
    f.rice_qty,
    f.veg_qty,
    f.fruits_qty,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
JOIN food_donations f ON d.id = f.donation_id
ORDER BY d.created_at DESC;

-- Money donations with donor info
SELECT 
    d.id as donation_id,
    u.full_name,
    m.amount,
    m.payment_status,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
JOIN money_donations m ON d.id = m.donation_id
ORDER BY d.created_at DESC;

-- ============================================
-- 5. STATISTICS
-- ============================================

-- Count donations by type
SELECT type, COUNT(*) as count FROM donations GROUP BY type;

-- Count donations by status
SELECT donation_status, COUNT(*) as count FROM donations GROUP BY donation_status;

-- Total users
SELECT COUNT(*) as total_users FROM users;

-- Total donations
SELECT COUNT(*) as total_donations FROM donations;
