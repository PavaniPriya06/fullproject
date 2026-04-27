# 🎯 DonateHub - Complete Setup Guide

Welcome to DonateHub! This guide will help you set up both the frontend and backend.

---

## 📦 Project Structure

```
d:\donation\
├── backend/              ← NEW! Backend API (Node.js + Express + MySQL)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── database/
│   ├── scripts/
│   ├── server.js         ← Main server file
│   ├── package.json
│   ├── .env.example
│   └── 📚 Documentation  ← START HERE!
│       ├── QUICK_START.md
│       ├── SETUP_STEPS.md
│       ├── TESTING_GUIDE.md
│       └── README.md
│
├── js/                   ← Frontend JavaScript/React
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── data/
│   └── utils/
│
├── css/                  ← Styles
├── *.html                ← Frontend HTML pages
└── package.json          ← Frontend dependencies
```

---

## 🚀 Quick Setup (Both Frontend & Backend)

### Option A: Automated Setup (Recommended)

#### Backend Setup (2 minutes)
```powershell
cd d:\donation\backend
.\setup.ps1
```

#### Frontend Setup (3 minutes)
```powershell
cd d:\donation
npm install
npm start
```

### Option B: Manual Setup

#### Backend (10 minutes)
1. Navigate to backend folder
   ```powershell
   cd d:\donation\backend
   ```

2. Install dependencies
   ```powershell
   npm install
   ```

3. Create `.env` file
   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```
   Edit: `DB_PASSWORD` and `JWT_SECRET`

4. Initialize database
   ```powershell
   npm run init-db
   ```

5. Start server
   ```powershell
   npm run dev
   ```
   ✅ Backend running at http://localhost:5000

#### Frontend (5 minutes)
1. Navigate to donation folder
   ```powershell
   cd d:\donation
   ```

2. Install dependencies
   ```powershell
   npm install
   ```

3. Start development server
   ```powershell
   npm start
   ```
   ✅ Frontend running at http://localhost:3000

---

## 📚 Documentation Guide

### Backend Documentation
**Location:** `d:\donation\backend\`

| Document | Purpose |
|----------|---------|
| [DOCUMENTATION.md](backend/DOCUMENTATION.md) | 📑 All documentation index |
| [QUICK_START.md](backend/QUICK_START.md) | ⚡ 5-command setup |
| [SETUP_STEPS.md](backend/SETUP_STEPS.md) | 📋 Detailed step-by-step |
| [SETUP_VISUAL.md](backend/SETUP_VISUAL.md) | 🎨 Diagrams & flowcharts |
| [TESTING_GUIDE.md](backend/TESTING_GUIDE.md) | 🧪 Test all endpoints |
| [API_REFERENCE.md](backend/API_REFERENCE.md) | 📖 API quick reference |
| [README.md](backend/README.md) | 📘 Complete overview |

### Frontend Documentation
**Location:** `d:\donation\`

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) | Implementation details |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick reference |
| [REACT_SETUP_README.md](REACT_SETUP_README.md) | React setup guide |
| [TECHNICAL_PROMPT.md](TECHNICAL_PROMPT.md) | Technical specifications |
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | Build information |

---

## 🎯 Learning Paths

### Path 1: Beginner (1 hour total)
**Goal:** Get everything running

1. **Backend Setup** (30 min)
   - Read [backend/QUICK_START.md](backend/QUICK_START.md)
   - Run automated setup: `.\backend\setup.ps1`
   - Follow [backend/TESTING_GUIDE.md](backend/TESTING_GUIDE.md) (basic tests only)

2. **Frontend Setup** (20 min)
   - Install: `npm install`
   - Start: `npm start`
   - Open: http://localhost:3000

3. **Test Integration** (10 min)
   - Login with admin credentials
   - Create a test donation
   - Verify in admin portal

### Path 2: Intermediate (3 hours total)
**Goal:** Understand the system

1. **Backend** (90 min)
   - Read [backend/SETUP_STEPS.md](backend/SETUP_STEPS.md)
   - Manual setup
   - Complete all tests in [backend/TESTING_GUIDE.md](backend/TESTING_GUIDE.md)
   - Import Postman collection

2. **Frontend** (60 min)
   - Read [REACT_SETUP_README.md](REACT_SETUP_README.md)
   - Study component structure
   - Test all features

3. **Integration** (30 min)
   - Connect frontend to backend API
   - Test complete workflow

### Path 3: Advanced (1 day)
**Goal:** Master the codebase

1. **Backend Deep Dive**
   - Read all backend documentation
   - Study database schema
   - Review all controllers and models
   - Customize and extend

2. **Frontend Deep Dive**
   - Study all components
   - Understand state management
   - Review all pages

3. **Full Integration**
   - Replace mock data with API calls
   - Add new features
   - Deploy to production

---

## 🔑 Default Credentials

### Admin Account
```
Email:    admin@donatehub.com
Password: Admin@123
```

### Create Test User
Use the registration page or API endpoint.

---

## 🧪 Quick System Test

### 1. Test Backend
```powershell
# Health check
Invoke-WebRequest http://localhost:5000/health

