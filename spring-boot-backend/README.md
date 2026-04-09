# Spring Boot Backend Setup Guide

## Prerequisites

- Java 17 or higher [Download Java 17](https://www.oracle.com/java/technologies/downloads/#java17)
- Maven 3.8.1 or higher [Download Maven](https://maven.apache.org/download.cgi)
- MySQL 8.0 or higher [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- Git (optional but recommended)

## Quick Start

### 1. Database Setup

First, create the database and tables:

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema SQL
SOURCE backend/database/schema.sql
```

Or use the provided initialization script from the Node.js backend.

### 2. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/donation_hub?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Secret (change this in production!)
app.jwtSecret=your_jwt_secret_key_change_this_in_production_at_least_32_characters_long

# CORS (adjust URLs as needed)
app.cors.allowedOrigins=http://localhost:3000,http://localhost:5173,http://localhost:8080
```

### 3. Build the Project

```bash
cd spring-boot-backend
mvn clean install
```

### 4. Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or run the JAR file
java -jar target/donation-backend-1.0.0.jar
```

The application will start on `http://localhost:8080`

## Project Structure

```
spring-boot-backend/
├── src/
│   ├── main/
│   │   ├── java/com/donatehub/
│   │   │   ├── DonationBackendApplication.java          # Main Spring Boot Application
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java                  # Security & JWT Configuration
│   │   │   │   ├── GlobalExceptionHandler.java          # Exception Handling
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java                  # Authentication endpoints
│   │   │   │   ├── DonationController.java              # Donation endpoints
│   │   │   │   ├── AdminController.java                 # Admin endpoints
│   │   │   │   ├── RootController.java                  # Health check & root
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java                     # Auth logic
│   │   │   │   ├── DonationService.java                 # Donation logic
│   │   │   │   ├── CustomUserDetailsService.java        # User details service
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   ├── Donation.java
│   │   │   │   ├── FoodDonation.java
│   │   │   │   ├── ApparelDonation.java
│   │   │   │   ├── MoneyDonation.java
│   │   │   │   ├── Notification.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── DonationRepository.java
│   │   │   │   ├── FoodDonationRepository.java
│   │   │   │   ├── ApparelDonationRepository.java
│   │   │   │   ├── MoneyDonationRepository.java
│   │   │   │   ├── NotificationRepository.java
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── CreateDonationRequest.java
│   │   │   │   ├── DonationResponse.java
│   │   │   │   ├── ApproveDonationRequest.java
│   │   │   ├── security/
│   │   │   │   ├── JwtTokenProvider.java                 # JWT token generation & validation
│   │   │   │   ├── JwtAuthenticationFilter.java         # JWT filter
│   │   │   │   ├── JwtAuthenticationEntryPoint.java     # JWT entry point
│   │   │   ├── exception/
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── ResourceAlreadyExistsException.java
│   │   ├── resources/
│   │   │   ├── application.properties                   # Application configuration
│   └── test/                                             # Tests
├── pom.xml                                               # Maven configuration
└── README.md                                             # This file
```

## API Endpoints

### Authentication Endpoints

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login and get JWT token
- **GET** `/api/auth/me` - Get current user info (requires auth)

### Donation Endpoints

- **POST** `/api/donations` - Create a donation (requires auth)
- **GET** `/api/donations` - Get user's donations (requires auth)
- **GET** `/api/donations/{id}` - Get specific donation (requires auth)

### Admin Endpoints

- **GET** `/api/admin/donations/pending` - Get pending donations (admin only)
- **PUT** `/api/admin/donations/{donationId}/approve` - Approve/reject donation (admin only)

### Health Check

- **GET** `/health` - Health check endpoint
- **GET** `/` - API root info

## Example Requests

### Register

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Food Donation

```bash
curl -X POST http://localhost:8080/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "food",
    "riceQty": 10,
    "vegQty": 5,
    "fruitsQty": 3,
    "trustId": "trust_123"
  }'
```

### Create Money Donation

```bash
curl -X POST http://localhost:8080/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "money",
    "amount": 500,
    "transactionId": "txn_12345",
    "trustId": "trust_123"
  }'
```

### Get Pending Donations (Admin)

```bash
curl -X GET "http://localhost:8080/api/admin/donations/pending?page=0&size=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Approve Donation (Admin)

```bash
curl -X PUT http://localhost:8080/api/admin/donations/{donationId}/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "approved": true
  }'
```

## Default Admin User

The default admin user created in the database is:
- **Email**: admin@donatehub.com
- **Password**: Admin@123
- **Role**: admin

**Important**: Change these credentials in production!

## Development

### Build with Maven

```bash
mvn clean install -DskipTests
```

### Run tests

```bash
mvn test
```

### Run with hot reload

Make sure `spring-boot-devtools` is included in pom.xml (it is by default).

```bash
mvn spring-boot:run
```

## Troubleshooting

### MySQL Connection Issues

```
Error: Communications link failure
```

**Solution**: Ensure MySQL is running and the credentials in `application.properties` are correct.

### Port Already in Use

```
Error: Port 8080 already in use
```

**Solution**: Change the port in `application.properties`:
```properties
server.port=8081
```

### JWT Token Expired

The JWT token expires after 24 hours (86400000 ms). Users need to login again to get a new token.

To change the expiration time, edit `application.properties`:
```properties
app.jwtExpirationInMs=3600000  # 1 hour
```

## Deployment

### Build JAR for Production

```bash
mvn clean package -DskipTests
```

This creates `target/donation-backend-1.0.0.jar`

### Run JAR with Custom Configuration

```bash
java -jar target/donation-backend-1.0.0.jar \
  --spring.datasource.password=your_password \
  --app.jwtSecret=your_production_secret
```

## Technologies Used

- **Spring Boot 3.2.2** - Web framework
- **Spring Security** - Authentication & Authorization
- **JWT** - JSON Web Tokens for stateless auth
- **Spring Data JPA** - ORM & database access
- **MySQL** - Database
- **Lombok** - Boilerplate reduction
- **Validation API** - Input validation

## License

ISC
