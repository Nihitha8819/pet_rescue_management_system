# 🚀 PetRescue - Complete Run Instructions

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Running the Application](#running-the-application)
4. [Testing Features](#testing-features)
5. [Stopping the Application](#stopping-the-application)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Required Software
- **Python**: 3.11 or higher
- **Node.js**: 18.x or higher
- **MongoDB**: Atlas account OR local installation
- **Git**: Latest version
- **Docker** (optional): For containerized deployment

### System Resources
- RAM: Minimum 4GB, Recommended 8GB
- Disk Space: Minimum 2GB free
- Ports Required: 3000, 8000, 27017

---

## Initial Setup

### Step 1: MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/petrescue`
4. Whitelist your IP address
5. Create database user with read/write permissions

#### Option B: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Connection string will be: `mongodb://localhost:27017/petrescue`

### Step 2: Backend Setup

```powershell
# Navigate to backend directory
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy and paste content below)
New-Item -Path .env -ItemType File
```

**Backend .env content:**
```env
SECRET_KEY=django-insecure-your-secret-key-here-change-in-production
DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
MONGO_URI=mongodb+srv://Nihitha_8819:Nihitha8819@cluster0.gqrxdoe.mongodb.net/petrescue
MONGO_DB_NAME=petrescue
SIMPLE_JWT_ACCESS_LIFETIME_MINUTES=15
SIMPLE_JWT_REFRESH_LIFETIME_DAYS=7
```

```powershell
# Run database migrations
python manage.py migrate --fake

# Create admin user (follow prompts)
python manage.py createsuperuser
```

### Step 3: Frontend Setup

```powershell
# Open new PowerShell window
# Navigate to frontend directory
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\frontend

# Install dependencies
npm install --legacy-peer-deps

# Create .env file
New-Item -Path .env -ItemType File
```

**Frontend .env content:**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Running the Application

### Method 1: Manual Start (Development)

#### Terminal 1: Start Backend
```powershell
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

**Expected Output:**
```
System check identified no issues (0 silenced).
December 04, 2024 - 10:30:00
Django version 4.2, using settings 'petrescue_backend.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CTRL-BREAK.
```

#### Terminal 2: Start Frontend
```powershell
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view petrescue in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Method 2: Docker Start (Production-like)

```powershell
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\infra
docker-compose up --build
```

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Nginx Proxy**: http://localhost (port 80)
- **MongoDB**: localhost:27017

---

## Testing Features

### 1. Test Backend API

Open browser or Postman and test:

#### Health Check
```
GET http://localhost:8000/api/pets/all/
```
Should return: `[]` (empty array - no pets yet)

#### Create Admin User
```powershell
cd backend
python manage.py createsuperuser

# Enter:
# Name: Admin User
# Email: admin@petrescue.com
# Password: admin123456
```

### 2. Test Frontend

Open browser: http://localhost:3000

**Expected:**
- Beautiful homepage with blue gradient header
- "Welcome to PetRescue" title
- "Get Started" and "Search Pets" buttons
- Feature cards (Search, Report, Adopt)
- Footer with links

### 3. Test User Registration

1. Click "Sign Up" in navigation
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - User Type: Adopt a Pet
   - Password: testpass123
3. Click "Sign up"
4. Should redirect to dashboard

### 4. Test Login

1. Click "Login" in navigation
2. Enter credentials:
   - Email: test@example.com
   - Password: testpass123
3. Click "Sign in"
4. Should see user dashboard

### 5. Test Pet Search

1. Click "Search Pets" in navigation
2. Should see search filters
3. Currently shows "No pets found" (database is empty)

### 6. Test Report Pet

1. Login first
2. Click "Report Pet" in navigation
3. Fill form:
   - Pet Name: Buddy
   - Pet Type: Dog
   - Description: Found near park
   - Location: Central Park
   - Contact: +1234567890
4. Click "Submit Report"
5. Should see success message

### 7. Test Admin Dashboard

1. Login with admin account
2. Click "Admin" in navigation
3. Should see:
   - Total Reports count
   - Pending reports
   - User management table
4. Can approve/reject reports

---

## API Testing with curl

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "user_type": "adopter"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Pets
```bash
curl http://localhost:8000/api/pets/all/
```

### Create Pet Report (requires authentication)
```bash
curl -X POST http://localhost:8000/api/pets/report/create/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "pet_name": "Lost Dog",
    "pet_type": "dog",
    "description": "Brown labrador",
    "location_found": "Main Street",
    "contact_info": "+1234567890"
  }'
```

---

## Stopping the Application

### Manual Stop
- Backend: Press `CTRL+C` in backend terminal
- Frontend: Press `CTRL+C` in frontend terminal

### Docker Stop
```powershell
cd infra
docker-compose down
```

To stop and remove all data:
```powershell
docker-compose down -v
```

---

## Troubleshooting

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::8000`

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID 12345 /F
```

### Issue: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'django'`

**Solution:**
```powershell
# Ensure virtual environment is activated
cd backend
.\.venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: MongoDB Connection Failed

**Error:** `pymongo.errors.ServerSelectionTimeoutError`

**Solution:**
1. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
2. Verify MONGO_URI in backend/.env
3. Ensure database user has correct permissions
4. Check if VPN/firewall blocking connection

### Issue: Frontend Won't Start

**Error:** `npm ERR! code ELIFECYCLE`

**Solution:**
```powershell
cd frontend

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install --legacy-peer-deps

# Start
npm start
```

### Issue: CORS Error in Browser

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check backend/petrescue_backend/settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```
2. Restart backend server

### Issue: JWT Token Invalid

**Error:** `401 Unauthorized`

**Solution:**
1. Token expired - login again
2. Check token in localStorage (browser DevTools > Application > Local Storage)
3. Clear localStorage and login again

---

## Development Tips

### Hot Reload
- **Backend**: Django auto-reloads on file changes
- **Frontend**: React auto-reloads on file changes

### Database Reset
```powershell
# Backend terminal
python manage.py flush
python manage.py migrate --fake
python manage.py createsuperuser
```

### View Logs
```powershell
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Access MongoDB Shell
```powershell
# Docker
docker-compose exec mongo mongosh

# Then:
use petrescue
db.pets.find()
db.users.find()
```

---

## Next Steps

1. ✅ Verify backend running on http://localhost:8000
2. ✅ Verify frontend running on http://localhost:3000
3. ✅ Create admin user
4. ✅ Test user registration
5. ✅ Test login
6. ✅ Test pet search
7. ✅ Test report submission
8. ✅ Test admin dashboard

---

## Quick Reference

### Backend URLs
- API Base: http://localhost:8000/api
- Auth Signup: http://localhost:8000/api/auth/signup/
- Auth Login: http://localhost:8000/api/auth/login/
- Pets List: http://localhost:8000/api/pets/all/
- Admin Reports: http://localhost:8000/api/admin/reports/

### Frontend Routes
- Home: http://localhost:3000/
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Search: http://localhost:3000/search
- Report Pet: http://localhost:3000/report-pet
- Dashboard: http://localhost:3000/dashboard
- Admin: http://localhost:3000/admin

---

## Support

If you encounter issues not covered here:
1. Check console logs (browser DevTools)
2. Check terminal output for errors
3. Review error messages carefully
4. Try restarting both servers
5. Clear browser cache and localStorage

**Happy coding! 🐾**
