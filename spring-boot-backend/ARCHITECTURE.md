# Spring Boot Backend - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT / FRONTEND                       │
│                    (React, Vue, Angular, etc)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                   HTTP/REST (JSON)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   SPRING BOOT APPLICATION                        │
│                      (Port: 8080)                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           SECURITY LAYER (JWT)                          │   │
│  │  ┌────────────────┐  ┌──────────────────────────┐       │   │
│  │  │  JWT Filter    │  │  JWT Token Provider      │       │   │
│  │  │  - Validate    │  │  - Generate tokens       │       │   │
│  │  │  - Extract     │  │  - Validate tokens       │       │   │
│  │  └────────────────┘  └──────────────────────────┘       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          REST CONTROLLERS                                │   │
│  │  ┌─────────────────┬─────────────┬──────────────────┐   │   │
│  │  │  AuthController │  Donation   │  AdminController │   │   │
│  │  │                 │  Controller │                  │   │   │
│  │  │ - register()    │             │ - getPending()   │   │   │
│  │  │ - login()       │ - create()  │ - approve()      │   │   │
│  │  │ - getCurrentUser│ - list()    │ - reject()       │   │   │
│  │  │                 │ - getById() │                  │   │   │
│  │  └─────────────────┴─────────────┴──────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          SERVICE LAYER (Business Logic)                 │   │
│  │  ┌──────────────┐  ┌──────────────┐ ┌──────────────┐   │   │
│  │  │  AuthService │  │DonationServ. │ │UserDetails   │   │   │
│  │  │              │  │              │ │Service       │   │   │
│  │  │ - register() │  │ - create()   │ │              │   │   │
│  │  │ - login()    │  │ - approve()  │ │              │   │   │
│  │  │ - getUser()  │  │ - getList()  │ │              │   │   │
│  │  └──────────────┘  └──────────────┘ └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  REPOSITORY LAYER (Data Access)                         │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┬───────┐  │   │
│  │  │UserRepo  │DonRepo   │FoodRepo  │ApparelR  │MoneyR │  │   │
│  │  │          │          │          │          │       │  │   │
│  │  │JPA based │ Custom   │Inherits  │Inherits  │Inherits  │   │
│  │  └──────────┴──────────┴──────────┴──────────┴───────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  EXCEPTION HANDLING                                      │   │
│  │  ├─ GlobalExceptionHandler                              │   │
│  │  ├─ ResourceNotFoundException                           │   │
│  │  └─ ResourceAlreadyExistsException                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                      JPA/Hibernate
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    DATABASE LAYER (MySQL)                        │
│                  Port: 3306 (default)                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐         │
│  │  users      │  │ donations    │  │food_donations  │         │
│  ├─────────────┤  ├──────────────┤  ├────────────────┤         │
│  │ id (PK)     │  │ id (PK)      │  │ id (PK)        │         │
│  │ email (UQ)  │  │ user_id (FK) │  │ donation_id(FK)│         │
│  │ password    │  │ type         │  │ rice_qty       │         │
│  │ full_name   │  │ status       │  │ veg_qty        │         │
│  │ role        │  │ trust_id     │  │ fruits_qty     │         │
│  │ ...         │  │ ...          │  │ ...            │         │
│  └─────────────┘  └──────────────┘  └────────────────┘         │
│                                                                  │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │apparel_donatio │  │money_donation│  │notifications    │    │
│  ├────────────────┤  ├──────────────┤  ├─────────────────┤    │
│  │ id (PK)        │  │ id (PK)      │  │ id (PK)         │    │
│  │ donation_id(FK)│  │ donation_id(FK  │ user_id (FK)    │    │
│  │ target_age     │  │ transaction_id  │ donation_id(FK) │    │
│  │ ...            │  │ amount          │ message         │    │
│  │                │  │ ...             │ type            │    │
│  └────────────────┘  └──────────────┘  └─────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

```
CLIENT REQUEST
      │
      ▼
┌─────────────────────────┐
│  HTTP Request received  │
│  (with JWT token)       │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  JwtAuthenticationFilter        │
│  1. Extract token from header   │
│  2. Validate token              │
│  3. Set authentication context  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Security Manager               │
│  Check authorization            │
│  (Role-based access control)    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Route to appropriate Controller│
│  (AuthController,               │
│   DonationController,           │
│   AdminController)              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Validate Request DTOs          │
│  @Valid on request body         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Call Service Layer             │
│  Execute business logic         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Access Database                │
│  Use repositories               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Build Response DTO             │
│  (Success or Error message)     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  HTTP Response                  │
│  (JSON with status code)        │
└─────────────────────────────────┘
      │
      ▼
   CLIENT
```

## Entity Relationship Diagram

```
┌──────────────────────────────────┐
│          USERS                   │
├──────────────────────────────────┤
│ id (PK) ──┐                   │
│ email     │                   │
│ password  │                   │
│ role      │                   │
│ ...       │                   │
└──────────┬───────────────────┘
           │
           │ 1:N (User can have multiple donations)
           │
           ▼
┌──────────────────────────────────┐
│       DONATIONS                  │
├──────────────────────────────────┤
│ id (PK)                          │
│ user_id (FK) ──┐              │
│ type           │              │
│ status         │              │
│ ...            │              │
└──────────┬──────┬──────┬──────┘
           │      │      │
    type=FOOD │   │type=MONEY │  type=APPAREL
           │      │      │
    ┌─────▼──┐ ┌──▼──┐ ┌──▼─────┐
    │ FOOD   │ │MONEY│ │APPAREL │
    │DONATIONS│ │DONA │ │DONATIONS
    │        │ │TIONS│ │        │
    │- rice_ │ │  - │ │- target│
    │  qty   │ │trans│ │  _age  │
    │- veg_  │ │ action_id     │
    │  qty   │ │  - amount     │
    └────────┘ └──────┘ └────────┘
```

## Database Schema Relationships

```
Users (1)
  │
  ├──(1:N)──► Donations
  │             │
  │             ├──► FoodDonations (if type='food')
  │             ├──► ApparelDonations (if type='apparel')
  │             └──► MoneyDonations (if type='money')
  │
  └──(1:N)──► Notifications
                 │
                 └──(N:1)──► Donations
```

## Data Flow for Creating a Donation

```
1. USER CREATES DONATION
   │
   ├─ POST /api/donations
   ├─ Authorization: Bearer JWT
   └─ Body: { type, quantity, etc }
        │
        ▼
2. DONATION CONTROLLER
   ├─ Receives request
   ├─ Validates user is authenticated
   └─ Calls DonationService
        │
        ▼
3. DONATION SERVICE
   ├─ Creates Donation entity
   ├─ Creates type-specific entity (Food/Apparel/Money)
   ├─ Updates User statistics (total_donated, donations_count)
   └─ Saves all to database
        │
        ▼
4. DATABASE
   ├─ INSERT into donations table
   ├─ INSERT into food_donations/apparel_donations/money_donations
   └─ UPDATE users table
        │
        ▼
5. RESPONSE TO CLIENT
   ├─ 201 Created
   └─ { success: true, data: DonationResponse }
```

## Authentication Flow

```
1. USER REGISTRATION/LOGIN
   ├─ POST /api/auth/register or /api/auth/login
   ├─ Provide email & password
        │
        ▼
   ├─ VALIDATE CREDENTIALS
   ├─ Hash password (BCrypt)
   ├─ Find or create user
        │
        ▼
   ├─ JWT TOKEN GENERATION
   ├─ Claims: userId, email
   ├─ Expiration: 24 hours
   ├─ Algorithm: HS512
        │
        ▼
   └─ RETURN TOKEN TO CLIENT

2. SUBSEQUENT REQUESTS
   ├─ Include: Authorization: Bearer {JWT_TOKEN}
        │
        ▼
   ├─ JwtAuthenticationFilter
   ├─ Extract token from header
   ├─ Validate signature & expiration
   ├─ Load user from database
        │
        ▼
   ├─ SET AUTHENTICATION CONTEXT
   ├─ User & authorities available to endpoint
        │
        ▼
   └─ PROCEED WITH REQUEST
```

## Security Layers

```
┌─────────────────────────────────────────┐
│ CORS Filter                             │
│ - Allows/denies cross-origin requests  │
└─────────────────────────────┬───────────┘
                              │
┌─────────────────────────────▼───────────┐
│ JWT Authentication Filter               │
│ - Validates JWT token                  │
│ - Extracts user information            │
│ - Sets security context                │
└─────────────────────────────┬───────────┘
                              │
┌─────────────────────────────▼───────────┐
│ Authorization Filter                    │
│ - Checks role-based permissions        │
│ - Validates @PreAuthorize annotations  │
└─────────────────────────────┬───────────┘
                              │
┌─────────────────────────────▼───────────┐
│ Input Validation                        │
│ - @Valid on DTOs                       │
│ - Custom validators                    │
└─────────────────────────────┬───────────┘
                              │
┌─────────────────────────────▼───────────┐
│ Business Logic                          │
│ - Services enforce rules                │
│ - Database constraints                 │
└─────────────────────────────┬───────────┘
                              │
┌─────────────────────────────▼───────────┐
│ Response Serialization                  │
│ - DTOs with sensitive data hidden      │
│ - Proper HTTP status codes             │
└─────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌──────────────────────────────────────────────┐
│   Presentation Layer                         │
│   ├─ REST Controllers                       │
│   ├─ Request/Response DTOs                  │
│   └─ HTTP Status Codes                      │
├──────────────────────────────────────────────┤
│   Business Logic Layer                       │
│   ├─ Services                               │
│   ├─ Domain Logic                           │
│   └─ Security Authorization                │
├──────────────────────────────────────────────┤
│   Persistence Layer                          │
│   ├─ Spring Data JPA Repositories           │
│   ├─ Entity Classes                         │
│   └─ ORM (Hibernate)                        │
├──────────────────────────────────────────────┤
│   Data Layer                                 │
│   ├─ MySQL Database                         │
│   ├─ Tables & Indexes                       │
│   └─ Relationships & Constraints            │
└──────────────────────────────────────────────┘
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Scalability
✅ Maintainability
✅ Security
✅ Performance
✅ Testability
