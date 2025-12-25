# Deployment Instructions for PetRescue

## Prerequisites
Before deploying the PetRescue application, ensure you have the following installed:
- Docker
- Docker Compose
- Node.js (for the frontend)

## Backend Deployment

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd PetRescue/backend
   ```

2. **Set Up Environment Variables**
   Copy the `.env.example` file to `.env` and fill in the required environment variables.
   ```bash
   cp .env.example .env
   ```

3. **Build the Docker Image**
   Run the following command to build the Docker image for the backend:
   ```bash
   docker build -t petrescue-backend .
   ```

4. **Run the Docker Container**
   Start the backend service using Docker Compose:
   ```bash
   docker-compose up -d
   ```

5. **Run Migrations**
   After the container is up, run the migrations:
   ```bash
   docker-compose exec web python manage.py migrate
   ```

## Frontend Deployment

1. **Navigate to the Frontend Directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   Install the required npm packages:
   ```bash
   npm install
   ```

3. **Build the Frontend Application**
   Build the production version of the frontend:
   ```bash
   npm run build
   ```

4. **Serve the Frontend**
   You can serve the frontend using a static server or configure it with Nginx. If using Nginx, ensure the `default.conf` is set up to serve the built files.

## Accessing the Application
Once both the backend and frontend are running, you can access the application at:
```
http://localhost:8000 (for backend)
http://localhost:3000 (for frontend)
```

## Stopping the Application
To stop the application, run:
```bash
docker-compose down
```

## Additional Notes
- Ensure MongoDB is running and accessible as configured in your `.env` file.
- For production, consider using a reverse proxy like Nginx for better performance and security.
- Monitor logs for any issues during deployment using:
  ```bash
  docker-compose logs -f
  ```