# 🐾 PetRescue - Pet Adoption & Rescue Portal

A full-stack web application connecting loving homes with pets in need. Built with Django REST Framework, MongoDB, React, and Tailwind CSS.

## ✨ Features

### User Features
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Pet Search**: Browse and filter available pets by type, location, and status
- **Report Lost/Found Pets**: Submit reports to help reunite pets with owners
- **User Dashboard**: Manage pet listings and track submitted reports
- **Responsive Design**: Beautiful Tailwind CSS interface that works on all devices

### Admin Features
- **Admin Dashboard**: Review and manage pet reports
- **User Management**: View and manage registered users
- **Report Moderation**: Approve or reject pet reports

## 🛠️ Tech Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework 3.14** - RESTful API
- **MongoDB Atlas** - Cloud database with djongo adapter
- **SimpleJWT** - JWT authentication
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 18.2** - UI library
- **React Router 6.20** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **MongoDB 6.0** - Database server

## 📁 Project Structure

```
PetRescue/
├── backend/                 # Django backend
│   ├── apps/
│   │   ├── users/          # User authentication & management
│   │   ├── pets/           # Pet listings & reports
│   │   ├── matches/        # Adoption matching system
│   │   ├── notifications/  # User notifications
│   │   ├── rescues/        # Rescue organizations
│   │   └── admin_panel/    # Admin functionality
│   ├── petrescue_backend/  # Django settings & config
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                # Environment variables
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React Context providers
│   │   ├── services/       # API service layer
│   │   └── styles/         # CSS files
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env                # Environment variables
│
├── infra/                  # Infrastructure & deployment
│   ├── docker-compose.yml  # Docker orchestration
│   ├── mongo/              # MongoDB initialization
│   └── nginx/              # Nginx configuration
│
├── docs/                   # Documentation
│   ├── API_REFERENCE.md    # API documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── architecture.md     # System architecture
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account OR local MongoDB
- Git

### Option 1: Run with Docker (Recommended)

1. **Clone the repository**
```bash
cd PetRescue
```

2. **Set up environment variables**

Create `backend/.env`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
MONGO_URI=mongodb://admin:adminpassword@mongo:27017/petrescue?authSource=admin
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

3. **Start all services**
```bash
cd infra
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost (via Nginx) or http://localhost:3000
- Backend API: http://localhost:8000/api
- MongoDB: localhost:27017

### Option 2: Run Manually

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv .venv
```

3. **Activate virtual environment**

Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

Linux/Mac:
```bash
source .venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Set up environment variables**

Create `backend/.env`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/petrescue
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

6. **Run migrations**
```bash
python manage.py migrate --fake
```

7. **Create superuser (admin account)**
```bash
python manage.py createsuperuser
```

8. **Start backend server**
```bash
python manage.py runserver 0.0.0.0:8000
```

Backend will be running at http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Start frontend server**
```bash
npm start
```

Frontend will be running at http://localhost:3000

## 📚 API Documentation

Full API documentation is available in [docs/API_REFERENCE.md](docs/API_REFERENCE.md)

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

#### Pets
- `GET /api/pets/all` - List all pets
- `POST /api/pets/create` - Create pet listing
- `GET /api/pets/user/{id}` - Get user's pets
- `PUT /api/pets/update/{id}` - Update pet
- `DELETE /api/pets/delete/{id}` - Delete pet

#### Reports
- `POST /api/pets/report/create` - Submit pet report
- `GET /api/pets/reports` - List all reports
- `GET /api/admin/reports` - Admin: view all reports

## 🔐 Default Admin Credentials

After running `python manage.py createsuperuser`, create your admin account with:
- Email: admin@petrescue.com
- Password: (your chosen password)

## 🌐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=django-secret-key
DEBUG=True
MONGO_URI=mongodb://connection-string
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
SIMPLE_JWT_ACCESS_LIFETIME_MINUTES=15
SIMPLE_JWT_REFRESH_LIFETIME_DAYS=7
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📦 Database Schema

### User Model
- name, email, password (hashed)
- phone, user_type (adopter/rescuer)
- role (user/admin), is_staff, is_verified

### Pet Model
- name, pet_type, breed, color, gender, size, age
- description, status, location, images
- created_by, created_at, updated_at

### PetReport Model
- pet_name, pet_type, description
- location_found, contact_info, image_url
- status (pending/approved/rejected)
- created_by, created_at, updated_at

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python manage.py test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Development Workflow

1. **Start backend server** (port 8000)
2. **Start frontend server** (port 3000)
3. **Make changes** to code
4. **Test locally** before committing
5. **Build for production** using Docker

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### MongoDB Connection Issues
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Frontend Not Loading
- Clear browser cache
- Check console for errors
- Verify REACT_APP_API_URL in .env

## 🚢 Production Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed production deployment instructions.

Quick production build:
```bash
cd infra
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Django & Django REST Framework community
- React & Tailwind CSS teams
- MongoDB for database support
- All contributors and pet rescue organizations

## 📧 Contact

For questions or support:
- Email: support@petrescue.com
- Issues: GitHub Issues page

---

Made with ❤️ for pets in need
