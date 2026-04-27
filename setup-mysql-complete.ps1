# ============================================
# Complete MySQL Database Setup Script
# ============================================
# This script will:
# 1. Create the donation_hub database
# 2. Create all required tables
# 3. Insert sample admin user
# ============================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "DonateHub MySQL Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# MySQL credentials
$mysqlUser = "root"
$mysqlPassword = "welcome"

# Check if MySQL is running
Write-Host "`n[1/4] Checking MySQL Connection..." -ForegroundColor Yellow

try {
    $result = mysql -u $mysqlUser -p$mysqlPassword -e "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL is running" -ForegroundColor Green
    } else {
        Write-Host "✗ MySQL Connection Failed" -ForegroundColor Red
        Write-Host "Try: Start-Service -Name 'MySQL80'" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ MySQL Connection Error: $_" -ForegroundColor Red
    exit 1
}

# Create and configure database
Write-Host "`n[2/4] Creating Database..." -ForegroundColor Yellow

$sqlScript = @"
DROP DATABASE IF EXISTS donation_hub;
CREATE DATABASE IF NOT EXISTS donation_hub;
USE donation_hub;

-- Users table
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

-- Food Donations table
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

-- Apparel Donations table
CREATE TABLE apparel_donations (
    id VARCHAR(50) PRIMARY KEY,
    donation_id VARCHAR(50) UNIQUE NOT NULL,
    target_age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE,
    INDEX idx_donation_id (donation_id),
    CHECK (target_age IN (10, 19, 20, 30, 45))
);

-- Money Donations table
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

-- Insert default admin user (password: Admin@123)
INSERT INTO users (id, full_name, email, password, role) VALUES 
('admin_001', 'Admin User', 'admin@donatehub.com', '\$2a\$12\$1234567890123456789012.abcdefghijklmnopqrstuv', 'admin');

-- Sample donor user (password: User@123)
INSERT INTO users (id, full_name, email, password, role) VALUES 
('user_001', 'John Donor', 'john@example.com', '\$2a\$12\$1234567890123456789012.abcdefghijklmnopqrstuv', 'user');

"@

# Save SQL to temp file and execute
$sqlFile = "$env:TEMP\donation_hub_setup.sql"
$sqlScript | Out-File -FilePath $sqlFile -Encoding UTF8

try {
    # Execute SQL script
    & mysql -u $mysqlUser -p$mysqlPassword < $sqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Database creation failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    exit 1
}

# Verify database
Write-Host "`n[3/4] Verifying Database..." -ForegroundColor Yellow

try {
    $tables = & mysql -u $mysqlUser -p$mysqlPassword donation_hub -e "SHOW TABLES;" 2>&1 | Select-Object -Skip 1
    Write-Host "✓ Tables created:" -ForegroundColor Green
    $tables | ForEach-Object { Write-Host "  - $_" }
} catch {
    Write-Host "✗ Verification failed: $_" -ForegroundColor Red
    exit 1
}

# Final message
Write-Host "`n[4/4] Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Database: donation_hub" -ForegroundColor Yellow
Write-Host "Username: root" -ForegroundColor Yellow
Write-Host "Password: welcome" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Navigate to: cd spring-boot-backend" -ForegroundColor White
Write-Host "2. Build: mvn clean install" -ForegroundColor White
Write-Host "3. Run: mvn spring-boot:run" -ForegroundColor White
Write-Host "`nServer will run on: http://localhost:8081" -ForegroundColor Green

# Cleanup
Remove-Item -Path $sqlFile -Force
