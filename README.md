# Pet Rescue Management System

A comprehensive platform to facilitate pet adoption and rescue efforts, connecting potential pet owners with pets in need.

## Features

- **User Management**: Register, login, and manage profiles (Adopter/Rescuer/Admin).
- **Pet Listings**: Browse available pets with filters.
- **Reporting**: Report lost or found pets.
- **Adoption Process**: Request adoption and track status.
- **Admin Dashboard**: Manage users, pets, and reports.
- **Notifications/Chat**: Communication between users and admins.

## Tech Stack

- **Backend**: Django REST Framework
- **Database**: MongoDB (via Djongo)
- **Frontend**: React (Create React App) + Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB

### Backend Setup
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/Mac
   .venv\Scripts\activate     # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` (creates if missing):
   ```
   DEBUG=True
   SECRET_KEY=your_secret_key
   MONGO_URI=mongodb://localhost:27017/petrescue
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```

## API Endpoints
- `/api/auth/` - Authentication
- `/api/pets/` - Pet management
- `/api/users/` - User management
