# Test MySQL Connection and Create User 
$MYSQL_PATH = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$SCHEMA_FILE = "d:\donation\spring-boot-backend\src\main\resources\schema.sql"

Write-Host "Testing MySQL Connection..." -ForegroundColor Cyan

# Test 1: Try with no password
Write-Host "Attempt 1: Connecting as root with no password..." -ForegroundColor Yellow
& $MYSQL_PATH -u root -e "SELECT 1;" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Connected with no password!" -ForegroundColor Green
    Write-Host "Setting up database..." -ForegroundColor Cyan
    & $MYSQL_PATH -u root < $SCHEMA_FILE
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database setup successful!" -ForegroundColor Green
    } else {
        Write-Host "Database setup failed!" -ForegroundColor Red
    }
    exit 0
}

# Test 2: Try with password
Write-Host "Attempt 2: Connecting as root with password 'Phani@200656'..." -ForegroundColor Yellow
& $MYSQL_PATH -u root -p"Phani@200656" -e "SELECT 1;" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Connected with password!" -ForegroundColor Green
    Write-Host "Setting up database..." -ForegroundColor Cyan
    & $MYSQL_PATH -u root -p"Phani@200656" < $SCHEMA_FILE
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database setup successful!" -ForegroundColor Green
    } else {
        Write-Host "Database setup failed!" -ForegroundColor Red
    }
    exit 0
}

Write-Host ""
Write-Host "MySQL Connection Issues:" -ForegroundColor Red
Write-Host "- Root user cannot be accessed with configured credentials"
Write-Host ""
Write-Host "Solutions:" -ForegroundColor Yellow
Write-Host "1. If you know the actual root password, update application.properties"
Write-Host "2. Or provide a different MySQL username and password that has access to the database"
Write-Host ""
