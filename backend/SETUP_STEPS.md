# DonateHub Backend - Complete Setup Steps

Follow these steps in order to set up and run the backend server.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js** installed (v14 or higher) - [Download](https://nodejs.org/)
- [ ] **MySQL** installed (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- [ ] **MySQL running** and accessible
- [ ] MySQL **root password** or user credentials
- [ ] **Terminal/PowerShell** access
- [ ] **Text editor** (VS Code, Notepad++, etc.)

### ✅ Verify Installations

```powershell
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check MySQL is running and accessible
mysql --version
```

---

## 🚀 Step-by-Step Setup

### **STEP 1: Navigate to Backend Directory**

```powershell
cd d:\donation\backend
```

**Expected output:** Your terminal prompt should show you're in the backend folder.

---

### **STEP 2: Install Dependencies**

```powershell
npm install
```

**What this does:**
- Downloads and installs all required Node.js packages
- Creates `node_modules` folder
- Creates `package-lock.json` file

**Expected output:**
```
added 150+ packages in 30s
```

**⚠️ If you see errors:**
- Make sure you have internet connection
- Try `npm cache clean --force` then retry
- Check your Node.js version with `node --version`

---

### **STEP 3: Create Environment Configuration**

#### 3.1 Copy the example environment file

```powershell
Copy-Item .env.example .env
```

#### 3.2 Edit the `.env` file

```powershell
# Open in notepad
notepad .env

# OR open in VS Code
code .env
```

#### 3.3 Configure your settings

Replace the placeholder values with your actual configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE    # ⚠️ CHANGE THIS
DB_NAME=donation_hub
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_abc123xyz789
JWT_EXPIRE=7d

# CORS Configuration (Frontend URL)
FRONTEND_URL=http://localhost:3000
```

**Important:**
- ✅ Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL password
- ✅ Replace `JWT_SECRET` with a random, secure string (can use any long random text)
- ✅ Save the file after editing

**Example JWT_SECRET generation:**
```powershell
# Generate random string in PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

### **STEP 4: Verify MySQL is Running**

#### 4.1 Test MySQL connection

```powershell
# Try connecting to MySQL
mysql -u root -p
```

**You should see:**
```
Enter password: [type your password]
mysql>
```

#### 4.2 Exit MySQL if connected successfully

```sql
exit
```

**⚠️ If MySQL connection fails:**
- Make sure MySQL service is running
- Check username and password
- On Windows: Start MySQL from Services or XAMPP/WAMP

**Start MySQL Service (Windows):**
```powershell
# If using MySQL service
net start MySQL80

# OR if using XAMPP
# Start XAMPP Control Panel and start MySQL
```

---

### **STEP 5: Initialize Database**

This step creates the database, tables, and default admin user.

```powershell
npm run init-db
```

**Expected output:**
```
🔄 Initializing database...

✓ Connected to MySQL server
✓ Database 'donation_hub' created/verified
✓ Database schema created successfully
✓ Default admin user created

📧 Admin credentials:
   Email:    admin@donatehub.com
   Password: Admin@123

✅ Database initialization complete!
```

**⚠️ If you see errors:**

| Error | Solution |
|-------|----------|
| `Access denied` | Check DB_USER and DB_PASSWORD in .env |
| `Cannot connect` | Make sure MySQL is running |
| `ER_DUP_ENTRY` | Database already exists (this is OK) |

**✅ Verify database was created:**

```powershell
mysql -u root -p
```

```sql
-- In MySQL console
SHOW DATABASES;
USE donation_hub;
SHOW TABLES;
SELECT * FROM users;
exit
```

You should see 6 tables and 1 admin user.

---

### **STEP 6: Start the Server**

#### Option A: Development Mode (Recommended for testing)

```powershell
npm run dev
```

**What this does:**
- Starts server with auto-reload (using nodemon)
- Restarts automatically when you change code
- Shows detailed logs

#### Option B: Production Mode

```powershell
npm start
```

**What this does:**
- Starts server without auto-reload
- More stable for production use

**Expected output:**
```
╔════════════════════════════════════════════╗
║     DonateHub API Server Running          ║
║                                            ║
║  Environment: development                  ║
║  Port:        5000                         ║
║  URL:         http://localhost:5000        ║
╚════════════════════════════════════════════╝

✓ MySQL Database connected successfully
```

**✅ Server is running! Keep this terminal open.**

---

### **STEP 7: Test the Server**

#### 7.1 Test health endpoint

Open a **NEW terminal** (keep server running in first terminal) and run:

```powershell
# Test with PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health | Select-Object -Expand Content
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-25T..."
}
```

#### 7.2 Test root endpoint

```powershell
Invoke-WebRequest -Uri http://localhost:5000 | Select-Object -Expand Content
```

**Expected response:**
```json
{
  "success": true,
  "message": "DonateHub API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "donations": "/api/donations",
    "admin": "/api/admin"
  }
}
```

**✅ If you see these responses, your server is working!**

---

### **STEP 8: Test API Endpoints**

#### 8.1 Test Admin Login

```powershell
$body = @{
    email = "admin@donatehub.com"
    password = "Admin@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -Body $body -ContentType "application/json"

# Display response
$response | ConvertTo-Json

# Save token for later use
$adminToken = $response.token
Write-Host "Admin Token: $adminToken"
```

**Expected response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u_admin_seed",
    "fullName": "System Administrator",
    "email": "admin@donatehub.com",
    "role": "admin",
    ...
  }
}
```

#### 8.2 Test User Registration

```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method Post -Body $body -ContentType "application/json"

