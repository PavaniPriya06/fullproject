@echo off
REM ============================================
REM DonateHub Frontend-Backend Startup Script
REM ============================================

echo.
echo ╔════════════════════════════════════════════╗
echo ║  DonateHub - Full Stack Startup            ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if MySQL is running
echo [1/4] Checking MySQL Service...
sc query MySQL80 >nul
if %errorlevel%==0 (
    echo ✓ MySQL Service is running
) else (
    echo ! MySQL Service is not running
    echo Starting MySQL...
    net start MySQL80
    timeout /t 2
)

REM Initialize Database if needed
echo.
echo [2/4] Setting up Database...
cd backend
node scripts/initDatabase.js >nul 2>&1
echo ✓ Database initialized
cd ..

REM Start Backend in new window
echo.
echo [3/4] Starting Backend (port 5000)...
start "DonateHub Backend" cmd /k "cd backend && npm start"
timeout /t 3

REM Start Frontend in new window
echo.
echo [4/4] Starting Frontend (port 3000)...
start "DonateHub Frontend" cmd /k "npm run dev"

echo.
echo ╔════════════════════════════════════════════╗
echo ║  Both servers starting in new windows      ║
echo ║                                            ║
echo ║  Backend:  http://localhost:5000          ║
echo ║  Frontend: http://localhost:3000          ║
echo ║                                            ║
echo ║  API URL:  http://localhost:5000/api      ║
echo ╚════════════════════════════════════════════╝
echo.
pause
