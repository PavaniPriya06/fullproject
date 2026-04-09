@echo off
REM MySQL Setup Script - Test Connection and Create Database
setlocal enabledelayedexpansion

set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set MYSQL_USER=root
set MYSQL_PASSWORD=Phani@200656
set DB_NAME=donation_hub
set SCHEMA_FILE=d:\donation\spring-boot-backend\src\main\resources\schema.sql

echo.
echo ========================================
echo Testing MySQL Connection...
echo ========================================
echo.

REM Test connection
"%MYSQL_PATH%" -h localhost -u %MYSQL_USER% -p%MYSQL_PASSWORD% -e "SELECT 1;" > nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Connected to MySQL as %MYSQL_USER%
    echo.
    echo Creating database and tables...
    "%MYSQL_PATH%" -h localhost -u %MYSQL_USER% -p%MYSQL_PASSWORD% < "%SCHEMA_FILE%"
    
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Database setup completed!
        echo.
        echo Admin Login Credentials:
        echo   Email:    admin@donatehub.com
        echo   Password: Admin@123
        echo.
        echo Backend available at: http://localhost:8081
        echo.
    ) else (
        echo [ERROR] Failed to execute schema.sql
        exit /b 1
    )
) else (
    echo [ERROR] Cannot connect to MySQL with provided credentials
    echo.
    echo Troubleshooting steps:
    echo 1. Verify MySQL service is running
    echo 2. Check if password is correct
    echo 3. Ensure root user has correct permissions
    echo.
    echo You can restart MySQL with:
    echo   net stop MySQL80
    echo   net start MySQL80
    echo.
    exit /b 1
)

endlocal
