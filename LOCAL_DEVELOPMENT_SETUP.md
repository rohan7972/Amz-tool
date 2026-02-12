# 🚀 Local Development Setup Guide

## ✅ Google Authentication Removed

Google OAuth has been successfully removed from the project. The application now uses only email/password authentication.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ installed
- **PostgreSQL** 14+ installed and running
- **Redis** 6+ installed and running
- **Git** installed

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Set Up PostgreSQL Database

```bash
# Create database (using psql or pgAdmin)
createdb amazon_fdc_tool

# Or using psql:
psql -U postgres
CREATE DATABASE amazon_fdc_tool;
\q
```

### 3. Set Up Environment Variables

#### Backend Environment (.env)

Create `backend/.env` file:

```env
# Backend Environment Variables - Local Development
NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/amazon_fdc_tool
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amazon_fdc_tool
DB_USER=postgres
DB_PASSWORD=password

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=dev-jwt-secret-change-in-production-12345678
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-12345678
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Amazon SP-API Configuration (Sandbox Mode)
SP_API_LWA_APP_ID=amzn1.sp.solution.6f799d42-aed0-4003-af24-262ffef91f01
SP_API_LWA_CLIENT_SECRET=Atzr|IwEBIFcEsj9o7w-q-XZPslQQ80cfbEIm7Jx1
AMAZON_SANDBOX_MODE=true
SP_API_REGION=us-east-1

# Logging
LOG_LEVEL=debug
```

#### Frontend Environment (.env)

Create `frontend/.env` file:

```env
# Frontend Environment Variables - Local Development
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=Amazon FDC Tool
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

### 4. Run Database Migrations

```bash
cd backend
npm run migrate
cd ..
```

### 5. Start Services

#### Option A: Using Docker (Recommended)

```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option B: Manual Start (Without Docker)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔐 Login Credentials

### Admin Login
- URL: http://localhost:3000/adminmanager
- Email: admin@amazonfdc.com
- Password: admin123

### User Registration
- URL: http://localhost:3000/register
- Create a new user account

## 📊 Access Points

After starting the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **Admin Panel**: http://localhost:3000/adminmanager
- **Adminer (DB UI)**: http://localhost:8080 (if using Docker)

## 🐛 Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
# Windows:
Get-Service postgresql*

# Start PostgreSQL if not running
# Windows (as Administrator):
Start-Service postgresql-x64-14
```

### Redis Connection Issues

```bash
# Check if Redis is running
# Windows:
Get-Service redis*

# Start Redis if not running
redis-server
```

### Port Already in Use

```bash
# Find process using port 3000 or 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Migration Errors

```bash
# Reset database
cd backend
npm run migrate:rollback
npm run migrate
```

## 📝 Development Workflow

### Daily Development

```bash
# 1. Start Docker services (if using Docker)
docker-compose up -d

# 2. Or start manually
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# 3. Make changes (hot reload enabled)

# 4. Stop when done
docker-compose down  # if using Docker
# Or Ctrl+C in terminals
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Operations

```bash
# Create new migration
cd backend
npm run migrate:make migration_name

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Access database
psql -U postgres -d amazon_fdc_tool
```

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Set up environment variables
3. ✅ Start PostgreSQL and Redis
4. ✅ Run database migrations
5. ✅ Start the application
6. ✅ Login with admin credentials
7. ✅ Start development!

## 📚 Additional Resources

- **Project Analysis**: See `PROJECT_ANALYSIS_AND_RECOMMENDATIONS.md`
- **Docker Guide**: See `DOCKER_QUICK_REFERENCE.md`
- **Architecture**: See `SYSTEM_ARCHITECTURE_VISUAL.md`

---

**Need help?** Check the troubleshooting section or review the documentation files.

**Ready to start?** Run the commands in order and you'll be up and running in minutes!
