# PetRescue - Pet Adoption and Rescue Portal

## Overview
PetRescue is a comprehensive platform designed to facilitate pet adoption and rescue efforts. The application connects potential pet owners with pets in need of homes, while also providing a robust backend for managing users, pets, notifications, and matches.

## Technologies Used
- **Backend**: Django REST Framework with Simple JWT for authentication
- **Database**: MongoDB
- **Frontend**: React.js with Context API for state management
- **Styling**: Tailwind CSS for responsive design
- **Containerization**: Docker for easy deployment

## Features
- **User Management**: Users can register, log in, and manage their profiles.
- **Pet Management**: Users can create, edit, and delete pet listings.
- **Admin Panel**: Admins can manage users, pets, and view statistics.
- **Search and Match Engine**: Users can search for pets based on various criteria and receive match suggestions.
- **Notification System**: Users receive notifications for important updates and messages.
- **User Dashboard**: A personalized dashboard for users to manage their activities and pets.

## Getting Started

### Prerequisites
- Python 3.x
- Node.js
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd PetRescue
   ```

2. **Backend Setup**
   - Navigate to the `backend` directory.
   - Create a virtual environment and activate it.
   - Install dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Set up environment variables by copying `.env.example` to `.env` and configuring it.
   - Run migrations and start the server:
     ```
     python manage.py migrate
     python manage.py runserver
     ```

3. **Frontend Setup**
   - Navigate to the `frontend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Start the React application:
     ```
     npm start
     ```

4. **Docker Setup (Optional)**
   - Use the provided `docker-compose.yml` to run the application in containers:
     ```
     docker-compose up
     ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the open-source community for the tools and libraries that made this project possible.