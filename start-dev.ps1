# ============================================
# DonateHub Frontend-Backend Startup Script
# PowerShell Version
# ============================================

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  DonateHub - Full Stack Startup            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "[1/4] Checking MySQL Service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name MySQL80 -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -eq 'Running') {
    Write-Host "✓ MySQL Service is running" -ForegroundColor Green
} else {
    Write-Host "! Starting MySQL Service..." -ForegroundColor Yellow
    Start-Service -Name MySQL80 -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✓ MySQL Service started" -ForegroundColor Green
}

# Initialize Database
Write-Host "`n[2/4] Setting up Database..." -ForegroundColor Yellow
Push-Location backend
node scripts/initDatabase.js 2>$null
Pop-Location
Write-Host "✓ Database initialized" -ForegroundColor Green

# Start Backend
Write-Host "`n[3/4] Starting Backend (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"
Start-Sleep -Seconds 3
Write-Host "✓ Backend window opened" -ForegroundColor Green

# Start Frontend
Write-Host "`n[4/4] Starting Frontend (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
Write-Host "✓ Frontend window opened" -ForegroundColor Green

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Both servers starting in new windows      ║" -ForegroundColor Cyan
Write-Host "║                                            ║" -ForegroundColor Cyan
Write-Host "║  Backend:  http://localhost:5000          ║" -ForegroundColor Green
Write-Host "║  Frontend: http://localhost:3000          ║" -ForegroundColor Green
Write-Host "║                                            ║" -ForegroundColor Cyan
Write-Host "║  API URL:  http://localhost:5000/api      ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
