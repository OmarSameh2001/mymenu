# User Management API Documentation

## Overview
Complete Next.js backend MVC system with JWT authentication for both regular users and admins.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file with:
```
MONGODB_URI=mongodb://localhost:27017/mymenu
JWT_SECRET=your-secure-secret-key
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Run Development Server
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
- **Method:** POST
- **URL:** `/api/user/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "type": "user" // optional, defaults to "user"
}
```
- **Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "type": "user"
  },
  "token": "eyJhbGc..."
}
```

#### Login User
- **Method:** POST
- **URL:** `/api/user/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "type": "user"
  },
  "token": "eyJhbGc..."
}
```

### User Operations

#### Get Current User
- **Method:** GET
- **URL:** `/api/user/me`
- **Auth:** Required (Bearer token)
- **Response (200):**
```json
{
  "message": "Current user fetched successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "type": "user",
    "createdAt": "2024-12-08T...",
    "updatedAt": "2024-12-08T..."
  }
}
```

#### Get User by ID
- **Method:** GET
- **URL:** `/api/user/:userId`
- **Auth:** Required (Bearer token)
- **Response (200):**
```json
{
  "message": "User fetched successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "type": "user",
    "createdAt": "2024-12-08T...",
    "updatedAt": "2024-12-08T..."
  }
}
```

#### Update User
- **Method:** PUT
- **URL:** `/api/user/:userId`
- **Auth:** Required (Bearer token)
- **Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```
- **Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "...",
    "email": "newemail@example.com",
    "name": "Updated Name",
    "type": "user"
  }
}
```

### Admin Operations

#### Get All Users (Admin Only)
- **Method:** GET
- **URL:** `/api/user/users`
- **Auth:** Required (Bearer token, Admin only)
- **Response (200):**
```json
{
  "message": "Users fetched successfully",
  "users": [
    {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "type": "user",
      "createdAt": "2024-12-08T...",
      "updatedAt": "2024-12-08T..."
    }
  ]
}
```

#### Change User Type (Admin Only)
- **Method:** PATCH
- **URL:** `/api/user/:userId/type/:newType`
- **Auth:** Required (Bearer token, Admin only)
- **Body:**
```json
{
  "type": "admin"
}
```
- **Response (200):**
```json
{
  "message": "User type updated successfully",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "type": "admin"
  }
}
```

#### Delete User (Admin Only)
- **Method:** DELETE
- **URL:** `/api/user/:userId`
- **Auth:** Required (Bearer token, Admin only)
- **Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Type Access

- **user**: Can access their own profile, update their own data
- **admin**: Can access all users, update any user, change user types, delete users

## Error Responses

### 400 - Bad Request
```json
{
  "error": "Please provide all required fields"
}
```

### 401 - Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 - Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 - Not Found
```json
{
  "error": "User not found"
}
```

### 409 - Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## File Structure

```
app/
├── api/
│   └── user/
│       ├── model.ts        # Mongoose User schema
│       ├── controller.ts    # Business logic
│       └── routes.ts        # API route handlers
├── layout.tsx
├── page.tsx
└── globals.css
lib/
└── db.ts                    # MongoDB connection
middleware/
└── auth.ts                  # JWT authentication middleware
.env.local                   # Environment variables
package.json
tsconfig.json
```

## Notes

- Passwords are hashed using bcryptjs before storing
- JWT tokens expire in 7 days
- All dates are stored in UTC format
- Email validation is enforced at the model level
- Password minimum length is 6 characters
