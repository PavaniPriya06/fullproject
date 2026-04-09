# Spring Boot Backend - Setup and Build Process

## System Requirements

- **Java**: 17 or higher (LTS recommended)
- **Maven**: 3.8.1 or higher
- **MySQL**: 8.0 or higher
- **RAM**: Minimum 512MB, Recommended 2GB+
- **Disk Space**: 500MB for installation and dependencies

## Step-by-Step Setup

### Phase 1: Environment Preparation

#### 1.1 Install Java 17

**Windows:**
```powershell
# Download from Oracle
# Or use Chocolatey
choco install openjdk17

# Verify installation
java -version
```

**macOS:**
```bash
# Using Homebrew
brew install openjdk@17

# Verify
java -version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install openjdk-17-jdk

# Verify
java -version
```

#### 1.2 Install Maven

**Windows:**
```powershell
# Download or use Chocolatey
choco install maven

# Verify
mvn -version
```

**macOS:**
```bash
brew install maven

# Verify
mvn -version
```

**Linux:**
```bash
sudo apt-get install maven

# Verify
mvn -version
```

#### 1.3 Install MySQL 8.0

**Windows:**
- Download from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
- Run installer and follow wizard
- Remember root password

**macOS:**
```bash
brew install mysql@8.0

# Start MySQL
brew services start mysql@8.0

# Verify
mysql --version
```

**Linux:**
```bash
sudo apt-get install mysql-server

# Start MySQL
sudo systemctl start mysql

# Verify
mysql --version
```

### Phase 2: Database Setup

#### 2.1 Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Enter password when prompted

# Then run:
CREATE DATABASE donation_hub;
USE donation_hub;

# Import schema from backend/database/schema.sql
SOURCE /path/to/backend/database/schema.sql;

# Verify
SHOW TABLES;

# Exit
EXIT;
```

#### 2.2 Verify Default Admin User

```bash
mysql -u root -p donation_hub

SELECT id, email, role FROM users WHERE role = 'admin';

# You should see the default admin user
EXIT;
```

### Phase 3: Spring Boot Backend Setup

#### 3.1 Navigate to Backend Directory

```bash
cd spring-boot-backend
```

#### 3.2 Update Configuration

Edit `src/main/resources/application.properties`:

```properties
# Basic server config
server.port=8080

# Database connection
spring.datasource.url=jdbc:mysql://localhost:3306/donation_hub?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate

# JWT Configuration (change in production!)
app.jwtSecret=your_jwt_secret_key_should_be_very_long_minimum_32_chars_recommended

# CORS configuration
app.cors.allowedOrigins=http://localhost:3000,http://localhost:5173

# Logging
logging.level.root=INFO
```

#### 3.3 Verify POM Configuration

Check `pom.xml` includes:
- Spring Boot 3.2.2
- Spring Security
- JWT (jjwt)
- MySQL Connector
- Spring Data JPA

```bash
# View dependencies
mvn dependency:tree
```

### Phase 4: Build Process

#### 4.1 Clean Build

```bash
# Remove previous builds
mvn clean

# Download dependencies
mvn validate

# Compile
mvn compile

# Run tests (optional)
mvn test

# Package
mvn package
```

#### 4.2 Build Summary

```bash
# Single command build
mvn clean install

# Skip tests for faster build
mvn clean install -DskipTests
```

**Expected Output:**
```
BUILD SUCCESS
Total time: X.XXX s
Finished at: YYYY-MM-DD HH:MM:SS
```

### Phase 5: Run Application

#### 5.1 Development Mode

```bash
# Using Maven
mvn spring-boot:run

# Application starts on http://localhost:8080
```

#### 5.2 Production Mode

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/donation-backend-1.0.0.jar

# With custom properties
java -jar target/donation-backend-1.0.0.jar \
  --spring.datasource.password=your_password \
  --server.port=8080
```

#### 5.3 Verify Application Status

**In another terminal:**
```bash
# Health check
curl http://localhost:8080/health

# API info
curl http://localhost:8080/

# Expected response:
# {
#   "success": true,
#   "message": "Server is running",
#   "timestamp": 1712764800000
# }
```

### Phase 6: Test API Endpoints

#### 6.1 Register New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": "u_abc12345",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### 6.2 Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### 6.3 Admin Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@donatehub.com",
    "password": "Admin@123"
  }'
```

## Build Troubleshooting

### Issue: Maven Command Not Found

**Solution:**
```bash
# Add Maven to PATH
# Windows: Set MAVEN_HOME in environment variables
# macOS/Linux: 
export PATH=$PATH:/path/to/maven/bin
```

### Issue: Java Version Mismatch

```bash
# Check current Java version
java -version

# Check Maven's Java version
mvn -version

# They should match (17 or higher)
```

### Issue: MySQL Connection Error

```
Error: Communications link failure
```

**Solution:**
```bash
# Check MySQL is running
mysql -u root -p

# Check connection string in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/donation_hub

# Verify credentials
```

### Issue: Port Already in Use

```
Port 8080 already in use
```

**Solution:**
```bash
# Change port in application.properties
server.port=8081

# Or kill existing process (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or (macOS/Linux)
lsof -i :8080
kill -9 <PID>
```

### Issue: Build Fails with Compilation Errors

```bash
# Clean build cache
mvn clean

# Force download dependencies
mvn clean install -U

# View detailed error
mvn clean install -X
```

## Production Build Checklist

- [ ] Update JWT secret in application.properties
- [ ] Configure production database URL
- [ ] Enable HTTPS/SSL
- [ ] Set appropriate logging levels
- [ ] Update CORS allowed origins
- [ ] Change default admin credentials
- [ ] Configure database backup
- [ ] Set up monitoring/alerts
- [ ] Review security configuration
- [ ] Test all endpoints

## Performance Optimization

### Maven Build Optimization

```bash
# Use parallel builds
mvn -T 1C clean install

# Skip unnecessary tasks
mvn clean install -DskipTests -Dorg.slf4j.simpleLogger.defaultLogLevel=error
```

### Application Performance

Edit `application.properties`:
```properties
# Connection pooling
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5

# JPA/Hibernate
spring.jpa.properties.hibernate.jdbc.batch_size=25
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

## Deployment

### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/donation-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t donation-backend:1.0.0 .
docker run -p 8080:8080 donation-backend:1.0.0
```

## Verification Checklist

After setup, verify:

- [ ] Java 17+ installed: `java -version`
- [ ] Maven 3.8.1+ installed: `mvn -version`
- [ ] MySQL running: `mysql -u root -p`
- [ ] Database created: `USE donation_hub;`
- [ ] Tables created: `SHOW TABLES;`
- [ ] Build successful: `mvn clean install`
- [ ] App runs: `mvn spring-boot:run`
- [ ] Health check passes: `curl http://localhost:8080/health`
- [ ] Can register user: `POST /api/auth/register`
- [ ] Can login: `POST /api/auth/login`

## Next Steps

1. Configure frontend to connect to Spring Boot backend
2. Test all API endpoints
3. Set up logging/monitoring
4. Configure security headers
5. Implement rate limiting
6. Set up automated backups
7. Deploy to production environment

## Support Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Maven Documentation](https://maven.apache.org/guides/index.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