# API test
Invoke-RestMethod http://localhost:5000/api/auth/login `
  -Method Post `
  -Body (@{email="admin@donatehub.com"; password="Admin@123"} | ConvertTo-Json) `
  -ContentType "application/json"
```

### 2. Test Frontend
- Open http://localhost:3000
- Should redirect to login page
- Login with admin credentials
- Check dashboard loads

### 3. Test Integration
- Create donation through frontend
- Verify it appears in backend database
- Approve/reject through admin portal

---

## 📊 Architecture Overview

### Tech Stack

**Backend:**
- Node.js + Express
- MySQL Database
- JWT Authentication
- bcrypt Password Hashing
- express-validator

**Frontend:**
- React 18.2.0
- Tailwind CSS
- Alpine.js (legacy pages)
- Vanilla JavaScript

### Data Flow

```
User Browser
    ↓
Frontend (React/HTML)
    ↓
API Calls (fetch/axios)
    ↓
Backend Express Server
    ↓
JWT Authentication
    ↓
Controllers
    ↓
Models
    ↓
MySQL Database
```

---

## 🔧 Common Commands

### Backend
```powershell
cd backend

# Install dependencies
npm install

# Initialize database
npm run init-db

# Start dev server
npm run dev

# Start production server
npm start
```

### Frontend
```powershell
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

---

## 🐛 Troubleshooting

### Backend Issues

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change `PORT` in backend/.env |
| MySQL connection failed | Check `DB_PASSWORD` in backend/.env |
| Dependencies error | Delete node_modules, run npm install |
| Database errors | Run `npm run init-db` |

See [backend/QUICK_START.md](backend/QUICK_START.md) for more troubleshooting.

### Frontend Issues

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Kill process or change port |
| Dependencies error | Delete node_modules, run npm install |
| API connection failed | Check backend is running |
| Build errors | Check Node.js version (v14+) |

---

## 📱 Postman Testing

1. Install Postman: https://www.postman.com/downloads/
2. Import collection: `backend/postman_collection.json`
3. Create environment with:
   - `baseUrl`: `http://localhost:5000/api`
   - `userToken`: (set after login)
   - `adminToken`: (set after admin login)
4. Test all endpoints

---

## ✅ Setup Verification Checklist

### Backend
- [ ] Dependencies installed
- [ ] .env configured
- [ ] MySQL running
- [ ] Database initialized
- [ ] Server starts without errors
- [ ] Health endpoint returns success
- [ ] Admin login works
- [ ] Can create donations
- [ ] Postman collection works

### Frontend
- [ ] Dependencies installed
- [ ] Dev server starts
- [ ] Application loads in browser
- [ ] Login page accessible
- [ ] Can navigate between pages
- [ ] Components render correctly

### Integration
- [ ] Frontend can call backend API
- [ ] Authentication works end-to-end
- [ ] Donations created in frontend appear in backend
- [ ] Admin portal shows real data
- [ ] Approve/reject works

---

## 🚀 Next Steps

After setup is complete:

1. **Development**
   - Read API documentation
   - Study component structure
   - Start building features

2. **Testing**
   - Test all user workflows
   - Test admin workflows
   - Run automated tests

3. **Customization**
   - Modify database schema
   - Add new endpoints
   - Create new components

4. **Deployment**
   - Set up production environment
   - Configure environment variables
   - Deploy backend and frontend

---

## 📞 Quick Help

**Can't get backend running?**
→ See [backend/SETUP_STEPS.md](backend/SETUP_STEPS.md)

**API not working?**
→ See [backend/TESTING_GUIDE.md](backend/TESTING_GUIDE.md)

**Need API reference?**
→ See [backend/API_REFERENCE.md](backend/API_REFERENCE.md)

**Want visual guides?**
→ See [backend/SETUP_VISUAL.md](backend/SETUP_VISUAL.md)

**Frontend issues?**
→ See [REACT_SETUP_README.md](REACT_SETUP_README.md)

---

## 📚 All Documentation

**Backend:**
- [DOCUMENTATION.md](backend/DOCUMENTATION.md) - All backend docs index
- [README.md](backend/README.md) - Backend overview
- [QUICK_START.md](backend/QUICK_START.md) - Fast setup
- [SETUP_STEPS.md](backend/SETUP_STEPS.md) - Detailed setup
- [SETUP_VISUAL.md](backend/SETUP_VISUAL.md) - Visual guides
- [TESTING_GUIDE.md](backend/TESTING_GUIDE.md) - Testing
- [API_REFERENCE.md](backend/API_REFERENCE.md) - API docs

**Frontend:**
- [REACT_SETUP_README.md](REACT_SETUP_README.md)
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- [TECHNICAL_PROMPT.md](TECHNICAL_PROMPT.md)
- [BUILD_SUMMARY.md](BUILD_SUMMARY.md)

---

**🎉 Ready to start? Pick a learning path above and begin!**

**Backend:** Start with [backend/DOCUMENTATION.md](backend/DOCUMENTATION.md)  
**Frontend:** Start with [REACT_SETUP_README.md](REACT_SETUP_README.md)
