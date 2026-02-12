# 📖 Manual Deployment Guide - Step by Step

This guide provides detailed manual deployment steps for Amazon FDC Tool on EC2.

## 🎯 Quick Overview

**Server**: 13.204.41.42 (ec2-13-204-41-42.ap-south-1.compute.amazonaws.com)  
**Deployment Method**: Docker Compose  
**Estimated Time**: 30-45 minutes

---

## 📋 Pre-Deployment Checklist

- [ ] PEM file (Rohan.pem) is available
- [ ] SSH access to EC2 server is working
- [ ] Git repository access configured
- [ ] AWS Security Group allows ports 80, 443, 22
- [ ] Amazon API credentials ready (optional, can use sandbox mode)

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Local Machine (5 min)

```bash
# Navigate to the project directory
cd /workspace/Amazon-FDC-Tool-amazon-tool-v4

# Set correct permissions for PEM file (IMPORTANT!)
chmod 400 /workspace/Rohan.pem

# Test SSH connection
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# If connection successful, you'll see Ubuntu prompt. Exit for now:
exit
```

**Expected Output**: Successfully connected to Ubuntu server

---

### Step 2: Connect to EC2 Server (1 min)

```bash
# Connect to server
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# You should now see:
# ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

---

### Step 3: Update System and Install Docker (10 min)

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install -y docker-compose

# Install Git and other utilities
sudo apt install -y git curl wget htop vim

# Clean up
rm get-docker.sh

# IMPORTANT: Logout and login again for docker group to take effect
exit

# Reconnect
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# Verify installations
docker --version
docker-compose --version
git --version
```

**Expected Output**:
```
Docker version 24.x.x
docker-compose version 1.29.x
git version 2.x.x
```

---

### Step 4: Clone Repository (3 min)

```bash
# Create application directory
sudo mkdir -p /opt/amazon-fdc-tool
sudo chown ubuntu:ubuntu /opt/amazon-fdc-tool

# Clone repository
cd /opt/amazon-fdc-tool
git clone -b feature/docker-integration https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git .

# Verify files
ls -la

# You should see: backend, frontend, docker-compose.prod.yml, etc.
```

---

### Step 5: Configure Environment Variables (5 min)

```bash
# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48)

# Save them for your records
echo "DB_PASSWORD: $DB_PASSWORD"
echo "REDIS_PASSWORD: $REDIS_PASSWORD"
echo "JWT_SECRET: $JWT_SECRET"
echo "JWT_REFRESH_SECRET: $JWT_REFRESH_SECRET"

# Create main .env file
cat > .env << EOF
# Database Configuration
DB_USER=amazon_fdc_user
DB_PASSWORD=$DB_PASSWORD
POSTGRES_PASSWORD=$DB_PASSWORD

# Redis Configuration
REDIS_PASSWORD=$REDIS_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

# Amazon API Configuration (Sandbox mode - update with real credentials later)
AMAZON_CLIENT_ID=sandbox_client_id
AMAZON_CLIENT_SECRET=sandbox_client_secret
AMAZON_ADVERTISING_CLIENT_ID=sandbox_ad_client_id
AMAZON_ADVERTISING_CLIENT_SECRET=sandbox_ad_client_secret

# Application URLs
REACT_APP_API_URL=http://13.204.41.42:3001
EOF

# Secure the .env file
chmod 600 .env

# Create backend .env
cat > backend/.env << EOF
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://13.204.41.42

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=amazon_fdc_tool
DB_USER=amazon_fdc_user
DB_PASSWORD=$DB_PASSWORD

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=$REDIS_PASSWORD

# JWT
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Amazon API (Sandbox mode)
AMAZON_SANDBOX_MODE=true
AMAZON_AUTH_URL=https://api.amazon.com/auth/o2/token
AMAZON_API_URL=https://advertising-api.amazon.com
AMAZON_CLIENT_ID=sandbox_client_id
AMAZON_CLIENT_SECRET=sandbox_client_secret
EOF

chmod 600 backend/.env

# Create frontend .env
cat > frontend/.env << EOF
VITE_API_URL=http://13.204.41.42:3001
EOF

chmod 600 frontend/.env
```

---

### Step 6: Configure Nginx (2 min)

```bash
# Create nginx directory
mkdir -p nginx

# Create nginx configuration
cat > nginx/nginx.conf << 'EOF'
upstream frontend {
    server frontend:80;
}

upstream backend {
    server backend:3001;
}

server {
    listen 80;
    server_name _;
    
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

---

### Step 7: Build and Deploy (10 min)

```bash
# Make sure you're in the application directory
cd /opt/amazon-fdc-tool

# Build Docker images (this will take several minutes)
docker-compose -f docker-compose.prod.yml build

# This will build:
# - PostgreSQL container
# - Redis container
# - Backend Node.js container
# - Frontend React container
# - Nginx container

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status (all should be "Up")
docker-compose -f docker-compose.prod.yml ps
```

**Expected Output**:
```
Name                    State    Ports
amazon-fdc-postgres     Up       0.0.0.0:5432->5432/tcp
amazon-fdc-redis        Up       0.0.0.0:6379->6379/tcp
amazon-fdc-backend      Up       0.0.0.0:3001->3001/tcp
amazon-fdc-frontend     Up       0.0.0.0:3000->80/tcp
amazon-fdc-nginx        Up       0.0.0.0:80->80/tcp
```

---

### Step 8: Initialize Database (2 min)

```bash
# Wait for PostgreSQL to be ready
sleep 10

# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres | tail -20

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Optional: Seed test data
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

---

### Step 9: Verify Deployment (3 min)

```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# View logs (look for any errors)
docker-compose -f docker-compose.prod.yml logs --tail=50

# Test backend health endpoint
curl http://localhost:3001/health

# Should return: {"status":"ok"}

# Test frontend
curl http://localhost:3000

# Should return HTML content
```

---

### Step 10: External Access Test (2 min)

From your local machine, open a web browser and navigate to:

1. **Frontend**: http://13.204.41.42
2. **Backend Health**: http://13.204.41.42:3001/health

**Expected**: 
- Frontend should load the React application
- Backend health should return `{"status":"ok"}`

---

## ✅ Post-Deployment Verification

### Check Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```
All containers should show "Up" status.

### Check Logs for Errors
```bash
# All services
docker-compose -f docker-compose.prod.yml logs --tail=100

# Specific service
docker-compose -f docker-compose.prod.yml logs backend --tail=50
docker-compose -f docker-compose.prod.yml logs frontend --tail=50
```

### Test Database Connection
```bash
# Access PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres psql -U amazon_fdc_user -d amazon_fdc_tool

# List tables
\dt

# Exit
\q
```

### Monitor Resources
```bash
# Docker container stats
docker stats

# System resources
htop

# Disk usage
df -h
```

---

## 🔧 Common Issues and Solutions

### Issue 1: Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.prod.yml
```

### Issue 2: Database Connection Failed
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.prod.yml restart postgres

# Wait and try again
sleep 10
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

### Issue 3: Frontend Not Building
```bash
# Check frontend logs
docker-compose -f docker-compose.prod.yml logs frontend

# Rebuild frontend
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d frontend
```

### Issue 4: Out of Memory
```bash
# Check memory
free -h

# Add swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Issue 5: Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker-compose -f docker-compose.prod.yml build --no-cache
```

---

## 📊 Monitoring Commands

### View Real-time Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Container Stats
```bash
docker stats
```

### System Resources
```bash
# CPU and Memory
htop

# Disk space
df -h

# Disk I/O
iostat -x 1
```

---

## 🔄 Update/Restart Application

### Restart All Services
```bash
cd /opt/amazon-fdc-tool
docker-compose -f docker-compose.prod.yml restart
```

### Restart Specific Service
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### Update Application Code
```bash
cd /opt/amazon-fdc-tool
git pull origin feature/docker-integration
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Stop All Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Stop and Remove All Data (DANGEROUS!)
```bash
docker-compose -f docker-compose.prod.yml down -v
```

---

## 💾 Backup Database

### Manual Backup
```bash
# Create backup directory
mkdir -p /opt/backups

# Backup database
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U amazon_fdc_user amazon_fdc_tool > /opt/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# Restore from backup
cat /opt/backups/backup_20231226_120000.sql | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U amazon_fdc_user amazon_fdc_tool
```

---

## 🔐 Security Recommendations

### 1. Configure AWS Security Group
In AWS Console:
- Allow port 22 (SSH) from your IP only
- Allow port 80 (HTTP) from 0.0.0.0/0
- Allow port 443 (HTTPS) from 0.0.0.0/0
- Block all other ports

### 2. Set Up UFW Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 3. Install SSL Certificate (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (requires domain name)
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 4. Regular Updates
```bash
# Update system packages weekly
sudo apt update && sudo apt upgrade -y

# Update Docker images monthly
cd /opt/amazon-fdc-tool
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Getting Help

### Check Documentation
```bash
cd /opt/amazon-fdc-tool
cat README.md
cat DEPLOYMENT_STRATEGY.md
ls docs/
```

### View Application Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Access Container Shell
```bash
# Backend
docker-compose -f docker-compose.prod.yml exec backend bash

# Frontend
docker-compose -f docker-compose.prod.yml exec frontend sh

# Database
docker-compose -f docker-compose.prod.yml exec postgres bash
```

---

## ✅ Success Checklist

- [ ] All Docker containers are running
- [ ] Backend health check returns OK
- [ ] Frontend is accessible from browser
- [ ] Database is initialized with tables
- [ ] No critical errors in logs
- [ ] API endpoints respond correctly
- [ ] Environment variables are configured
- [ ] Firewall rules are set
- [ ] Backup strategy is in place

---

## 🎉 Deployment Complete!

Your Amazon FDC Tool is now deployed and running!

**Access your application:**
- Frontend: http://13.204.41.42
- Backend API: http://13.204.41.42:3001
- Health Check: http://13.204.41.42:3001/health

**Next steps:**
1. Test all functionality
2. Update Amazon API credentials
3. Set up SSL certificate
4. Configure monitoring
5. Set up automated backups
6. Review security settings

---

**Need Help?** Check the logs: `docker-compose -f docker-compose.prod.yml logs -f`

**Last Updated**: December 26, 2025
