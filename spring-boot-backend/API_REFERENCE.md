# Spring Boot Backend - API Reference

## Base URL
```
http://localhost:8080
```

## Authentication

All endpoints except those marked as "Public" require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request (resource created)
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error type"
}
```

## Endpoints

### Authentication

#### Register User
**POST** `/api/auth/register` (Public)

Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": "u_abc12345",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "avatar": null
  }
}
```

**Validation:**
- `fullName`: Required, min 1 character
- `email`: Required, valid email format
- `password`: Required, min 6 characters

---

#### Login User
**POST** `/api/auth/login` (Public)

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": "u_abc12345",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "avatar": null
  }
}
```

---

#### Get Current User
**GET** `/api/auth/me` (Auth Required)

Get information about the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "u_abc12345",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "avatar": null
  }
}
```

---

### Donations

#### Create Donation
**POST** `/api/donations` (Auth Required)

Create a new donation.

**Request Body (Food Donation):**
```json
{
  "type": "food",
  "trustId": "trust_001",
  "riceQty": 10,
  "vegQty": 5,
  "fruitsQty": 3
}
```

**Request Body (Apparel Donation):**
```json
{
  "type": "apparel",
  "trustId": "trust_001",
  "targetAge": 10
}
```

**Request Body (Money Donation):**
```json
{
  "type": "money",
  "trustId": "trust_001",
  "amount": 500,
  "transactionId": "txn_12345",
  "qrPayload": "UPI:..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "id": "d_donation123",
    "userId": "u_abc12345",
    "type": "food",
    "status": "PENDING",
    "trustId": "trust_001",
    "riceQty": 10,
    "vegQty": 5,
    "fruitsQty": 3,
    "createdAt": "2024-04-09T10:30:00",
    "updatedAt": "2024-04-09T10:30:00"
  }
}
```

**Validation:**
- `type`: Required, one of: food, apparel, money
- Food donations: `riceQty`, `vegQty`, `fruitsQty` (integers ≥ 0)
- Apparel donations: `targetAge` (required)
- Money donations: `amount` (required, decimal), `transactionId` (required)

---

#### Get User Donations
**GET** `/api/donations?page=0&size=10` (Auth Required)

Get all donations by the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "d_donation123",
      "userId": "u_abc12345",
      "type": "food",
      "status": "APPROVED",
      "trustId": "trust_001",
      "riceQty": 10,
      "vegQty": 5,
      "fruitsQty": 3,
      "approvedBy": "u_admin123",
      "approvedAt": "2024-04-09T10:35:00",
      "createdAt": "2024-04-09T10:30:00",
      "updatedAt": "2024-04-09T10:35:00"
    }
  ],
  "totalPages": 1,
  "totalElements": 1
}
```

---

#### Get Donation By ID
**GET** `/api/donations/{id}` (Auth Required)

Get details of a specific donation.

**Path Parameters:**
- `id`: Donation ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "d_donation123",
    "userId": "u_abc12345",
    "type": "food",
    "status": "PENDING",
    "trustId": "trust_001",
    "riceQty": 10,
    "vegQty": 5,
    "fruitsQty": 3,
    "createdAt": "2024-04-09T10:30:00",
    "updatedAt": "2024-04-09T10:30:00"
  }
}
```

---

### Admin

#### Get Pending Donations
**GET** `/api/admin/donations/pending?page=0&size=10` (Admin Only)

Get all pending donations for review.

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "d_donation123",
      "userId": "u_abc12345",
      "type": "food",
      "status": "PENDING",
      "trustId": "trust_001",
      "riceQty": 10,
      "vegQty": 5,
      "fruitsQty": 3,
      "createdAt": "2024-04-09T10:30:00",
      "updatedAt": "2024-04-09T10:30:00"
    }
  ],
  "totalPages": 5,
  "totalElements": 45
}
```

---

#### Approve/Reject Donation
**PUT** `/api/admin/donations/{donationId}/approve` (Admin Only)

Approve or reject a pending donation.

**Path Parameters:**
- `donationId`: Donation ID

**Request Body (Approve):**
```json
{
  "approved": true
}
```

**Request Body (Reject):**
```json
{
  "approved": false,
  "rejectionReason": "Items not in good condition"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donation approved successfully",
  "data": {
    "id": "d_donation123",
    "userId": "u_abc12345",
    "type": "food",
    "status": "APPROVED",
    "trustId": "trust_001",
    "riceQty": 10,
    "vegQty": 5,
    "fruitsQty": 3,
    "approvedBy": "u_admin123",
    "approvedAt": "2024-04-09T10:35:00",
    "createdAt": "2024-04-09T10:30:00",
    "updatedAt": "2024-04-09T10:35:00"
  }
}
```

**Validation:**
- `approved`: Required (boolean)
- `rejectionReason`: Required if `approved` is false

---

### Health Check

#### Health Status
**GET** `/health` (Public)

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": 1712664600000
}
```

---

#### API Info
**GET** `/` (Public)

Get API root information.

**Response:**
```json
{
  "success": true,
  "message": "DonateHub API",
  "version": "1.0.0",
  "status": "running"
}
```

---

## Error Examples

### Invalid Email Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email should be valid"
  },
  "status": 400
}
```

### Email Already Exists
```json
{
  "success": false,
  "message": "Email already in use",
  "error": "Resource Already Exists",
  "status": 409
}
```

### Unauthorized Access
```json
{
  "success": false,
  "message": "Unauthorized - Full authentication is required to access this resource",
  "error": "Unauthorized",
  "status": 401
}
```

### Donation Not Found
```json
{
  "success": false,
  "message": "Donation not found",
  "error": "Resource Not Found",
  "status": 404
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider implementing:
- IP-based rate limiting
- Per-user rate limiting
- Token-based rate limiting

---

## Pagination

Endpoints that return lists support pagination:
- `page`: Zero-indexed page number (default: 0)
- `size`: Number of items per page (default: 10)

Example:
```
GET /api/donations?page=1&size=20
```

---

## Sorting

Donations are sorted by creation time (newest first).

## Changelog

### Version 1.0.0 (2024-04-09)
- Initial release
- Authentication with JWT
- Donation management (create, list, view)
- Admin dashboard (pending donations, approval/rejection)
- Food, Apparel, and Money donations support
