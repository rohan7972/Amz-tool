#!/bin/bash

# 🚀 Amazon FDC Tool - Quick Deployment Script
# This script automates the deployment process

set -e

echo "========================================="
echo "🚀 Amazon FDC Tool Deployment"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root${NC}"
   exit 1
fi

# Function to print success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print warning message
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print error message
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    warning "Docker not found. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    success "Docker installed. Please log out and log back in, then run this script again."
    exit 0
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    warning "Docker Compose not found. Installing..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    success "Docker Compose installed"
fi

echo "Step 1: Checking environment files..."
if [ ! -f backend/.env ]; then
    warning "Backend .env not found. Creating from example..."
    cp backend/.env.example backend/.env
    warning "⚠️  IMPORTANT: Please edit backend/.env with your actual values!"
    echo "   - Set strong JWT_SECRET and JWT_REFRESH_SECRET"
    echo "   - Update database password"
    read -p "Press Enter after you've updated backend/.env..."
fi

if [ ! -f frontend/.env ]; then
    warning "Frontend .env not found. Creating from example..."
    cp frontend/.env.example frontend/.env
    warning "⚠️  IMPORTANT: Please edit frontend/.env with your server IP!"
    read -p "Press Enter after you've updated frontend/.env..."
fi

success "Environment files ready"

echo ""
echo "Step 2: Building and starting services..."
docker-compose down
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

success "Services started"

echo ""
echo "Step 3: Running database migrations..."
docker-compose exec -T backend npm run migrate || {
    warning "Migration may have failed, trying again..."
    sleep 5
    docker-compose exec -T backend npm run migrate
}

success "Migrations completed"

echo ""
echo "Step 4: Creating admin user..."
docker-compose exec -T backend npm run seed || {
    warning "Seeding may have failed (admin user might already exist)"
}

success "Database seeded"

echo ""
echo "Step 5: Checking service health..."
sleep 5

# Check if backend is responding
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    success "Backend is healthy"
else
    error "Backend is not responding. Check logs with: docker-compose logs backend"
fi

# Check if frontend is accessible
if docker-compose ps | grep -q "frontend.*Up"; then
    success "Frontend is running"
else
    warning "Frontend may not be running properly"
fi

# Check if database is running
if docker-compose ps | grep -q "postgres.*Up"; then
    success "Database is running"
else
    error "Database is not running"
fi

# Check if redis is running
if docker-compose ps | grep -q "redis.*Up"; then
    success "Redis is running"
else
    warning "Redis is not running"
fi

echo ""
echo "========================================="
echo "🎉 Deployment Complete!"
echo "========================================="
echo ""
echo "Admin Panel Access:"
echo "  URL: http://$(curl -s ifconfig.me 2>/dev/null || echo 'your-server-ip'):3000/admin"
echo "  Email: admin@amazonfdc.com"
echo "  Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change the admin password after first login!"
echo ""
echo "Useful Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart services: docker-compose restart"
echo "  Stop services: docker-compose down"
echo "  Check status: docker-compose ps"
echo ""
echo "To configure Nginx for production:"
echo "  1. Install Nginx: sudo apt install nginx"
echo "  2. Follow DEPLOYMENT_GUIDE.md Step 6"
echo ""

# Show service URLs
echo "Service URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:5000"
echo "  Database: localhost:5435"
echo "  Redis: localhost:6379"
echo "  Adminer: http://localhost:8080"
echo ""

success "All done! 🚀"
