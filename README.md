# Authentication and Comment Permission Service

A Node.js backend service that handles user authentication, authorization, session management, and comment-level access control using role-based permissions.

## Features

- **User Authentication**: Signup, login, logout with JWT tokens
- **Token Management**: Access tokens (short-lived) and refresh tokens (longer-lived)
- **Password Security**: Bcrypt hashing and password reset functionality
- **Permission System**: Role-based access control (read, write, delete)
- **Comment System**: CRUD operations with permission-based access
- **Session Management**: Secure token refresh and invalidation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure(build this with help of perplexity readme.md)

```
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   └── commentController.js # Comment operations
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── permissions.js      # Permission checks
│   └── validation.js       # Input validation
├── models/
│   ├── User.js             # User schema
│   ├── Comment.js          # Comment schema
│   └── RefreshToken.js     # Refresh token schema
├── routes/
│   ├── auth.js             # Auth routes
│   ├── users.js            # User routes
│   └── comments.js         # Comment routes
├── utils/
│   └── jwt.js              # JWT utilities
├── server.js               # Main server file
├── package.json            # Dependencies
└── env.example             # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinay02022/testinBackend
   cd auth-comment-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env file with your configuration
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file with the following variables:
   ```env
  PORT=3000 
MONGODB_URI=mongodb+srv://vinay123:vinay321@cluster0.mongodb.net/auth-comment-service?retryWrites=true&w=majority 
JWT_ACCESS_SECRET=auth_comment_service_access_secret_2024_production_ready_key_12345  
JWT_REFRESH_SECRET=auth_comment_service_refresh_secret_2024_production_ready_key_67890  
JWT_ACCESS_EXPIRES_IN=15m  
JWT_REFRESH_EXPIRES_IN=7d  
RESET_TOKEN_EXPIRES_IN=1h  
NODE_ENV=development 

   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

6. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. User Signup
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "permissions": ["read"]
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "refresh_token"
  }
}
```

#### 2. User Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### 3. Logout
```http
POST /api/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

#### 4. Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

#### 5. Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### 6. Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_forgot_password",
  "newPassword": "NewPassword123"
}
```

### User Management Endpoints

#### 1. Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

#### 2. Update User Permissions
```http
PUT /api/users/:id/permissions
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "permissions": ["read", "write", "delete"]
}
```

### Comment Endpoints

#### 1. Get All Comments (Read Permission Required)
```http
GET /api/comments
Authorization: Bearer <access_token>
```

#### 2. Create Comment (Write Permission Required)
```http
POST /api/comments
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "content": "This is a comment"
}
```

#### 3. Delete Comment (Delete Permission Required)
```http
DELETE /api/comments/:id
Authorization: Bearer <access_token>
```

## Permission System

Users can have any combination of the following permissions:

- **read**: View comments
- **write**: Create new comments
- **delete**: Delete any comment (global delete rights)

Default permission for new users: `["read"]`

## Example cURL Commands

### 1. User Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### 3. Get Comments (with token)
```bash
curl -X GET http://localhost:3000/api/comments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Create Comment
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "content": "This is my first comment!"
  }'
```

### 5. Update User Permissions
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "permissions": ["read", "write", "delete"]
  }'
```

### 6. Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### 7. Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN_FROM_FORGOT_PASSWORD",
    "newPassword": "NewPassword123"
  }'
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  permissions: [String], // ['read', 'write', 'delete']
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  timestamps: true
}
```

### Comment Model
```javascript
{
  content: String,
  author: ObjectId (ref: User),
  timestamps: true
}
```

### RefreshToken Model
```javascript
{
  token: String (unique),
  user: ObjectId (ref: User),
  expiresAt: Date,
  timestamps: true
}
```

## Testing the API

1. Start the server: `npm run dev`
2. Use the provided cURL commands or import into Postman
3. Test the complete flow:
   - Signup → Login → Get Profile → Create Comment → View Comments

## Development

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (to be implemented)

### Adding New Features

1. Create new models in `models/`
2. Add controllers in `controllers/`
3. Create middleware if needed in `middleware/`
4. Define routes in `routes/`
5. Update server.js to include new routes