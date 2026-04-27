# DonateHub Backend Setup - Visual Guide

## 🔄 Setup Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PREREQUISITES CHECK                          │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Node.js v14+                                                 │
│  ✓ MySQL v5.7+                                                  │
│  ✓ Terminal/PowerShell                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Navigate to Backend Directory                         │
│  ────────────────────────────────────────────────────────────   │
│  Command:  cd d:\donation\backend                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Install Dependencies                                  │
│  ────────────────────────────────────────────────────────────   │
│  Command:  npm install                                          │
│  Creates:  node_modules/, package-lock.json                     │
│  Time:     ~30-60 seconds                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Create & Configure .env File                          │
│  ────────────────────────────────────────────────────────────   │
│  3.1: Copy-Item .env.example .env                               │
│  3.2: Edit .env file                                            │
│       • Set DB_PASSWORD=your_mysql_password                     │
│       • Set JWT_SECRET=random_secret_key                        │
│  3.3: Save file                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Verify MySQL Running                                  │
│  ────────────────────────────────────────────────────────────   │
│  Test:   mysql -u root -p                                       │
│  If OK:  Continue to next step                                  │
│  If FAIL: Start MySQL service                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Initialize Database                                   │
│  ────────────────────────────────────────────────────────────   │
│  Command:  npm run init-db                                      │
│  Creates:                                                       │
│    • donation_hub database                                      │
│    • 6 tables (users, donations, food_donations, etc.)          │
│    • Default admin user (admin@donatehub.com)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: Start Server                                          │
│  ────────────────────────────────────────────────────────────   │
│  Dev Mode:   npm run dev    (auto-reload, recommended)          │
│  Prod Mode:  npm start      (stable)                            │
│                                                                 │
│  Server runs at: http://localhost:5000                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: Test API                                              │
│  ────────────────────────────────────────────────────────────   │
│  Health:  Invoke-WebRequest http://localhost:5000/health        │
│  Login:   POST http://localhost:5000/api/auth/login             │
│  Or use:  Postman collection                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
                    ╔══════════════╗
                    ║   SUCCESS!   ║
                    ╚══════════════╝
```

---

## 🎯 Setup Methods Comparison

### Method 1: Automated (Recommended)
```
Time: ~2 minutes
Steps: 1 command
Difficulty: ⭐ Easy

cd d:\donation\backend
.\setup.ps1
```

### Method 2: Manual
```
Time: ~5 minutes
Steps: 5 commands
Difficulty: ⭐⭐ Moderate

See QUICK_START.md
```

### Method 3: Full Manual
```
Time: ~10 minutes
Steps: ~15 commands
Difficulty: ⭐⭐⭐ Advanced

See SETUP_STEPS.md
```

---

## 📊 Database Schema Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     DATABASE: donation_hub                   │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│    users     │    │    donations     │    │notifications │
├──────────────┤    │   (Master Table) │    ├──────────────┤
│ • id (PK)    │◄───┤ • id (PK)        │    │ • id (PK)    │
│ • full_name  │    │ • user_id (FK)   │───►│ • user_id    │
│ • email      │    │ • type           │    │ • message    │
│ • password   │    │ • status         │    │ • is_read    │
│ • role       │    │ • approved_by    │    └──────────────┘
│ • avatar     │    └──────┬───────────┘
└──────────────┘           │
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │food_donations │ │apparel_       │ │money_         │
  │               │ │donations      │ │donations      │
  ├───────────────┤ ├───────────────┤ ├───────────────┤
  │ • id (PK)     │ │ • id (PK)     │ │ • id (PK)     │
  │ • donation_id │ │ • donation_id │ │ • donation_id │
  │ • rice_qty    │ │ • target_age  │ │ • transaction │
  │ • veg_qty     │ └───────────────┘ │ • amount      │
  └───────────────┘                   └───────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   CLIENT    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/register or /api/auth/login
       │    { email, password }
       ▼
┌─────────────────┐
│   API SERVER    │
│  (auth routes)  │
└──────┬──────────┘
       │
       │ 2. Verify credentials
       │    Hash password (bcrypt)
       ▼
┌─────────────────┐
│  MySQL Database │
│  (users table)  │
└──────┬──────────┘
       │
       │ 3. User found & verified
       ▼
┌─────────────────┐
│   JWT Token     │
│   Generation    │
└──────┬──────────┘
       │
       │ 4. Return token + user data
       │    { success: true, token: "eyJ...", user: {...} }
       ▼
┌─────────────┐
│   CLIENT    │
│ Saves token │
└──────┬──────┘
       │
       │ 5. Future requests include token
       │    Authorization: Bearer eyJ...
       ▼
┌─────────────────┐
│ Protected Route │
│  (middleware)   │
│ Verifies token  │
└─────────────────┘
```

---

## 📡 API Request/Response Flow

### Example: Create Food Donation

```
1. CLIENT
   ↓
   POST /api/donations/food
   Headers: {
     Authorization: Bearer eyJhbGc...
     Content-Type: application/json
   }
   Body: {
     riceQty: 10,
     vegQty: 5
   }

2. MIDDLEWARE
   ↓
   • auth.js → Verify JWT token
   • validator.js → Validate input
   
3. CONTROLLER
   ↓
   donationController.createFoodDonation()
   • Extract user from req.user
   • Generate IDs
   
4. MODEL
   ↓
   Donation.create() + Donation.createFood()
   • Execute SQL queries
   
5. DATABASE
   ↓
   INSERT INTO donations...
   INSERT INTO food_donations...
   
6. RESPONSE
   ↓
   {
     success: true,
     message: "Food donation submitted",
     donation: {
       id: "dr_123...",
       type: "food",
       status: "pending",
       details: { riceQty: 10, vegQty: 5 }
     }
   }
```

---

## 🛠️ Troubleshooting Decision Tree

```
                    ┌─────────────────┐
                    │  Server won't   │
                    │     start?      │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │                         │
        Port in use?              Dependencies error?
                │                         │
                ▼                         ▼
    Kill process/           Delete node_modules/
    Change PORT in .env     npm install
                                        
                    ┌─────────────────┐
                    │  Database       │
                    │  error?         │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │                         │
    Connection failed?          Table doesn't exist?
                │                         │
                ▼                         ▼
    Check DB_PASSWORD         npm run init-db
    Check MySQL running
                                        
                    ┌─────────────────┐
                    │  API error?     │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │                         │
        401 Unauthorized?         400 Validation error?
                │                         │
                ▼                         ▼
    Check token format         Check request body
    Login again if expired     Follow API docs
```

---

## ✅ Verification Checklist

After setup, verify each item:

```
□ Dependencies installed (node_modules/ exists)
□ .env file created and configured
□ MySQL connection successful
□ Database 'donation_hub' exists
□ All 6 tables created
□ Default admin user in users table
□ Server starts without errors
□ Health endpoint returns success
  → http://localhost:5000/health
□ Admin login works
  → POST /api/auth/login
□ Can create donation
  → POST /api/donations/food
□ Postman collection imports successfully

If all checked ✓ → Setup Complete! 🎉
```

---

## 🎓 Learning Path

```
Beginner
  └─► Use automated setup (setup.ps1)
       └─► Test with Postman
            └─► Read API_REFERENCE.md

Intermediate
  └─► Manual setup (QUICK_START.md)
       └─► Understand each step
            └─► Customize configuration

Advanced
  └─► Full manual setup (SETUP_STEPS.md)
       └─► Modify schema.sql
            └─► Add new features
                 └─► Read README.md
```

---

**Choose your path and get started! 🚀**
