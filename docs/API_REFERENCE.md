# PetRescue API Documentation

Base URL: `http://localhost:8000/api`

## Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword123",
  "user_type": "adopter"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "user_type": "adopter",
    "role": "user"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### POST /auth/login
Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Pet Endpoints

### POST /pets/create
Create a new pet listing (requires authentication).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Buddy",
  "pet_type": "dog",
  "breed": "Golden Retriever",
  "color": "Golden",
  "gender": "Male",
  "size": "large",
  "age": 3,
  "description": "Friendly and energetic dog",
  "location": "New York, NY",
  "images": ["https://example.com/image1.jpg"]
}
```

### GET /pets/all
Get all pet listings (public).

**Query Parameters:**
- `type` (optional): Filter by pet type (dog, cat, other)
- `status` (optional): Filter by status (available, adopted, pending)

**Response:**
```json
[
  {
    "id": "1",
    "name": "Buddy",
    "pet_type": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "status": "available",
    "location": "New York, NY",
    "created_by": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

### GET /pets/user/{user_id}
Get all pets listed by a specific user (requires authentication).

### GET /pets/{id}
Get detailed information about a specific pet (public).

### PUT /pets/update/{id}
Update a pet listing (requires authentication, owner only).

### DELETE /pets/delete/{id}
Delete a pet listing (requires authentication, owner only).

## Pet Report Endpoints

### POST /pets/report/create
Submit a new pet report (requires authentication).

**Request Body:**
```json
{
  "pet_name": "Unknown",
  "pet_type": "dog",
  "description": "Found wandering near Central Park",
  "location_found": "Central Park, NY",
  "contact_info": "+1234567890",
  "image_url": "https://example.com/found-pet.jpg"
}
```

### GET /pets/reports
Get all pet reports (public).

### GET /pets/reports/user/{user_id}
Get all reports submitted by a specific user (requires authentication).

### PUT /pets/report/update/{id}
Update a pet report status (requires authentication).

## Admin Endpoints

### GET /admin/reports
Get all pet reports for admin review (requires admin authentication).

### GET /users/users
Get all users (requires admin authentication).

## Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "error": "Invalid data provided"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication credentials were not provided"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

## Authentication

Protected endpoints require JWT access token:

```
Authorization: Bearer {access_token}
```

Access tokens expire after 15 minutes.
