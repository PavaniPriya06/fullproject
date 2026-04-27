# Quick Start Script for DonateHub Backend
# Save as: setup.ps1
# Run with: .\setup.ps1

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   DonateHub Backend Setup Wizard          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "📋 Step 1/7: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Step 2: Check npm
Write-Host "📋 Step 2/7: Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found" -ForegroundColor Red
    exit 1
}

# Step 3: Install dependencies
Write-Host "📋 Step 3/7: Installing dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes..." -ForegroundColor Gray
npm install --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "   ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 4: Check for .env file
Write-Host "📋 Step 4/7: Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   ✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "   ! .env file not found, creating from example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "   ✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "   ⚠️  IMPORTANT: Please edit .env file with your MySQL credentials!" -ForegroundColor Red
    Write-Host "   Required: DB_PASSWORD, JWT_SECRET" -ForegroundColor Red
    Write-Host ""
    $continue = Read-Host "   Have you configured .env? (y/n)"
    if ($continue -ne "y") {
        Write-Host "   Please edit .env file then run this script again" -ForegroundColor Yellow
        exit 0
    }
}

# Step 5: Test MySQL connection
Write-Host "📋 Step 5/7: Testing MySQL connection..." -ForegroundColor Yellow
$env:NODE_ENV = "development"

# Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

Write-Host "   Testing connection to MySQL..." -ForegroundColor Gray
try {
    $mysqlTest = mysql --version 2>&1
    Write-Host "   ✓ MySQL client found: $mysqlTest" -ForegroundColor Green
} catch {
    Write-Host "   ! MySQL client not found (this is optional)" -ForegroundColor Yellow
}

# Step 6: Initialize database
Write-Host "📋 Step 6/7: Initializing database..." -ForegroundColor Yellow
$initDb = Read-Host "   Do you want to initialize the database now? (y/n)"
if ($initDb -eq "y") {
    npm run init-db
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Database initialized successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "   📧 Default Admin Credentials:" -ForegroundColor Cyan
        Write-Host "      Email:    admin@donatehub.com" -ForegroundColor White
        Write-Host "      Password: Admin@123" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "   ✗ Database initialization failed" -ForegroundColor Red
        Write-Host "   Please check your MySQL credentials in .env" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ⊘ Skipped database initialization" -ForegroundColor Gray
}

# Step 7: Start server
Write-Host "📋 Step 7/7: Ready to start server!" -ForegroundColor Yellow
Write-Host ""
$startServer = Read-Host "   Start the development server now? (y/n)"
if ($startServer -eq "y") {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          Setup Complete! 🎉                ║" -ForegroundColor Green
    Write-Host "║                                            ║" -ForegroundColor Green
    Write-Host "║  Starting server...                        ║" -ForegroundColor Green
    Write-Host "║  Press Ctrl+C to stop                      ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    npm run dev
} else {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          Setup Complete! 🎉                ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "To start the server, run:" -ForegroundColor Cyan
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "   - Setup Guide:  SETUP_STEPS.md" -ForegroundColor White
    Write-Host "   - Full README:  README.md" -ForegroundColor White
    Write-Host "   - API Docs:     API_REFERENCE.md" -ForegroundColor White
    Write-Host ""
}
