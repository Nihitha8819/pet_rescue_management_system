#!/bin/bash

# Navigate to the backend directory and start the Django development server
cd backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000 &

# Navigate to the frontend directory and start the React development server
cd ../frontend
npm start &

# Wait for both servers to start
wait