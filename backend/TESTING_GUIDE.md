# Backend Testing Guide

Complete guide to test all API endpoints and verify functionality.

---

## 📋 Pre-Testing Checklist

Before running tests, ensure:

- [ ] Server is running (`npm run dev`)
- [ ] Database is initialized (`npm run init-db`)
- [ ] .env is configured correctly
- [ ] Postman is installed (optional)

---

## 🧪 Testing Methods

### Method 1: PowerShell (Built-in)
✅ No additional software needed  
✅ Quick and simple  
❌ Harder to read responses

### Method 2: Postman (Recommended)
✅ Visual interface  
✅ Easy to organize tests  
✅ Save requests for reuse  
❌ Requires installation

### Method 3: curl (Cross-platform)
✅ Available on all systems  
✅ Scriptable  
❌ Complex syntax

---

## 🚀 Quick Test (Copy & Paste)

### 1. Health Check
```powershell
Invoke-WebRequest -Uri http://localhost:5000/health | Select-Object -Expand Content | ConvertFrom-Json | ConvertTo-Json
```

**Expected:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-25T..."
}
```

---

## 🔐 Authentication Tests

### 2. Register New User

```powershell
$registerBody = @{
    fullName = "Jane Doe"
    email = "jane@example.com"
    password = "secure123"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/register `
    -Method Post `
    -Body $registerBody `
    -ContentType "application/json"

# Save token for later
$userToken = $registerResponse.token

# Display response
$registerResponse | ConvertTo-Json -Depth 5
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u_1234567890_abc12",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "avatar": null,
    "totalDonated": 0,
    "donationsCount": 0
  }
}
```

### 3. Login User

```powershell
$loginBody = @{
    email = "jane@example.com"
    password = "secure123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/login `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json"

$userToken = $loginResponse.token
$loginResponse | ConvertTo-Json -Depth 5
```

### 4. Login Admin

```powershell
$adminLoginBody = @{
    email = "admin@donatehub.com"
    password = "Admin@123"
} | ConvertTo-Json

$adminLoginResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/login `
    -Method Post `
    -Body $adminLoginBody `
    -ContentType "application/json"

$adminToken = $adminLoginResponse.token
Write-Host "Admin Token: $adminToken" -ForegroundColor Green
$adminLoginResponse | ConvertTo-Json -Depth 5
```

### 5. Get Current User

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$meResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/me `
    -Method Get `
    -Headers $headers

$meResponse | ConvertTo-Json -Depth 5
```

---

## 📦 Donation Tests (User)

### 6. Create Food Donation

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$foodBody = @{
    riceQty = 15
    vegQty = 8
} | ConvertTo-Json

$foodResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations/food `
    -Method Post `
    -Body $foodBody `
    -ContentType "application/json" `
    -Headers $headers

# Save donation ID for later tests
$donationId = $foodResponse.donation.id
Write-Host "Donation ID: $donationId" -ForegroundColor Cyan

$foodResponse | ConvertTo-Json -Depth 5
```

**Expected:**
```json
{
  "success": true,
  "message": "Food donation submitted successfully",
  "donation": {
    "id": "dr_1234567890_abc12",
    "userId": "u_1234567890_xyz78",
    "type": "food",
    "status": "pending",
    "details": {
      "riceQty": 15,
      "vegQty": 8
    },
    "createdAt": "2026-02-25T10:30:00.000Z",
    "updatedAt": "2026-02-25T10:30:00.000Z"
  }
}
```

### 7. Create Apparel Donation

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$apparelBody = @{
    targetAge = 20
} | ConvertTo-Json

$apparelResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations/apparel `
    -Method Post `
    -Body $apparelBody `
    -ContentType "application/json" `
    -Headers $headers

$apparelResponse | ConvertTo-Json -Depth 5
```

### 8. Create Money Donation

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$moneyBody = @{
    amount = 250.75
    qrPayload = "PAYMENT_QR_DATA_12345"
} | ConvertTo-Json

$moneyResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations/money `
    -Method Post `
    -Body $moneyBody `
    -ContentType "application/json" `
    -Headers $headers

$moneyResponse | ConvertTo-Json -Depth 5
```

### 9. Get My Donations

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$myDonationsResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations/my-donations `
    -Method Get `
    -Headers $headers

Write-Host "Total Donations: $($myDonationsResponse.count)" -ForegroundColor Green
$myDonationsResponse | ConvertTo-Json -Depth 5
```

### 10. Get Single Donation

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$singleDonationResponse = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/donations/$donationId" `
    -Method Get `
    -Headers $headers

$singleDonationResponse | ConvertTo-Json -Depth 5
```

---

## 👨‍💼 Admin Tests

### 11. Get All Donations (Admin Only)

```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

$allDonationsResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations `
    -Method Get `
    -Headers $headers

Write-Host "Total Donations in System: $($allDonationsResponse.count)" -ForegroundColor Green
$allDonationsResponse | ConvertTo-Json -Depth 5
```

### 12. Get Statistics (Admin Only)

```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

$statsResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations/stats `
    -Method Get `
    -Headers $headers

Write-Host "`nDonation Statistics:" -ForegroundColor Cyan
Write-Host "  Total Records: $($statsResponse.stats.totalRecords)" -ForegroundColor White
Write-Host "  Approved:      $($statsResponse.stats.approved)" -ForegroundColor Green
Write-Host "  Pending:       $($statsResponse.stats.pending)" -ForegroundColor Yellow
Write-Host "  Rejected:      $($statsResponse.stats.rejected)" -ForegroundColor Red

$statsResponse | ConvertTo-Json -Depth 5
```

### 13. Approve Donation

```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

$approveResponse = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/admin/donations/$donationId/approve" `
    -Method Put `
    -Headers $headers

Write-Host "Donation Approved!" -ForegroundColor Green
$approveResponse | ConvertTo-Json -Depth 5
```

### 14. Reject Donation

```powershell
# First create a new donation to reject
$userHeaders = @{ Authorization = "Bearer $userToken" }
$newDonation = Invoke-RestMethod `
    -Uri http://localhost:5000/api/donations/food `
    -Method Post `
    -Body (@{riceQty=5; vegQty=3} | ConvertTo-Json) `
    -ContentType "application/json" `
    -Headers $userHeaders

$rejectId = $newDonation.donation.id

# Now reject it as admin
$adminHeaders = @{
    Authorization = "Bearer $adminToken"
}

$rejectBody = @{
    reason = "Insufficient information provided"
} | ConvertTo-Json

$rejectResponse = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/admin/donations/$rejectId/reject" `
    -Method Put `
    -Body $rejectBody `
    -ContentType "application/json" `
    -Headers $adminHeaders

Write-Host "Donation Rejected!" -ForegroundColor Red
$rejectResponse | ConvertTo-Json -Depth 5
```

### 15. Get All Users (Admin Only)

```powershell
$headers = @{
    Authorization = "Bearer $adminToken"
}

$usersResponse = Invoke-RestMethod `
    -Uri http://localhost:5000/api/admin/users `
    -Method Get `
    -Headers $headers

Write-Host "Total Users: $($usersResponse.count)" -ForegroundColor Green
$usersResponse | ConvertTo-Json -Depth 5
```

---

## ❌ Error Tests (Negative Testing)

### 16. Test Unauthorized Access

```powershell
# Try to access protected route without token
try {
    Invoke-RestMethod `
        -Uri http://localhost:5000/api/auth/me `
        -Method Get
} catch {
    Write-Host "Expected Error (401 Unauthorized):" -ForegroundColor Yellow
    $_.Exception.Response.StatusCode
}
```

### 17. Test Invalid Credentials

```powershell
$invalidBody = @{
    email = "wrong@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-RestMethod `
        -Uri http://localhost:5000/api/auth/login `
        -Method Post `
        -Body $invalidBody `
        -ContentType "application/json"
} catch {
    Write-Host "Expected Error (401 Unauthorized):" -ForegroundColor Yellow
    $parsedError = $_.ErrorDetails.Message | ConvertFrom-Json
    $parsedError | ConvertTo-Json
}
```

### 18. Test Invalid Input (Validation)

```powershell
$headers = @{
    Authorization = "Bearer $userToken"
}