# Display response
$response | ConvertTo-Json

# Save user token
$userToken = $response.token
Write-Host "User Token: $userToken"
```

#### 8.3 Test Create Donation

```powershell
# Use the user token from previous step
$headers = @{
    Authorization = "Bearer $userToken"
}

$body = @{
    riceQty = 10
    vegQty = 5
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/donations/food -Method Post -Body $body -ContentType "application/json" -Headers $headers

$response | ConvertTo-Json
```

**Expected response:**
```json
{
  "success": true,
  "message": "Food donation submitted successfully",
  "donation": {
    "id": "dr_...",
    "type": "food",
    "status": "pending",
    ...
  }
}
```

#### 8.4 Test Get All Donations (Admin)

```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

$response = Invoke-RestMethod -Uri http://localhost:5000/api/donations -Method Get -Headers $headers

$response | ConvertTo-Json
```

**✅ If all tests pass, your API is fully functional!**

---

### **STEP 9: Test with Postman (Optional but Recommended)**

#### 9.1 Install Postman

Download from: https://www.postman.com/downloads/

#### 9.2 Import Collection

1. Open Postman
2. Click **Import** button
3. Select **File** tab
4. Choose `d:\donation\backend\postman_collection.json`
5. Click **Import**

#### 9.3 Set up Environment Variables

1. Click **Environments** in left sidebar
2. Create new environment "DonateHub Local"
3. Add variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `userToken`: (will be set after login)
   - `adminToken`: (will be set after admin login)

#### 9.4 Test Requests

1. Select **Authentication** → **Login Admin**
2. Click **Send**
3. Copy the `token` from response
4. Paste into `adminToken` environment variable
5. Test other endpoints!

---

## 🎯 Verification Checklist

After completing all steps, verify:

- [ ] Server starts without errors
- [ ] Health endpoint returns success
- [ ] Admin login works
- [ ] User registration works
- [ ] Can create donations
- [ ] Admin can view all donations
- [ ] Database has data in tables

---

## 🔧 Troubleshooting

### Server won't start

**Error:** `Port 5000 already in use`
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID your_pid_here /F

# OR change PORT in .env to 5001
```

**Error:** `Cannot find module 'express'`
```powershell
# Re-install dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Database errors

**Error:** `Access denied for user`
- Check DB_PASSWORD in `.env`
- Verify MySQL user has permissions
- Try: `GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';`

**Error:** `Table doesn't exist`
```powershell
# Re-initialize database
npm run init-db
```

### JWT token errors

**Error:** `jwt malformed`
- Token is missing or incorrect format
- Make sure to include full token with `Bearer ` prefix

**Error:** `jwt expired`
- Token has expired (default 7 days)
- Login again to get new token

---

## 🎉 Success!

You now have:

✅ Backend server running on http://localhost:5000  
✅ MySQL database with schema and admin user  
✅ JWT authentication working  
✅ All API endpoints functional  
✅ Ready to integrate with frontend  

**Next Steps:**
1. Keep server running
2. Update frontend to use API endpoints
3. Start building features!

---

## 📚 Additional Resources

- **Full API Documentation:** See `API_REFERENCE.md`
- **Complete README:** See `README.md`
- **Postman Collection:** Import `postman_collection.json`

---

## 📞 Quick Reference Commands

```powershell
# Navigate to backend
cd d:\donation\backend

# Install dependencies
npm install

# Initialize database
npm run init-db

# Start development server
npm run dev

# Start production server
npm start

# Test health endpoint
Invoke-WebRequest -Uri http://localhost:5000/health

# Stop server
Ctrl + C
```

---

**Made with ❤️ for DonateHub**
