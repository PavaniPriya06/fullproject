# Spring Boot Backend - Getting Started

Welcome to the DonateHub Spring Boot Backend! This is a complete, production-ready backend for the donation management system.

## 📍 Location

```
d:\donation\spring-boot-backend\
```

## ⚡ Quick Setup (5 minutes)

### 1. Prerequisites
- ✅ Java 17+ installed
- ✅ Maven 3.8.1+ installed
- ✅ MySQL 8.0+ running

### 2. Database Setup
```bash
mysql -u root -p
CREATE DATABASE donation_hub;
SOURCE d:\donation\backend\database\schema.sql;
```

### 3. Configure
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=your_mysql_password
app.jwtSecret=your_very_long_secret_key_at_least_32_characters
```

### 4. Build & Run
```bash
cd d:\donation\spring-boot-backend
mvn clean install
mvn spring-boot:run
```

### 5. Test
```bash
# In new terminal
curl http://localhost:8080/health
```

✅ Backend is now running at **http://localhost:8080**

## 📚 Documentation

Read these in order:

1. **START HERE** → [QUICK_START.md](QUICK_START.md)
   - 10-minute setup guide
   - First API test examples

2. **API Usage** → [API_REFERENCE.md](API_REFERENCE.md)
   - Complete endpoint documentation
   - All request/response examples
   - Error handling

3. **Detailed Setup** → [SETUP_STEPS.md](SETUP_STEPS.md)
   - Step-by-step installation
   - Troubleshooting guide
   - Production deployment

4. **Overview** → [README.md](README.md)
   - Full project documentation
   - Technologies used
   - Configuration options

5. **Summary** → [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
   - What's included
   - Project structure
   - Features overview

## 🎯 First API Call

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

Response will include a JWT token. Save it!

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

Both will return:
```json
{
  "success": true,
  "message": "...",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": "u_...",
    "fullName": "Test User",
    "email": "test@example.com",
    "role": "USER"
  }
}
```

### Create Donation (use token from above)
```bash
curl -X POST http://localhost:8080/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "food",
    "riceQty": 10,
    "vegQty": 5,
    "fruitsQty": 3,
    "trustId": "trust_001"
  }'
```

## 📂 Project Structure

```
spring-boot-backend/
├── src/main/java/com/donatehub/          # Source code
│   ├── config/                            # Configuration
│   ├── controller/                        # REST endpoints
│   ├── service/                           # Business logic
│   ├── entity/                            # Database entities
│   ├── repository/                        # Data access
│   ├── dto/                               # Data transfer objects
│   ├── security/                          # JWT security
│   └── exception/                         # Exception handling
├── src/main/resources/
│   └── application.properties             # Configuration
├── pom.xml                                # Maven dependencies
└── Documentation files...                 # Setup & API docs
```

## 🔑 Key Features

✅ **User Authentication**
- Register new users
- Login with JWT tokens
- Role-based access (USER, ADMIN)

✅ **Donation Management**
- Create food/apparel/money donations
- View personal donations
- Track donation status

✅ **Admin Dashboard**
- View pending donations
- Approve/reject donations
- Send notifications

✅ **Security**
- JWT authentication
- Encrypted passwords
- CORS configuration
- Exception handling

## 🔐 Default Admin Account

For testing admin features:
- Email: `admin@donatehub.com`
- Password: `Admin@123`

⚠️ Change these in production!

## 🛠️ Development Commands

```bash
# Clean build
mvn clean install

# Build only (skip tests)
mvn clean install -DskipTests

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Create production JAR
mvn clean package

# View all dependencies
mvn dependency:tree
```

## 🚀 API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | No | Create account |
| `/api/auth/login` | POST | No | Get JWT token |
| `/api/auth/me` | GET | Yes | Current user info |
| `/api/donations` | POST | Yes | Create donation |
| `/api/donations` | GET | Yes | List donations |
| `/api/donations/{id}` | GET | Yes | Get donation |
| `/api/admin/donations/pending` | GET | Admin | Pending donations |
| `/api/admin/donations/{id}/approve` | PUT | Admin | Approve/reject |
| `/health` | GET | No | Health check |

## ⚙️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/donation_hub
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JWT (CHANGE FOR PRODUCTION!)
app.jwtSecret=your_secret_key_minimum_32_chars

# CORS (Update with your frontend URL)
app.cors.allowedOrigins=http://localhost:3000,http://localhost:5173

# Logging
logging.level.root=INFO
```

## 🔍 Troubleshooting

### MySQL Connection Error
```
Error: Communications link failure
```
→ Ensure MySQL is running and password is correct

### Port 8080 Already in Use
→ Change `server.port` in application.properties

### Build Fails
```bash
mvn clean install -U
```

### Need More Help?
→ See [SETUP_STEPS.md](SETUP_STEPS.md#troubleshooting)

## 📊 Technology Stack

- **Spring Boot**: 3.2.2
- **Java**: 17 LTS
- **Database**: MySQL 8.0+
- **Authentication**: JWT
- **Build**: Maven 3.8.1+

## 🎓 Learning Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 📋 Checklist

- [ ] Java 17+ installed and verified
- [ ] Maven installed and verified
- [ ] MySQL installed and running
- [ ] Database created and schema imported
- [ ] application.properties configured
- [ ] `mvn clean install` runs successfully
- [ ] `mvn spring-boot:run` starts application
- [ ] `curl http://localhost:8080/health` returns success
- [ ] Can register new user
- [ ] Can login and get JWT token
- [ ] Can create donation with token

## 🚀 Next Steps

1. **Start Backend**: Follow Quick Setup above
2. **Test API**: Use curl examples in this guide
3. **Connect Frontend**: Update CORS in configuration
4. **Read Full Docs**: Check [README.md](README.md) for details
5. **Deploy**: Follow [SETUP_STEPS.md](SETUP_STEPS.md#deployment)

## 📞 Need Help?

| Topic | File |
|-------|------|
| Quick start | [QUICK_START.md](QUICK_START.md) |
| API reference | [API_REFERENCE.md](API_REFERENCE.md) |
| Setup steps | [SETUP_STEPS.md](SETUP_STEPS.md) |
| Full docs | [README.md](README.md) |
| What's included | [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) |

---

**Ready to build? Start with [QUICK_START.md](QUICK_START.md)** 🚀