$invalidFoodBody = @{
    riceQty = -5  # Negative number (invalid)
    vegQty = "not a number"  # String instead of number
} | ConvertTo-Json

try {
    Invoke-RestMethod `
        -Uri http://localhost:5000/api/donations/food `
        -Method Post `
        -Body $invalidFoodBody `
        -ContentType "application/json" `
        -Headers $headers
} catch {
    Write-Host "Expected Error (400 Validation Failed):" -ForegroundColor Yellow
    $parsedError = $_.ErrorDetails.Message | ConvertFrom-Json
    $parsedError | ConvertTo-Json -Depth 5
}
```

### 19. Test User Accessing Admin Route

```powershell
# User token trying to access admin endpoint
$headers = @{
    Authorization = "Bearer $userToken"
}

try {
    Invoke-RestMethod `
        -Uri http://localhost:5000/api/donations `
        -Method Get `
        -Headers $headers
} catch {
    Write-Host "Expected Error (403 Forbidden):" -ForegroundColor Yellow
    $parsedError = $_.ErrorDetails.Message | ConvertFrom-Json
    $parsedError | ConvertTo-Json
}
```

---

## 📊 Complete Test Suite Script

Save this as `test-all.ps1`:

```powershell
# Complete Backend Test Suite
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  DonateHub Backend Test Suite" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param($Name, $ScriptBlock)
    Write-Host "`n[$Name]" -ForegroundColor Yellow
    try {
        & $ScriptBlock
        Write-Host "  ✓ PASSED" -ForegroundColor Green
        $script:testsPassed++
    } catch {
        Write-Host "  ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
    }
}

