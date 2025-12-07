# PetRescue - Pet Adoption and Rescue Management System

## Overview
PetRescue is a comprehensive platform designed to facilitate pet adoption and rescue efforts. The application connects potential pet owners with pets in need of homes, while also providing a robust backend for managing users, pets, notifications, and matches.

## Technologies Used
- **Backend**: Django REST Framework with Simple JWT for authentication
- **Database**: MongoDB Atlas
- **Frontend**: React.js with Context API for state management
- **Styling**: Tailwind CSS for responsive design
- **Containerization**: Docker for easy deployment

## Features
- **User Management**: Users can register, log in, and manage their profiles
- **Pet Management**: Users can create, edit, and delete pet listings
- **Pet Reporting**: Report found/lost pets with detailed information
- **Admin Panel**: Admins can manage users, pets, and review pet reports
- **Search and Filter**: Users can search for pets based on type, status, and location
- **User Dashboard**: Personalized dashboard for users to manage their activities and pets
- **JWT Authentication**: Secure email-based authentication with JWT tokens

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nihitha8819/pet_rescue_management_system.git
   cd pet_rescue_management_system
   ```

2. **Backend Setup**
   - Navigate to the `backend` directory
   - Create a virtual environment:
     ```bash
     python -m venv .venv
     .venv\Scripts\activate  # Windows
     source .venv/bin/activate  # Linux/Mac
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Create `.env` file with your MongoDB connection:
     ```
     MONGO_URI=mongodb+srv://your-connection-string
     SECRET_KEY=your-secret-key
     DEBUG=True
     ```
   - Run the server:
     ```bash
     python manage.py runserver 0.0.0.0:8000
     ```

3. **Frontend Setup**
   - Navigate to the `frontend` directory
   - Install dependencies:
     ```bash
     npm install --legacy-peer-deps
     ```
   - Create `.env` file:
     ```
     REACT_APP_API_URL=http://localhost:8000/api
     ```
   - Start the React application:
     ```bash
     npm start
     ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Project Structure
```
PetRescue/
├── backend/              # Django REST API
│   ├── apps/            # Django apps (users, pets, etc.)
│   ├── petrescue_backend/  # Main settings
│   └── requirements.txt
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/      # React pages
│   │   ├── components/ # Reusable components
│   │   ├── contexts/   # Context providers
│   │   └── services/   # API services
│   └── package.json
├── docs/               # Documentation
└── infra/             # Docker & nginx configs
```

## API Endpoints
- `POST /api/auth/signup/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/pets/all/` - List all pets
- `POST /api/pets/create/` - Create pet listing
- `POST /api/pets/report/create/` - Report found/lost pet
- `GET /api/pets/reports/user/<id>/` - Get user's reports

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the open-source community for the tools and libraries that made this project possible
