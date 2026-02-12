# 🚀 Amazon FDC Tool - EC2 Production Deployment Strategy

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Deployment Steps](#deployment-steps)
5. [Configuration](#configuration)
6. [Security](#security)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 📊 Overview

### Server Information
- **IP Address**: 13.204.41.42
- **DNS**: ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
- **Region**: ap-south-1 (Mumbai)
- **OS**: Ubuntu (AWS EC2)
- **SSH Key**: Rohan.pem

### Application Stack
- **Frontend**: React 18 + TypeScript + Mantine UI (Port 3000 → 80)
- **Backend**: Node.js + Express + TypeScript (Port 3001)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis 7 (Port 6379)
- **Proxy**: Nginx (Ports 80, 443)
- **Deployment**: Docker + Docker Compose

### Key Features
- ✅ Dockerized multi-container architecture
- ✅ Production-ready Dockerfiles with health checks
- ✅ PostgreSQL database with migrations
- ✅ Redis caching layer
- ✅ Nginx reverse proxy with SSL support
- ✅ JWT authentication
- ✅ Amazon API integration
- ✅ Multi-channel notifications

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Internet/Users                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   AWS Security Group  │
            │   (Ports 80, 443, 22) │
            └──────────┬───────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │   EC2 Instance (Ubuntu)      │
         │   13.204.41.42               │
         └─────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
    ┌───────────────┐     ┌─────────────┐
    │ Docker Engine │     │   Docker    │
    │               │     │  Network    │
    └───────┬───────┘     └─────────────┘
            │
            ▼
    ┌───────────────────────────────────────┐
    │     Docker Compose Services           │
    ├───────────────────────────────────────┤
    │  ┌─────────────────────────────────┐  │
    │  │  Nginx (Port 80, 443)           │  │
    │  │  - Reverse Proxy                │  │
    │  │  - SSL/TLS Termination          │  │
    │  └──────────┬──────────────────────┘  │
    │             │                          │
    │    ┌────────┴────────┐                │
    │    │                 │                │
    │    ▼                 ▼                │
    │  ┌─────────────┐  ┌──────────────┐   │
    │  │  Frontend   │  │   Backend    │   │
    │  │  (React)    │  │  (Express)   │   │
    │  │  Port 3000  │  │  Port 3001   │   │
    │  └─────────────┘  └──────┬───────┘   │
    │                          │            │
    │                   ┌──────┴──────┐     │
    │                   │             │     │
    │                   ▼             ▼     │
    │              ┌──────────┐  ┌───────┐ │
    │              │PostgreSQL│  │ Redis │ │
    │              │Port 5432 │  │ 6379  │ │
    │              └──────────┘  └───────┘ │
    └───────────────────────────────────────┘
```

---

## ✅ Prerequisites

### Local Machine
- ✅ SSH access with Rohan.pem file
- ✅ Terminal/SSH client
- ✅ Git configured

### EC2 Server Requirements
- Ubuntu 20.04 or 22.04 LTS
- Minimum 2 vCPUs, 4GB RAM (t3.medium or better recommended)
- 20GB+ storage
- Security Group configured:
  - Port 22 (SSH) - Your IP
  - Port 80 (HTTP) - 0.0.0.0/0
  - Port 443 (HTTPS) - 0.0.0.0/0

---

## 🚀 Deployment Steps

### Step 1: Prepare Local Environment

```bash
# Navigate to project directory
cd /workspace/Amazon-FDC-Tool-amazon-tool-v4

# Set correct permissions for PEM file
chmod 400 /workspace/Rohan.pem

# Test SSH connection
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
```

### Step 2: Install Server Dependencies

```bash
# SSH into the server
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose -y

# Install Git
sudo apt install git -y

# Install other utilities
sudo apt install curl wget htop vim -y

# Verify installations
docker --version
docker-compose --version
git --version

# Logout and login again to apply docker group
exit
```

### Step 3: Clone Repository and Setup

```bash
# SSH back into server
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# Create application directory
sudo mkdir -p /opt/amazon-fdc-tool
sudo chown ubuntu:ubuntu /opt/amazon-fdc-tool
cd /opt/amazon-fdc-tool

# Clone repository (you'll need to provide Git credentials or set up SSH key)
git clone https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git .

# Checkout the feature branch
git checkout feature/docker-integration
```

### Step 4: Configure Environment Variables

```bash
# Create production environment file
cat > .env << 'EOF'
# Database Configuration
DB_USER=amazon_fdc_user
DB_PASSWORD=CHANGE_THIS_SECURE_PASSWORD_12345
POSTGRES_PASSWORD=CHANGE_THIS_SECURE_PASSWORD_12345

# Redis Configuration
REDIS_PASSWORD=CHANGE_THIS_REDIS_PASSWORD_12345

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_CHANGE_THIS
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_minimum_32_characters_CHANGE_THIS

# Amazon API Configuration (Sandbox mode for initial testing)
AMAZON_CLIENT_ID=your_amazon_client_id
AMAZON_CLIENT_SECRET=your_amazon_client_secret
AMAZON_ADVERTISING_CLIENT_ID=your_ad_client_id
AMAZON_ADVERTISING_CLIENT_SECRET=your_ad_client_secret

# Application URLs
REACT_APP_API_URL=http://13.204.41.42:3001
EOF

# Secure the .env file
chmod 600 .env

# Create backend environment file
cp backend/.env.example backend/.env

# Update backend .env with production values
nano backend/.env
# Update: DB_HOST=postgres, REDIS_HOST=redis, and other production values

# Create frontend environment file
cat > frontend/.env << 'EOF'
VITE_API_URL=http://13.204.41.42:3001
EOF
```

### Step 5: Create Nginx Configuration

```bash
# Create nginx directory
mkdir -p nginx

# Create nginx configuration file
cat > nginx/nginx.conf << 'EOF'
upstream frontend {
    server frontend:80;
}

upstream backend {
    server backend:3001;
}

server {
    listen 80;
    server_name 13.204.41.42 ec2-13-204-41-42.ap-south-1.compute.amazonaws.com;
    
    client_max_body_size 10M;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://backend;
        access_log off;
    }
}
EOF
```

### Step 6: Build and Deploy with Docker Compose

```bash
# Make sure you're in the project directory
cd /opt/amazon-fdc-tool

# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 7: Initialize Database

```bash
# Wait for PostgreSQL to be ready (check logs)
docker-compose -f docker-compose.prod.yml logs postgres

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Optional: Seed test data
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

### Step 8: Verify Deployment

```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# Test backend health endpoint
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs --tail=50 backend
docker-compose -f docker-compose.prod.yml logs --tail=50 frontend
```

### Step 9: Configure Firewall (if ufw is enabled)

```bash
# Check firewall status
sudo ufw status

# If active, allow necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw reload
```

---

## 🔐 Security Configuration

### 1. Strong Passwords
Generate secure passwords:
```bash
# Generate strong passwords
openssl rand -base64 32  # For DB_PASSWORD
openssl rand -base64 32  # For REDIS_PASSWORD
openssl rand -base64 48  # For JWT_SECRET
openssl rand -base64 48  # For JWT_REFRESH_SECRET
```

### 2. AWS Security Group
Configure in AWS Console:
- SSH (22): Your IP only
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0

### 3. SSL/TLS Certificate (Optional but Recommended)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate (requires domain name)
sudo certbot --nginx -d your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### 4. Regular Updates
```bash
# Set up automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### Monitor Resources
```bash
# Docker stats
docker stats

# System resources
htop

# Disk usage
df -h

# Check container health
docker ps -a
```

### Backup Database
```bash
# Create backup directory
mkdir -p /opt/backups

# Backup PostgreSQL
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U amazon_fdc_user amazon_fdc_db > /opt/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script (add to crontab)
# 0 2 * * * /opt/amazon-fdc-tool/scripts/backup.sh
```

### Update Application
```bash
cd /opt/amazon-fdc-tool

# Pull latest changes
git pull origin feature/docker-integration

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

---

## 🔧 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs service_name

# Inspect container
docker inspect container_name

# Check if port is already in use
sudo netstat -tulpn | grep :3001
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Access PostgreSQL shell
docker-compose -f docker-compose.prod.yml exec postgres psql -U amazon_fdc_user -d amazon_fdc_db

# Test connection from backend
docker-compose -f docker-compose.prod.yml exec backend npm run db:test
```

### Frontend Not Loading
```bash
# Check frontend build
docker-compose -f docker-compose.prod.yml exec frontend ls -la /usr/share/nginx/html

# Check nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Out of Memory
```bash
# Check memory usage
free -h

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Performance Issues
```bash
# Analyze Docker resources
docker stats

# Check system resources
top
iotop
iostat

# Clean up Docker
docker system prune -a --volumes
```

---

## 📝 Quick Reference Commands

### Start/Stop Services
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart a specific service
docker-compose -f docker-compose.prod.yml restart backend

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Access Containers
```bash
# Execute command in container
docker-compose -f docker-compose.prod.yml exec backend bash

# View container logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Copy files to/from container
docker cp file.txt container_name:/path/
docker cp container_name:/path/file.txt ./
```

### Database Operations
```bash
# Access PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U amazon_fdc_user -d amazon_fdc_db

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Rollback migration
docker-compose -f docker-compose.prod.yml exec backend npm run migrate:rollback
```

---

## 🎯 Post-Deployment Checklist

- [ ] All containers are running (docker ps)
- [ ] Database is initialized and migrations ran
- [ ] Backend health check responds (curl http://localhost:3001/health)
- [ ] Frontend is accessible (http://13.204.41.42)
- [ ] API endpoints are responding
- [ ] Logs show no critical errors
- [ ] Environment variables are properly set
- [ ] Security groups/firewall configured
- [ ] SSL certificate installed (if applicable)
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Review documentation in `/docs` directory
3. Check GitHub repository issues
4. Review this deployment guide

---

**Last Updated**: December 26, 2025  
**Deployment Method**: Docker Compose  
**Environment**: Production (EC2)  
**Status**: Ready for Deployment 🚀