# Run tests
Test-Endpoint "Health Check" {
    $response = Invoke-RestMethod "$baseUrl/health"
    if (-not $response.success) { throw "Health check failed" }
}

Test-Endpoint "Admin Login" {
    $body = @{email="admin@donatehub.com"; password="Admin@123"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    $script:adminToken = $response.token
    if (-not $response.token) { throw "No token received" }
}

Test-Endpoint "User Register" {
    $body = @{fullName="Test User"; email="test$(Get-Random)@example.com"; password="test123"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    $script:userToken = $response.token
    if (-not $response.token) { throw "No token received" }
}

Test-Endpoint "Create Food Donation" {
    $headers = @{Authorization = "Bearer $userToken"}
    $body = @{riceQty=10; vegQty=5} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/api/donations/food" -Method Post -Body $body -ContentType "application/json" -Headers $headers
    $script:donationId = $response.donation.id
    if (-not $response.success) { throw "Donation creation failed" }
}

Test-Endpoint "Get My Donations" {
    $headers = @{Authorization = "Bearer $userToken"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/donations/my-donations" -Method Get -Headers $headers
    if ($response.count -eq 0) { throw "No donations found" }
}

Test-Endpoint "Get All Donations (Admin)" {
    $headers = @{Authorization = "Bearer $adminToken"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/donations" -Method Get -Headers $headers
    if (-not $response.success) { throw "Failed to get donations" }
}

Test-Endpoint "Get Statistics (Admin)" {
    $headers = @{Authorization = "Bearer $adminToken"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/donations/stats" -Method Get -Headers $headers
    if (-not $response.stats) { throw "No stats returned" }
}

Test-Endpoint "Approve Donation (Admin)" {
    $headers = @{Authorization = "Bearer $adminToken"}
    $response = Invoke-RestMethod -Uri "$baseUrl/api/admin/donations/$donationId/approve" -Method Put -Headers $headers
    if ($response.donation.status -ne "approved") { throw "Donation not approved" }
}

# Summary
Write-Host "`n════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Test Results" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Passed: $testsPassed" -ForegroundColor Green
Write-Host "  Failed: $testsFailed" -ForegroundColor Red
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed" -ForegroundColor Yellow
}
```

**Run it:**
```powershell
.\test-all.ps1
```

---

## 📱 Postman Testing

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `postman_collection.json`
4. Create environment with:
   - `baseUrl`: `http://localhost:5000/api`
   - `userToken`: (copy after login)
   - `adminToken`: (copy after admin login)

### Test Flow in Postman

1. ✅ Authentication → Login Admin
2. ✅ Copy `token` from response
3. ✅ Set as `adminToken` in environment
4. ✅ Authentication → Register User
5. ✅ Copy `token` from response
6. ✅ Set as `userToken` in environment
7. ✅ Test all Donations endpoints
8. ✅ Test all Admin endpoints

---

## ✅ Verification Checklist

After running all tests:

```
□ Health check returns success
□ Admin can login
□ User can register
□ User can login
□ User can create food donation
□ User can create apparel donation
□ User can create money donation
□ User can view their donations
□ Admin can view all donations
□ Admin can view statistics
□ Admin can approve donations
□ Admin can reject donations
□ Admin can view all users
□ Unauthorized access is blocked (401)
□ Invalid credentials are rejected (401)
□ Invalid input is validated (400)
□ User cannot access admin routes (403)

If all checked ✓ → Backend is fully functional! 🎉
```

---

## 🐛 Common Test Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | Server not running | Run `npm run dev` |
| 401 Unauthorized | Token missing/invalid | Login again, copy token |
| 403 Forbidden | User accessing admin route | Use admin token |
| 400 Bad Request | Invalid input data | Check request body format |
| 404 Not Found | Wrong endpoint URL | Verify URL is correct |
| 500 Server Error | Database/code error | Check server logs |

---

**Happy Testing! 🧪**
