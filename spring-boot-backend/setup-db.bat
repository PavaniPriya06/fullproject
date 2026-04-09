@echo off
setlocal enabledelayedexpansion

REM MySQL Setup Script
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set DB_USER=root
set SCHEMA_FILE=d:\donation\spring-boot-backend\src\main\resources\schema.sql

if not exist "%MYSQL_PATH%" (
    echo MySQL not found at %MYSQL_PATH%
    exit /b 1
)

echo Creating database and tables (trying without password)...
"%MYSQL_PATH%" -h localhost -u %DB_USER% < "%SCHEMA_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Database setup completed successfully!
    echo.
    echo Admin Credentials:
    echo   Email: admin@donatehub.com
    echo   Password: Admin@123
    echo.
) else (
    echo Error during database setup. Make sure MySQL is running and credentials are correct.
    exit /b 1
)

endlocal
