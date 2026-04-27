# Frontend-Backend Integration Guide

## Current Setup

### Backend (Express.js)
- **Location:** `d:\donation\backend\`
- **Port:** 5000
- **Database:** MySQL (donation_hub database)
- **API Base URL:** `http://localhost:5000/api`

### Frontend (React)
- **Location:** `d:\donation\`
- **Port:** 3000 (default for React)
- **API Configuration:** Uses `REACT_APP_API_URL=http://localhost:5000/api`

---

## Prerequisites

### 1. **Database - MySQL Setup**
Ensure MySQL is installed and running:

```powershell
# Windows - Start MySQL service
net start MySQL80

# Verify MySQL is running
mysql --version
```

Create the donation database:
```bash
cd d:\donation\backend
node scripts/initDatabase.js
```

---

## Running Both Servers

### **Option 1: In Separate Terminals (Recommended)**

**Terminal 1 - Start Backend:**
```powershell
cd d:\donation\backend
npm install  # If not already installed
npm start    # Or: npm run dev (with nodemon)
```

You should see:
```
╔════════════════════════════════════════════╗
║     DonateHub API Server Running          ║
║                                            ║
║  Environment: development                 ║
║  Port:        5000                         ║
║  URL:         http://localhost:5000       ║
╚════════════════════════════════════════════╝
```

**Check backend health:**
```powershell
curl http://localhost:5000/health
```

**Terminal 2 - Start Frontend:**
```powershell
cd d:\donation
npm install  # If not already installed
npm run dev
```

Frontend will start on `http://localhost:3000`

---

### **Option 2: Using Concurrently (Single Terminal)**

1. Install concurrently in root:
```powershell
npm install --save-dev concurrently
```

2. Update root package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"npm:backend\" \"npm:frontend\"",
    "backend": "cd backend && npm start",
    "frontend": "cd . && npm start"
  }
}
```

3. Run both servers:
```powershell
npm run dev
```

---

## API Connection Checklist

- [x] Backend configured on port 5000
- [x] Frontend API URL set to `http://localhost:5000/api`
- [x] CORS enabled in backend
- [x] `.env.local` file created for frontend
- [x] `backend/.env` configured with database credentials

---

## Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Donations
- `POST /api/donations/food` - Create food donation
- `POST /api/donations/apparel` - Create apparel donation
- `POST /api/donations/money` - Create money donation
- `GET /api/donations` - Get all donations
- `GET /api/donations/my-donations` - Get user's donations

### Admin
- `GET /api/admin/donations/{id}/approve` - Approve donation
- `GET /api/admin/donations/{id}/reject` - Reject donation
- `GET /api/admin/users` - Get all users

---

## Testing the Connection

1. **Backend Health Check:**
```bash
curl http://localhost:5000/health
```

2. **Frontend API Request (from browser console):**
```javascript
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': 'Bearer your_token' }
}).then(r => r.json()).then(console.log)
```

---

## Troubleshooting

### Frontend shows "Cannot connect to backend"
- Verify backend is running: `curl http://localhost:5000/health`
- Check CORS is enabled in `backend/server.js`
- Verify `.env.local` has correct API_URL

### Port 5000 already in use
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

### MySQL connection error
- Ensure MySQL service is running: `net start MySQL80`
- Check DB credentials in `backend/.env`
- Run: `node scripts/initDatabase.js`

---

## Next Steps
1. Start MySQL: `net start MySQL80`
2. Start Backend: `cd backend && npm start`
3. Start Frontend: `npm run dev`
4. Open `http://localhost:3000` in browser
