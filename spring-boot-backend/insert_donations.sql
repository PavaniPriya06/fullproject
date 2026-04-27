-- ============================================
-- INSERT DONATION DATA EXAMPLES
-- ============================================

-- ============================================
-- 1. MONEY DONATIONS
-- ============================================

INSERT INTO donations (id, user_id, type, donation_status, created_at, updated_at)
VALUES 
('donation-money-001', 'user-001', 'MONEY', 'APPROVED', NOW(), NOW()),
('donation-money-002', 'user-002', 'MONEY', 'APPROVED', NOW(), NOW()),
('donation-money-003', 'user-003', 'MONEY', 'PENDING', NOW(), NOW());

INSERT INTO money_donations (id, donation_id, transaction_id, amount, payment_status, created_at)
VALUES 
('money-001', 'donation-money-001', 'TXN001', 500.00, TRUE, NOW()),
('money-002', 'donation-money-002', 'TXN002', 1000.00, TRUE, NOW()),
('money-003', 'donation-money-003', 'TXN003', 250.00, FALSE, NOW());

-- ============================================
-- 2. FOOD DONATIONS
-- ============================================

INSERT INTO donations (id, user_id, type, donation_status, created_at, updated_at)
VALUES 
('donation-food-001', 'user-001', 'FOOD', 'APPROVED', NOW(), NOW()),
('donation-food-002', 'user-002', 'FOOD', 'APPROVED', NOW(), NOW()),
('donation-food-003', 'user-004', 'FOOD', 'PENDING', NOW(), NOW());

INSERT INTO food_donations (id, donation_id, rice_qty, veg_qty, fruits_qty, created_at)
VALUES 
('food-001', 'donation-food-001', 50, 20, 10, NOW()),
('food-002', 'donation-food-002', 30, 15, 5, NOW()),
('food-003', 'donation-food-003', 100, 50, 30, NOW());

-- ============================================
-- 3. APPAREL DONATIONS
-- ============================================

INSERT INTO donations (id, user_id, type, donation_status, created_at, updated_at)
VALUES 
('donation-apparel-001', 'user-003', 'APPAREL', 'APPROVED', NOW(), NOW()),
('donation-apparel-002', 'user-005', 'APPAREL', 'PENDING', NOW(), NOW());

INSERT INTO apparel_donations (id, donation_id, target_age, created_at)
VALUES 
('apparel-001', 'donation-apparel-001', 5, NOW()),
('apparel-002', 'donation-apparel-002', 12, NOW());

-- ============================================
-- 4. ADD NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, donation_id, message, type, is_read, created_at)
VALUES 
('user-001', 'donation-money-001', 'Your donation has been approved', 'APPROVAL', FALSE, NOW()),
('user-002', 'donation-food-002', 'Your food donation has been received', 'RECEIVED', TRUE, NOW()),
('user-003', NULL, 'Thank you for your donation!', 'GENERAL', FALSE, NOW());

-- ============================================
-- 5. VIEW ALL DONATIONS
-- ============================================

SELECT 
    d.id,
    u.full_name,
    d.type,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
ORDER BY d.created_at DESC;

-- ============================================
-- 6. VIEW MONEY DONATIONS DETAILS
-- ============================================

SELECT 
    d.id as donation_id,
    u.full_name,
    md.amount,
    md.payment_status,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
JOIN money_donations md ON d.id = md.donation_id
ORDER BY d.created_at DESC;

-- ============================================
-- 7. VIEW FOOD DONATIONS DETAILS
-- ============================================

SELECT 
    d.id as donation_id,
    u.full_name,
    fd.rice_qty,
    fd.veg_qty,
    fd.fruits_qty,
    d.donation_status,
    d.created_at
FROM donations d
JOIN users u ON d.user_id = u.id
JOIN food_donations fd ON d.id = fd.donation_id
ORDER BY d.created_at DESC;

-- ============================================
-- 8. DONATION STATISTICS
-- ============================================

-- Total donations by type
SELECT type, COUNT(*) as count FROM donations GROUP BY type;

-- Total money collected
SELECT SUM(amount) as total_money FROM money_donations WHERE payment_status = TRUE;

-- Pending donations
SELECT COUNT(*) as pending FROM donations WHERE donation_status = 'PENDING';

-- Approved donations
SELECT COUNT(*) as approved FROM donations WHERE donation_status = 'APPROVED';
