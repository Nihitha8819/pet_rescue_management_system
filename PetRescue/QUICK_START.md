# 🚀 PetRescue - Quick Start Card

## ⚡ Instant Start (Copy-Paste Ready)

### Backend Terminal
```powershell
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

### Frontend Terminal  
```powershell
cd C:\Users\girin\OneDrive\Attachments\Desktop\pet_rescue_system\PetRescue\frontend
npm start
```

## 🌐 Access URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000/api
- **Admin**: http://localhost:3000/admin

## 🔐 Test Credentials
Create with: `python manage.py createsuperuser`
- **Email**: admin@petrescue.com
- **Password**: (your choice)

## 📋 Test Workflow
1. ✅ Register: http://localhost:3000/signup
2. ✅ Login: http://localhost:3000/login
3. ✅ Search Pets: http://localhost:3000/search
4. ✅ Report Pet: http://localhost:3000/report-pet
5. ✅ Dashboard: http://localhost:3000/dashboard
6. ✅ Admin Panel: http://localhost:3000/admin

## 🔧 Common Commands

### Stop Servers
- **Ctrl+C** in each terminal

### Reset Database
```powershell
python manage.py flush
python manage.py migrate --fake
```

### Clear Frontend Cache
```powershell
Remove-Item -Recurse node_modules
npm install --legacy-peer-deps
```

### View Errors
- **Backend**: Check terminal output
- **Frontend**: Browser DevTools Console (F12)

## 📦 Key Files Modified

### Backend ✅
- `apps/users/models.py` - User with name & role
- `apps/pets/models.py` - Pet + PetReport
- `apps/users/views.py` - Auth endpoints
- `apps/pets/views.py` - CRUD + Reports
- `petrescue_backend/urls.py` - Routes

### Frontend ✅
- `pages/Login.jsx` - Login page
- `pages/Signup.jsx` - Registration
- `pages/SearchPets.jsx` - Pet search
- `pages/ReportPet.jsx` - Report form
- `pages/UserDashboard.jsx` - User panel
- `pages/AdminDashboard.jsx` - Admin panel
- `contexts/AuthContext.jsx` - Auth logic
- `App.jsx` - All routes

## 🐛 Quick Fixes

### Port In Use
```powershell
netstat -ano | findstr :8000
taskkill /PID <number> /F
```

### Module Not Found
```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### MongoDB Connection
Check `backend/.env`:
```env
MONGO_URI=mongodb+srv://Nihitha_8819:Nihitha8819@cluster0.gqrxdoe.mongodb.net/petrescue
```

## 📚 Documentation
- **README_COMPLETE.md** - Full documentation
- **RUN_INSTRUCTIONS.md** - Detailed guide
- **API_REFERENCE.md** - API docs
- **PROJECT_STRUCTURE.md** - File structure

## ✨ Features Implemented
✅ User Registration & Login (JWT)  
✅ Pet Search with Filters  
✅ Report Lost/Found Pets  
✅ User Dashboard  
✅ Admin Panel  
✅ Responsive Design (Tailwind)  
✅ MongoDB Integration  
✅ Docker Ready  

## 📞 Support
Check terminal logs for errors!

---
**Project: PetRescue v1.0**  
**Stack**: Django REST + MongoDB + React + Tailwind  
**Status**: ✅ COMPLETE
