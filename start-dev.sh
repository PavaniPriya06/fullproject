#!/bin/bash
# ============================================
# DonateHub Frontend-Backend Startup Script
# For PowerShell, use: powershell -ExecutionPolicy Bypass -File start-dev.ps1
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  DonateHub - Full Stack Startup            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if MySQL is running (macOS/Linux)
echo "[1/3] Checking MySQL Service..."
if command -v mysql &> /dev/null; then
    echo "✓ MySQL is installed"
else
    echo "! MySQL is not installed"
    echo "Please install MySQL: brew install mysql"
    exit 1
fi

# Initialize Database if needed
echo ""
echo "[2/3] Setting up Database..."
cd backend
node scripts/initDatabase.js
cd ..
echo "✓ Database initialized"

# Start Backend
echo ""
echo "[3/3] Starting services..."
echo ""
echo "Terminal 1 - Backend (port 5000):"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 - Frontend (port 3000):"
echo "  npm run dev"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  Please run these commands in separate     ║"
echo "║  terminal windows                          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
