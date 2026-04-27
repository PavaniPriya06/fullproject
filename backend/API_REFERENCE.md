# API Endpoints Quick Reference

Base URL: `http://localhost:5000/api`

## Authentication

### Register
```http
POST /auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```http
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

## Donations (User)

### Create Food Donation
```http
POST /donations/food
Authorization: Bearer {token}
{
  "riceQty": 10,
  "vegQty": 5
}
```

### Create Apparel Donation
```http
POST /donations/apparel
Authorization: Bearer {token}
{
  "targetAge": 20
}
```
Valid ages: 10, 19, 20, 30, 45

### Create Money Donation
```http
POST /donations/money
Authorization: Bearer {token}
{
  "amount": 100.50,
  "qrPayload": "optional_qr_data"
}
```

### Get My Donations
```http
GET /donations/my-donations
Authorization: Bearer {token}
```

### Get Single Donation
```http
GET /donations/:id
Authorization: Bearer {token}
```

## Admin Endpoints

### Get All Donations
```http
GET /donations
Authorization: Bearer {admin_token}
```

### Get Statistics
```http
GET /donations/stats
Authorization: Bearer {admin_token}
```

### Approve Donation
```http
PUT /admin/donations/:id/approve
Authorization: Bearer {admin_token}
```

### Reject Donation
```http
PUT /admin/donations/:id/reject
Authorization: Bearer {admin_token}
{
  "reason": "Incomplete information"
}
```

### Get All Users
```http
GET /admin/users
Authorization: Bearer {admin_token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
