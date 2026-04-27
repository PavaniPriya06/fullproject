# DonateHub Backend - Quick Start Cheat Sheet

## 🚀 One-Line Setup (Automated)

```powershell
cd d:\donation\backend; .\setup.ps1
```

---

## 📝 Manual Setup (5 Commands)

```powershell
# 1. Navigate to backend
cd d:\donation\backend

# 2. Install dependencies
npm install

# 3. Create .env file (then edit it with your MySQL password)
Copy-Item .env.example .env

# 4. Initialize database
npm run init-db

# 5. Start server
npm run dev
```

---

## 🔑 Default Admin Login

```
Email:    admin@donatehub.com
Password: Admin@123
```

---

## 🧪 Test Server (PowerShell)

```powershell
# Health check
Invoke-WebRequest http://localhost:5000/health

# Admin login
$body = @{email="admin@donatehub.com"; password="Admin@123"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body $body -ContentType "application/json"
```

---

## 📡 API Endpoints (Quick Reference)

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/register` | POST | Register user | Public |
| `/api/auth/login` | POST | Login | Public |
| `/api/auth/me` | GET | Get user | Private |
| `/api/donations/food` | POST | Food donation | Private |
| `/api/donations/apparel` | POST | Apparel donation | Private |
| `/api/donations/money` | POST | Money donation | Private |
| `/api/donations/my-donations` | GET | My donations | Private |
| `/api/donations` | GET | All donations | Admin |
| `/api/admin/donations/:id/approve` | PUT | Approve | Admin |
| `/api/admin/donations/:id/reject` | PUT | Reject | Admin |

---

## 🔧 Common Commands

```powershell
# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Re-initialize database
npm run init-db

# Stop server
Ctrl + C

# Check if server is running
netstat -ano | findstr :5000

# Kill process on port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) { Stop-Process -Id $process -Force }
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change `PORT` in `.env` or kill process |
| MySQL connection failed | Check `DB_PASSWORD` in `.env` |
| Dependencies error | Delete `node_modules` and run `npm install` |
| Database not found | Run `npm run init-db` |
| JWT error | Check `JWT_SECRET` in `.env` |
| Token expired | Login again to get new token |

---

## 📂 Important Files

```
.env              → Your configuration (passwords, secrets)
server.js         → Main entry point
database/schema.sql → Database structure
postman_collection.json → API testing
SETUP_STEPS.md    → Detailed guide
```

---

## 🎯 Next Steps After Setup

1. ✅ Server running on http://localhost:5000
2. 📱 Test with Postman (import `postman_collection.json`)
3. 🔗 Update frontend to call API endpoints
4. 🚀 Start building features!

---

## 📚 Full Documentation

- **Detailed Setup:** `SETUP_STEPS.md`
- **Complete Guide:** `README.md`
- **API Reference:** `API_REFERENCE.md`

---

**Server URL:** http://localhost:5000  
**API Base:** http://localhost:5000/api
