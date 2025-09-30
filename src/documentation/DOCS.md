# NestJS Employee Management System - Complete Documentation

## Table of Contents

1. [What is NestJS?](#what-is-nestjs)
2. [Project Overview](#project-overview)
3. [Application Architecture](#application-architecture)
4. [Features & Functionality](#features--functionality)
5. [Database Design](#database-design)
6. [API Endpoints](#api-endpoints)
7. [Security & Rate Limiting](#security--rate-limiting)
8. [Logging System](#logging-system)
9. [Error Handling](#error-handling)
10. [How to Run the Application](#how-to-run-the-application)
11. [Project Structure Explained](#project-structure-explained)

---

## What is NestJS?

NestJS is a powerful Node.js framework for building server-side applications. Think of it as a structured way to organize your backend code, similar to how React organizes frontend code but for servers.

**Key Concepts:**

- **Modules**: Like folders that group related functionality together
- **Controllers**: Handle incoming HTTP requests (GET, POST, PUT, DELETE)
- **Services**: Contain business logic and data manipulation
- **Decorators**: Special symbols (starting with @) that add functionality to classes and methods

---

## Project Overview

This is a **Employee Management System** built with NestJS that provides:

- REST API for managing employees and users
- Database integration with PostgreSQL
- Request logging and monitoring
- Security features like CORS and rate limiting
- Input validation and error handling

**Technology Stack:**

- **Backend Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma (database toolkit)
- **Language**: TypeScript
- **Validation**: class-validator
- **Testing**: Jest

---

## Application Architecture

The application follows a **modular architecture** where each feature is organized into its own module:

```
📁 src/
├── 📁 app/              # Main application module
├── 📁 users/            # User management feature
├── 📁 employees/        # Employee management feature
├── 📁 database/         # Database connection service
├── 📁 my-logger/        # Custom logging service
├── 📁 config/           # Configuration files
└── 📄 main.ts          # Application entry point
```

### How Modules Work Together

1. **App Module** - The root module that imports all other modules
2. **Users Module** - Manages user data (stored in memory for demo)
3. **Employees Module** - Manages employee data (stored in database)
4. **Database Module** - Provides database connection to other modules
5. **Logger Module** - Handles application logging

---

## Features & Functionality

### 1. User Management (In-Memory Storage)

- **Create** new users
- **Read** all users or filter by role
- **Update** existing users
- **Delete** users
- Uses mock data stored in memory (resets on restart)

### 2. Employee Management (Database Storage)

- **Create** new employees in database
- **Read** all employees or filter by role
- **Update** existing employees
- **Delete** employees
- Data persists in PostgreSQL database

### 3. Rate Limiting

- Prevents API abuse by limiting requests
- **Short limit**: 3 requests per second
- **Long limit**: 100 requests per minute
- Some endpoints have custom limits

### 4. CORS (Cross-Origin Resource Sharing)

- Controls which websites can access the API
- Currently allows:
  - `http://localhost:3000`
  - `http://localhost:3500`
  - `http://127.0.0.1:5500`
  - `https://www.yoursite.com`

### 5. Request Logging

- Automatically logs all API requests
- Logs are saved to `logs/myLogFile.log`
- Includes timestamp, IP address, and request details

### 6. Input Validation

- Validates all incoming data
- Ensures emails are properly formatted
- Checks that roles are valid (INTERN, ENGINEER, ADMIN)
- Returns clear error messages for invalid data

---

## Database Design

The application uses **Prisma** as an ORM (Object-Relational Mapping) tool to interact with PostgreSQL.

### Employee Table Schema

```sql
TABLE Employee {
  id        INT PRIMARY KEY (auto-increment)
  name      STRING (required)
  email     STRING (unique, required)
  role      ENUM (INTERN, ENGINEER, ADMIN)
  createdAt DATETIME (auto-generated)
  updatedAt DATETIME (auto-updated)
}
```

### Role Types

- **INTERN**: Entry-level employee
- **ENGINEER**: Technical employee
- **ADMIN**: Administrative employee

---

## API Endpoints

### Base URL

```
http://localhost:3000/api
```

### User Endpoints (In-Memory Data)

#### GET /api/users

Get all users or filter by role

```http
GET /api/users
GET /api/users?role=ENGINEER
```

#### GET /api/users/:id

Get a specific user by ID

```http
GET /api/users/1
```

#### POST /api/users

Create a new user

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ENGINEER"
}
```

#### PATCH /api/users/:id

Update an existing user

```http
PATCH /api/users/1
Content-Type: application/json

{
  "name": "John Smith"
}
```

#### DELETE /api/users/:id

Delete a user

```http
DELETE /api/users/1
```

### Employee Endpoints (Database Data)

#### GET /api/employees

Get all employees or filter by role

```http
GET /api/employees
GET /api/employees?role=ADMIN
```

**Rate Limited**: Subject to throttling

#### GET /api/employees/:id

Get a specific employee by ID

```http
GET /api/employees/1
```

**Rate Limited**: 1 request per second

#### POST /api/employees

Create a new employee

```http
POST /api/employees
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "role": "ENGINEER"
}
```

#### PATCH /api/employees/:id

Update an existing employee

```http
PATCH /api/employees/1
Content-Type: application/json

{
  "role": "ADMIN"
}
```

#### DELETE /api/employees/:id

Delete an employee

```http
DELETE /api/employees/1
```

---

## Security & Rate Limiting

### Rate Limiting Configuration

The application uses `@nestjs/throttler` for rate limiting:

```typescript
// Global rate limits
{
  name: 'short',
  ttl: 1000,      // 1 second
  limit: 3,       // 3 requests
},
{
  name: 'long',
  ttl: 60000,     // 1 minute
  limit: 100,     // 100 requests
}
```

### CORS Configuration

Cross-Origin Resource Sharing is configured to allow specific domains:

- Development servers (localhost:3000, localhost:3500)
- Local file server (127.0.0.1:5500)
- Production domain (yoursite.com)

### Input Validation

Using `class-validator` decorators:

- `@IsString()` - Ensures field is a string
- `@IsEmail()` - Validates email format
- `@IsEnum()` - Ensures value is from allowed list
- `@IsNotEmpty()` - Requires field to have a value

---

## Logging System

### Custom Logger Service

The application includes a custom logging service that:

- Extends NestJS's built-in `ConsoleLogger`
- Writes logs to both console and file
- Formats timestamps in Central Time Zone
- Creates log directory if it doesn't exist

### Log File Location

```
📁 logs/
└── 📄 myLogFile.log
```

### Log Format

```
MM/DD/YYYY, HH:MM:SS AM/PM    [Context]    Message
```

Example:

```
9/30/2025, 2:15:30 PM    EmployeesController    Request for ALL Employees    192.168.1.100
```

---

## Error Handling

### Global Exception Filter

The application includes a comprehensive error handling system:

#### Handled Error Types:

1. **HTTP Exceptions** - Standard web errors (404, 400, etc.)
2. **Prisma Validation Errors** - Database validation errors
3. **General Errors** - Unexpected server errors

#### Error Response Format:

```json
{
  "statusCode": 404,
  "timestamp": "2025-09-30T19:15:30.123Z",
  "path": "/api/users/999",
  "response": "User Not Found"
}
```

#### Common Error Codes:

- **400**: Bad Request (invalid input)
- **404**: Not Found (resource doesn't exist)
- **422**: Unprocessable Entity (database validation error)
- **429**: Too Many Requests (rate limit exceeded)
- **500**: Internal Server Error (unexpected error)

---

## How to Run the Application

### Prerequisites

1. **Node.js** (version 16 or higher)
2. **PostgreSQL** database
3. **npm** or **yarn** package manager

### Installation Steps

1. **Install Dependencies**

```bash
npm install
```

2. **Set up Database**

```bash
# Set up your PostgreSQL database
# Create a .env file with DATABASE_URL
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

3. **Run Database Migrations**

```bash
npx prisma migrate dev
```

4. **Generate Prisma Client**

```bash
npx prisma generate
```

5. **Start the Application**

```bash
# Development mode (auto-restart on changes)
npm run start:dev

# Production mode
npm run start:prod
```

### Available Scripts

- `npm run start:dev` - Development mode with auto-reload
- `npm run start:prod` - Production mode
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

---

## Project Structure Explained

### Main Files and Their Purpose

#### `src/main.ts`

- **Purpose**: Application entry point
- **What it does**:
  - Creates the NestJS application
  - Configures global settings (CORS, error filters, API prefix)
  - Starts the server on port 3000

#### `src/app.module.ts`

- **Purpose**: Root module that ties everything together
- **What it does**:
  - Imports all feature modules
  - Configures rate limiting
  - Sets up global guards and providers

#### Module Structure (Users & Employees)

Each feature follows the same pattern:

```
📁 users/
├── 📄 users.module.ts      # Module configuration
├── 📄 users.controller.ts  # HTTP request handlers
├── 📄 users.service.ts     # Business logic
└── 📁 dto/                 # Data Transfer Objects
    ├── 📄 create-user.dto.ts
    └── 📄 update-user.dto.ts
```

### Key Concepts Explained

#### Controllers

Controllers handle HTTP requests and responses:

```typescript
@Controller('users')  // Routes will start with /users
export class UsersController {
  @Get()              // GET /users
  findAll() { ... }

  @Post()             // POST /users
  create() { ... }
}
```

#### Services

Services contain business logic and are injected into controllers:

```typescript
@Injectable()
export class UsersService {
  findAll() {
    // Business logic here
    return this.users;
  }
}
```

#### DTOs (Data Transfer Objects)

DTOs define the shape and validation rules for incoming data:

```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
```

#### Dependency Injection

NestJS automatically provides services to controllers that need them:

```typescript
constructor(private readonly usersService: UsersService) {}
// NestJS automatically creates and injects UsersService
```

---

## Summary

This NestJS application demonstrates:

- **Modular architecture** for organizing code
- **RESTful API design** with proper HTTP methods
- **Database integration** using Prisma ORM
- **Security best practices** (CORS, rate limiting, validation)
- **Professional logging** and error handling
- **Clean separation** between in-memory demo data (users) and persistent data (employees)

The application serves as a solid foundation for building larger, more complex backend systems while maintaining clean, maintainable code structure.
