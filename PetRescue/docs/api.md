# PetRescue API Documentation

## Overview
PetRescue is a pet adoption and rescue portal that allows users to manage their pets, connect with potential adopters, and receive notifications about matches. This document outlines the API endpoints available in the PetRescue application.

## Authentication
All endpoints require authentication. Use the following endpoint to obtain a JWT token:

- **POST** `/api/auth/login/`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
  - Response:
    ```json
    {
      "access": "your_access_token",
      "refresh": "your_refresh_token"
    }
    ```

## User Management
### Register User
- **POST** `/api/users/register/`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword",
      "phone": "1234567890"
    }
    ```
  - Response:
    ```json
    {
      "message": "User registered successfully."
    }
    ```

### Get User Profile
- **GET** `/api/users/profile/`
  - Response:
    ```json
    {
      "email": "user@example.com",
      "phone": "1234567890",
      "user_type": "adopter",
      "is_verified": true
    }
    ```

## Pet Management
### Create Pet
- **POST** `/api/pets/`
  - Request Body:
    ```json
    {
      "name": "Buddy",
      "type": "Dog",
      "breed": "Golden Retriever",
      "color": "Golden",
      "gender": "Male",
      "size": "Large",
      "age": 3,
      "description": "Friendly and playful.",
      "status": "Available",
      "location": "New York",
      "images": ["image_url_1", "image_url_2"]
    }
    ```
  - Response:
    ```json
    {
      "message": "Pet created successfully."
    }
    ```

### Get Pet List
- **GET** `/api/pets/`
  - Response:
    ```json
    [
      {
        "id": "pet_id_1",
        "name": "Buddy",
        "type": "Dog",
        "breed": "Golden Retriever",
        "status": "Available"
      },
      {
        "id": "pet_id_2",
        "name": "Mittens",
        "type": "Cat",
        "breed": "Siamese",
        "status": "Adopted"
      }
    ]
    ```

## Match Engine
### Request Match
- **POST** `/api/matches/`
  - Request Body:
    ```json
    {
      "pet": "pet_id_1",
      "requester": "user_id_1",
      "request_type": "adopt"
    }
    ```
  - Response:
    ```json
    {
      "message": "Match request submitted."
    }
    ```

## Notifications
### Get Notifications
- **GET** `/api/notifications/`
  - Response:
    ```json
    [
      {
        "id": "notification_id_1",
        "message": "You have a new match!",
        "is_read": false,
        "created_at": "2023-10-01T12:00:00Z"
      }
    ]
    ```

## Admin Panel
### Manage Users
- **GET** `/api/admin/users/`
  - Response:
    ```json
    [
      {
        "id": "user_id_1",
        "email": "user@example.com",
        "user_type": "adopter",
        "is_verified": true
      }
    ]
    ```

### Manage Pets
- **GET** `/api/admin/pets/`
  - Response:
    ```json
    [
      {
        "id": "pet_id_1",
        "name": "Buddy",
        "status": "Available"
      }
    ]
    ```

## Error Handling
All error responses will follow this format:
```json
{
  "error": "Error message describing what went wrong."
}
```

## Conclusion
This API documentation provides an overview of the endpoints available in the PetRescue application. For further details, please refer to the individual endpoint documentation or the source code.