# DonateHub Backend API

Node.js + Express backend for the DonateHub Donation Management System with MySQL database and JWT authentication.

---

## 📚 Documentation Hub

**New to this project?** Start here:

- **⚡ Quick Start (2 min):** [QUICK_START.md](QUICK_START.md) - Fastest way to get running
- **📋 Detailed Setup (10 min):** [SETUP_STEPS.md](SETUP_STEPS.md) - Step-by-step guide
- **🎨 Visual Guide:** [SETUP_VISUAL.md](SETUP_VISUAL.md) - Diagrams and flowcharts
- **🧪 Testing Guide:** [TESTING_GUIDE.md](TESTING_GUIDE.md) - Test all endpoints
- **📖 API Reference:** [API_REFERENCE.md](API_REFERENCE.md) - All endpoints
- **📑 Full Documentation Index:** [DOCUMENTATION.md](DOCUMENTATION.md) - All docs

**Choose your learning path and follow the guide that fits your style!**

---

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - User and Admin roles with different permissions
- **RESTful API** - Clean and organized API endpoints
- **MySQL Database** - Relational database with normalized schema
- **Input Validation** - Request validation using express-validator
- **Error Handling** - Centralized error handling middleware
- **Security** - Helmet.js for security headers, bcrypt for password hashing
- **CORS Support** - Cross-Origin Resource Sharing enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository and navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the backend folder:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=donation_hub
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000
```

### 4. Set up MySQL database

Make sure MySQL is running, then initialize the database:

```bash
npm run init-db
```

This will:
- Create the `donation_hub` database
- Create all required tables
- Insert the default admin user

**Default Admin Credentials:**
- Email: `admin@donatehub.com`
- Password: `Admin@123`

### 5. Start the server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection pool
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── donationController.js # Donation CRUD operations
│   └── adminController.js   # Admin operations
├── middleware/
│   ├── auth.js              # JWT verification & authorization
│   ├── error.js             # Error handling
│   └── validator.js         # Request validation
├── models/
│   ├── User.js              # User model
│   └── Donation.js          # Donation model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── donations.js         # Donation routes
│   └── admin.js             # Admin routes
├── scripts/
│   └── initDatabase.js      # Database initialization
├── utils/
│   └── helpers.js           # Helper functions
├── database/
│   └── schema.sql           # Database schema
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── server.js                # Application entry point
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Donation Routes (`/api/donations`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/donations/food` | Create food donation | Private |
| POST | `/api/donations/apparel` | Create apparel donation | Private |
| POST | `/api/donations/money` | Create money donation | Private |
| GET | `/api/donations/my-donations` | Get user's donations | Private |
| GET | `/api/donations/:id` | Get single donation | Private |
| GET | `/api/donations` | Get all donations | Admin |
| GET | `/api/donations/stats` | Get statistics | Admin |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PUT | `/api/admin/donations/:id/approve` | Approve donation | Admin |
| PUT | `/api/admin/donations/:id/reject` | Reject donation | Admin |
| GET | `/api/admin/users` | Get all users | Admin |

## 📝 API Usage Examples

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u_1234567890_abc12",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null,
    "totalDonated": 0,
    "donationsCount": 0
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u_1234567890_abc12",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null,
    "totalDonated": 150.50,
    "donationsCount": 5
  }
}
```

### Create Food Donation

```http
POST /api/donations/food
Authorization: Bearer {token}
Content-Type: application/json

{
  "riceQty": 10,
  "vegQty": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Food donation submitted successfully",
  "donation": {
    "id": "dr_1234567890_abc12",
    "userId": "u_1234567890_abc12",
    "type": "food",
    "status": "pending",
    "details": {
      "riceQty": 10,
      "vegQty": 5
    },
    "createdAt": "2026-02-25T10:30:00.000Z",
    "updatedAt": "2026-02-25T10:30:00.000Z"
  }
}
```

### Create Money Donation

```http
POST /api/donations/money
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100.50,
  "qrPayload": "payment_data_here"
}
```

### Approve Donation (Admin Only)

```http
PUT /api/admin/donations/dr_1234567890_abc12/approve
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Donation approved successfully",
  "donation": {
    "id": "dr_1234567890_abc12",
    "status": "approved",
    "approvedBy": "u_admin_seed",
    "approvedAt": "2026-02-25T11:00:00.000Z"
  }
}
```

### Reject Donation (Admin Only)

```http
PUT /api/admin/donations/dr_1234567890_abc12/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Incomplete information"
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

The token is returned upon successful login or registration.

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `full_name` - User's full name
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `role` - 'user' or 'admin'
- `avatar` - Profile picture URL
- `total_donated` - Total amount donated
- `donations_count` - Number of donations
- `joined_at` - Registration timestamp

### Donations Table (Master)
- `id` - Primary key
- `user_id` - Foreign key to users
- `type` - 'food', 'apparel', or 'money'
- `donation_status` - 'pending', 'approved', or 'rejected'
- `approved_by` - Admin user ID who approved/rejected
- `approved_at` - Approval timestamp
- `rejection_reason` - Reason for rejection

### Food Donations
- `donation_id` - Foreign key to donations
- `rice_qty` - Rice quantity (kg)
- `veg_qty` - Vegetable quantity (kg)

### Apparel Donations
- `donation_id` - Foreign key to donations
- `target_age` - Target age group (10, 19, 20, 30, 45)

### Money Donations
- `donation_id` - Foreign key to donations
- `transaction_id` - Transaction reference
- `amount` - Donation amount
- `qr_payload` - QR code data

## 🧪 Testing

Test the server is running:

```bash
curl http://localhost:5000/health
```

## 🔧 Troubleshooting

### Database connection fails
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify MySQL user has proper permissions

### Port already in use
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### JWT token expired
- Tokens expire after 7 days by default
- User must login again to get a new token
- Adjust `JWT_EXPIRE` in `.env` if needed

## 📄 License

ISC

## 👨‍💻 Development

### Add new dependency
```bash
npm install package-name
```

### Database changes
After modifying `schema.sql`, re-run:
```bash
npm run init-db
```

**Warning:** This will drop existing data. Use migrations for production.

---

**Made with ❤️ for DonateHub**
