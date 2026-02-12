# 🚀 Complete Admin Panel Deployment Guide

## ✅ What's Ready

### Backend API ✅
- ✅ Admin database schema (15+ tables)
- ✅ Admin authentication & authorization
- ✅ User management API (CRUD)
- ✅ Formula engine API (create, execute, track)
- ✅ Settings management API
- ✅ Feature flags API
- ✅ Dashboard metrics & activity APIs
- ✅ Security audit logging
- ✅ All dependencies installed

### Frontend UI ✅
- ✅ Admin layout with sidebar
- ✅ Admin dashboard with metrics
- ✅ User management page (full CRUD)
- ✅ Settings management page
- ✅ Feature flags toggle
- ✅ Responsive design
- ✅ All dependencies installed

### Admin Credentials ✅
```
Email: admin@amazonfdc.com
Password: admin123
```

---

## 📦 Server Requirements

- Ubuntu 20.04+ / Amazon Linux 2
- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Nginx
- Docker & Docker Compose (recommended)

---

## 🔧 Deployment Steps

### Step 1: Connect to Your EC2 Server

```bash
# From your local machine
chmod 400 /workspace/Rohan.pem
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
```

### Step 2: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (if not using Docker)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL (if not using Docker)
sudo apt install -y postgresql postgresql-contrib

# Install Redis (if not using Docker)
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Log out and back in for docker group changes
exit
# SSH back in
ssh -i "/workspace/Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
```

### Step 3: Clone Repository

```bash
cd ~
git clone https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git
cd Amazon-FDC-Tool-amazon-tool-v4
git checkout v5
```

### Step 4: Configure Environment Variables

```bash
# Backend .env
cp backend/.env.example backend/.env
nano backend/.env
```

**Edit these values:**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://13.204.41.42

# Database Configuration
DATABASE_URL=postgresql://postgres:your_secure_password@localhost:5432/amazon_fdc_tool
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amazon_fdc_tool
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Configuration (CHANGE THESE!)
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS_NOW
JWT_REFRESH_SECRET=YOUR_SUPER_SECRET_REFRESH_KEY_CHANGE_THIS_NOW
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

```bash
# Frontend .env
cp frontend/.env.example frontend/.env
nano frontend/.env
```

**Edit:**
```env
VITE_API_URL=http://13.204.41.42:5000/api
VITE_API_BASE_URL=http://13.204.41.42:5000/api
```

### Step 5: Deploy with Docker (Recommended)

```bash
# Start services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

**OR Manual Deployment:**

```bash
# Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE amazon_fdc_tool;
CREATE USER postgres WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE amazon_fdc_tool TO postgres;
\q

# Backend
cd backend
npm install
npm run migrate  # Run database migrations
npm run seed     # Create admin user
npm run build
pm2 start dist/index.js --name amazon-fdc-backend

# Frontend
cd ../frontend
npm install
npm run build

# Serve frontend with Nginx (see Step 6)
```

### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/amazon-fdc
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name 13.204.41.42;

    # Frontend
    location / {
        root /home/ubuntu/Amazon-FDC-Tool-amazon-tool-v4/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/amazon-fdc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Configure Firewall

```bash
# Allow required ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS (for future SSL)
sudo ufw enable
```

**OR in AWS Security Group:**
- SSH (22) - Your IP only
- HTTP (80) - 0.0.0.0/0
- HTTPS (443) - 0.0.0.0/0
- PostgreSQL (5432) - localhost only
- Redis (6379) - localhost only
- Backend (5000) - localhost only

### Step 8: Run Database Migrations & Seeds

```bash
cd ~/Amazon-FDC-Tool-amazon-tool-v4/backend

# Run migrations
npm run migrate

# Run seeds (creates admin user)
npm run seed
```

### Step 9: Test Admin Panel

1. Open browser: `http://13.204.41.42`
2. Click "Login"
3. Enter credentials:
   - Email: `admin@amazonfdc.com`
   - Password: `admin123`
4. Navigate to: `http://13.204.41.42/admin`

---

## 🧪 Testing the Admin Panel

### Test Dashboard
1. Go to `/admin/dashboard`
2. Should see:
   - User statistics
   - API call metrics
   - Formula & rules count
   - Recent activity timeline

### Test User Management
1. Go to `/admin/users`
2. Try:
   - Create new user
   - Edit existing user
   - Search users
   - Filter by role
   - Delete user (not yourself!)

### Test Settings
1. Go to `/admin/settings`
2. Try:
   - View existing settings
   - Create new setting
   - Toggle feature flags

---

## 🔍 Troubleshooting

### Issue: Can't connect to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d amazon_fdc_tool -h localhost

# If connection refused, check pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5
sudo systemctl restart postgresql
```

### Issue: Backend not starting
```bash
# Check logs
docker-compose logs backend
# OR
pm2 logs amazon-fdc-backend

# Check if port 5000 is in use
sudo lsof -i :5000

# Check environment variables
cd backend
cat .env
```

### Issue: Frontend shows "Network Error"
```bash
# Check API URL in frontend/.env
cat frontend/.env

# Should be: VITE_API_URL=http://13.204.41.42:5000/api

# Rebuild frontend
cd frontend
npm run build
```

### Issue: Admin user doesn't exist
```bash
# Recreate admin user
cd backend
npm run seed

# Or manually:
psql -U postgres -d amazon_fdc_tool
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified) 
VALUES ('admin@amazonfdc.com', '$2b$10$...', 'Admin', 'User', 'admin', true, true);
```

### Issue: "Permission denied" errors
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu ~/Amazon-FDC-Tool-amazon-tool-v4

# Fix permissions
chmod +x backend/node_modules/.bin/*
```

---

## 📊 Health Checks

### Backend API Health
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2025-...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Admin API Health
```bash
# Need auth token
TOKEN="your_jwt_token"
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/admin/health
```

### Database Check
```bash
psql -U postgres -d amazon_fdc_tool -c "SELECT COUNT(*) FROM users;"
```

---

## 🔐 Security Best Practices

1. **Change Default Password**
   ```bash
   # After first login, change admin password via UI or:
   psql -U postgres -d amazon_fdc_tool
   UPDATE users SET password_hash = '$2b$10$NEW_HASH' WHERE email = 'admin@amazonfdc.com';
   ```

2. **Use Strong JWT Secrets**
   - Generate random 32+ character strings
   - Never commit to git

3. **Enable SSL/HTTPS**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

4. **Regular Backups**
   ```bash
   # Database backup
   pg_dump -U postgres amazon_fdc_tool > backup_$(date +%Y%m%d).sql
   ```

5. **Update Dependencies**
   ```bash
   npm audit fix
   ```

---

## 📝 Admin Panel Features

### ✅ Working Features
1. **Dashboard**
   - System metrics
   - User statistics
   - API usage tracking
   - Recent activity feed

2. **User Management**
   - Create/Edit/Delete users
   - Role assignment (admin, user, viewer)
   - Search and filter
   - Pagination
   - Activity tracking

3. **Formula Engine**
   - Create mathematical formulas
   - Test formula execution
   - Track usage
   - Version control

4. **Settings Management**
   - System settings CRUD
   - Feature flags
   - Configuration categories
   - Public/private settings

5. **Security**
   - Audit logging
   - Login attempt tracking
   - Role-based access control
   - Session management

---

## 🚀 Next Steps

1. ✅ Deploy to EC2
2. ✅ Test admin login
3. ✅ Verify all admin features
4. ⏳ Set up SSL certificate
5. ⏳ Configure domain name
6. ⏳ Set up automated backups
7. ⏳ Configure monitoring (PM2, CloudWatch)
8. ⏳ Add more admin features as needed

---

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f` or `pm2 logs`
2. Verify environment variables
3. Check database connection
4. Ensure all ports are open
5. Review this guide step by step

---

## ✅ Deployment Checklist

- [ ] EC2 server accessible
- [ ] Docker installed
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Services started (docker-compose up)
- [ ] Database migrations run
- [ ] Admin user created
- [ ] Nginx configured
- [ ] Firewall rules set
- [ ] Admin login works
- [ ] Dashboard loads
- [ ] User management works
- [ ] Settings management works

---

**Status:** Ready for Deployment! 🎉

**Admin Access:**
- URL: `http://13.204.41.42/admin`
- Email: `admin@amazonfdc.com`
- Password: `admin123`

**Remember to change the default password after first login!**
