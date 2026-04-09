# Spring Boot Backend - Quick Start

## 1. Prerequisites

Ensure you have installed:
- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- **Maven 3.8.1+** - [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)

Verify installations:
```bash
java -version
mvn -version
mysql --version
```

## 2. Initial Setup

### Step 1: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
CREATE DATABASE donation_hub;
USE donation_hub;
SOURCE path/to/database/schema.sql;

# Exit MySQL
EXIT;
```

### Step 2: Configure Application

Edit `spring-boot-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/donation_hub
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

app.jwtSecret=your_very_long_secret_key_minimum_32_characters_for_production

app.cors.allowedOrigins=http://localhost:3000,http://localhost:5173
```

### Step 3: Build Project

```bash
cd spring-boot-backend
mvn clean install
```

### Step 4: Run Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 3. Test the API

### Health Check
```bash
curl http://localhost:8080/health
```

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response includes a JWT token. Save it for subsequent requests.

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Donation
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

### Get Your Donations
```bash
curl http://localhost:8080/api/donations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 4. Project Structure

```
spring-boot-backend/
├── src/main/java/com/donatehub/
│   ├── DonationBackendApplication.java    # Main app
│   ├── config/                             # Configuration
│   ├── controller/                         # REST controllers
│   ├── service/                            # Business logic
│   ├── entity/                             # JPA entities
│   ├── repository/                         # Data access
│   ├── dto/                                # Data transfer objects
│   ├── security/                           # Security/JWT
│   └── exception/                          # Exception handling
├── src/main/resources/
│   └── application.properties              # Config file
├── pom.xml                                 # Maven config
└── README.md                               # Full documentation
```

## 5. Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 3.2.2 | Web framework |
| Spring Security | - | Authentication |
| JWT | 0.12.3 | Token auth |
| Spring Data JPA | - | Database ORM |
| MySQL | 8.0+ | Database |
| Lombok | - | Boilerplate reduction |

## 6. Common Commands

```bash
# Build without running tests
mvn clean install -DskipTests

# Run tests
mvn test

# Run with auto-reload
mvn spring-boot:run

# Create production JAR
mvn clean package

# Run packaged JAR
java -jar target/donation-backend-1.0.0.jar
```

## 7. Default Admin User

Access admin features with:
- **Email**: admin@donatehub.com
- **Password**: Admin@123

⚠️ **Change these credentials in production!**

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| MySQL connection error | Verify MySQL is running and credentials are correct |
| Port 8080 already in use | Change `server.port` in application.properties |
| Build fails | Run `mvn clean` and try again |
| JWT decode error | Ensure JWT secret is correct and token is valid |

## 9. Next Steps

1. Configure CORS for your frontend URL
2. Set up email notifications
3. Add logging/monitoring
4. Configure production JWT secret
5. Set up CI/CD pipeline
6. Deploy to cloud (AWS, Azure, GCP, etc.)

## 10. API Quick Reference

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Get JWT token |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/donations` | Yes | Create donation |
| GET | `/api/donations` | Yes | List user donations |
| GET | `/api/donations/{id}` | Yes | Get donation details |
| GET | `/api/admin/donations/pending` | Yes (Admin) | Get pending donations |
| PUT | `/api/admin/donations/{id}/approve` | Yes (Admin) | Approve/reject donation |

For complete API documentation, see [API_REFERENCE.md](API_REFERENCE.md)

## Need Help?

- Check the logs: `tail -f logs/application.log`
- Review [README.md](README.md) for full documentation
- Check [API_REFERENCE.md](API_REFERENCE.md) for endpoint details
