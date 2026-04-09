# MySQL Setup Script for DonateHub
# This script creates the donation_hub database and tables

# Database credentials
$mysqlUser = "root"
$mysqlPassword = "Phani@200656"
$mysqlHost = "localhost"
$database = "donation_hub"

# Path to schema file
$schemaFile = "d:\donation\spring-boot-backend\src\main\resources\schema.sql"

# Try to find MySQL installation
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 5.7\bin\mysql.exe"
)

$mysqlFound = $false
$mysqlExe = $null

foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlFound = $true
        $mysqlExe = $path
        Write-Host "Found MySQL at: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlFound) {
    Write-Host "MySQL not found in standard installation paths." -ForegroundColor Red
    Write-Host "Please provide the path to mysql.exe or ensure MySQL is installed." -ForegroundColor Yellow
    exit 1
}

# Execute SQL script
Write-Host "Executing SQL schema..." -ForegroundColor Cyan

$sqlContent = Get-Content -Path $schemaFile -Raw
& $mysqlExe -h $mysqlHost -u $mysqlUser -p$mysqlPassword -e $sqlContent

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database setup completed successfully!" -ForegroundColor Green
    Write-Host "Admin credentials:" -ForegroundColor Cyan
    Write-Host "  Email: admin@donatehub.com" -ForegroundColor White
    Write-Host "  Password: Admin@123" -ForegroundColor White
} else {
    Write-Host "Error during database setup. Please check credentials and MySQL service." -ForegroundColor Red
}
