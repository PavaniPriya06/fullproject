# 🔍 Debugging Form Submission Issues

## Quick Test Steps

### 1. **Open Browser Developer Tools** (F12)
Press `F12` → Select **Console** tab

### 2. **Try Submitting Food Donation**
Go to `food-inventory.html`:
- Select any Trust ✓
- Enter Rice: `5`
- Enter Vegetables: `10`
- Enter Fruits: `3`
- Click **Submit Donation**

### 3. **What to Look For in Console**

You should see logs like this:

```
📤 Saving food donation to backend... {userId: 'user-001', riceQty: 5, vegQty: 10, fruitsQty: 3}
📊 Payload: {userId: 'user-001', type: 'FOOD', donationStatus: 'PENDING', details: {…}}
📡 Response Status: 200
📥 Response Data: {success: true, id: 'donation-123', message: 'Saved'}
✅ Food donation saved: donation-123
```

### 4. **If You See an ERROR**

Look for logs like:
```
❌ FOOD FORM SUBMISSION FAILED: Error: ...
📋 Error details: {
  message: "...",
  status: 500  (or 401, 404, etc),
  stack: "..."
}
```

### Error Code Guide:

| Code | Meaning | Solution |
|------|---------|----------|
| **401** | Not Authorized | Auth token missing/invalid |
| **404** | Not Found | Backend endpoint doesn't exist |
| **500** | Server Error | Backend threw exception (check backend logs) |
| **CORS Error** | Domain blocked | Backend not allowing requests from frontend |

---

## 📊 Check Backend Server

### Windows PowerShell:

```powershell
# Check if backend is running
netstat -ano | Select-String "8081"

# Should show:
# TCP    0.0.0.0:8081           0.0.0.0:0              LISTENING       25804
```

If **nothing shows**, backend is NOT running.

### Restart Backend:
```powershell
cd D:\donation\spring-boot-backend
java -jar target/donation-backend-1.0.0.jar
```

---

## 🗄️ Check MySQL Database

```powershell
# Login to MySQL
mysql -h localhost -u root -pwelcome

# Check databases
show databases;

# Use donation_hub
use donation_hub;

# Check if donations exist
SELECT * FROM donations;
SELECT * FROM food_donations;

# Should be empty initially, then have records after successful submissions
```

---

## 🎯 Network Tab Check

Open DevTools → **Network** tab → Submit form

You should see:
1. **POST** request to `http://localhost:8081/api/donations`
2. **Status: 200** or **Status: 201** (success)
3. **Response** contains donation ID and success message

**If you see:**
- ❌ **Red status** (401, 404, 500) → Backend error
- ⏱️ **Pending** → Backend not responding
- 🔴 **BLOCKED** → CORS issue

---

## 📝 Key API Endpoints

The frontend is trying to call:

```
POST http://localhost:8081/api/donations
```

With payload:
```json
{
  "userId": "user-001",
  "type": "FOOD",
  "donationStatus": "PENDING",
  "details": {
    "riceQty": 5,
    "vegQty": 10,
    "fruitsQty": 3
  }
}
```

---

## ✅ Success Indicators

When donation saves correctly:
1. ✅ Console shows `✅ Food donation saved:` with ID
2. ✅ Toast message shows success (not error)
3. ✅ Backend is still running (no crash)
4. ✅ MySQL query shows new record: `SELECT COUNT(*) FROM donations;` → 1 or more

---

## 🚀 Full Test Workflow

1. **Backend Running?** → Check port 8081
2. **Database Connected?** → Query MySQL
3. **Frontend Connected?** → Open DevTools
4. **Try Form Submission** → Watch Console logs
5. **Check Database** → Verify record appeared

If stuck at any step, share the console error and we'll fix it!
