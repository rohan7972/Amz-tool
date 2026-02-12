# Amazon FDC Tool - Production Deployment Guide

## Prerequisites

Before deploying, ensure your server has:
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ and npm
- PostgreSQL 13+
- Redis 6+
- Git
- PM2 (for process management)

## Step 1: Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install PM2 globally
sudo npm install -g pm2

# Install Git (if not already installed)
sudo apt install git -y
```

## Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE amazon_fdc_tool;
CREATE USER fdc_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE amazon_fdc_tool TO fdc_user;
\q
```

## Step 3: Clone and Setup Application

```bash
# Clone the repository
git clone https://github.com/r2w34/Amazon-FDC-Tool.git
cd Amazon-FDC-Tool

# Checkout the latest feature branch
git checkout feature/update-amazon-fdc-microagent-v2

# Install dependencies
npm install --legacy-peer-deps

# Build the backend
cd backend
npm run build
cd ..
```

## Step 4: Environment Configuration

```bash
# Create production environment file
cp .env.example .env

# Edit the environment file with your production settings
nano .env
```

### Required Environment Variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://your-domain.com

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=fdc_user
DB_PASSWORD=your_secure_password
DB_NAME=amazon_fdc_tool

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Amazon API Configuration (to be configured later)
AMAZON_CLIENT_ID=your_amazon_client_id
AMAZON_CLIENT_SECRET=your_amazon_client_secret
AMAZON_REFRESH_TOKEN=your_amazon_refresh_token

# Logging
LOG_LEVEL=info
```

## Step 5: Database Migration (when ready)

```bash
# Run database migrations (to be implemented)
cd backend
npm run migrate
cd ..
```

## Step 6: Build Frontend

```bash
# Build the frontend for production
cd frontend
npm run build
cd ..
```

## Step 7: PM2 Process Configuration

Create PM2 ecosystem file:

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'amazon-fdc-backend',
      script: './backend/dist/index.js',
      cwd: '/path/to/Amazon-FDC-Tool',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
EOF
```

## Step 8: Start Application

```bash
# Create logs directory
mkdir -p logs

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 9: Nginx Configuration (Optional but Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/amazon-fdc-tool << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/Amazon-FDC-Tool/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/amazon-fdc-tool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 10: SSL Certificate (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Step 11: Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Monitoring and Maintenance

### Check Application Status
```bash
# Check PM2 processes
pm2 status

# View logs
pm2 logs amazon-fdc-backend

# Monitor resources
pm2 monit
```

### Database Backup
```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/amazon-fdc-tool"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U fdc_user amazon_fdc_tool > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup-db.sh

# Add to crontab for daily backups
echo "0 2 * * * /path/to/Amazon-FDC-Tool/backup-db.sh" | crontab -
```

### Update Application
```bash
# Pull latest changes
git pull origin feature/update-amazon-fdc-microagent-v2

# Rebuild and restart
npm install --legacy-peer-deps
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..
pm2 restart amazon-fdc-backend
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3001
   sudo kill -9 <PID>
   ```

2. **Database connection issues**
   ```bash
   sudo systemctl status postgresql
   sudo systemctl restart postgresql
   ```

3. **Redis connection issues**
   ```bash
   sudo systemctl status redis
   sudo systemctl restart redis
   ```

4. **PM2 process crashes**
   ```bash
   pm2 logs amazon-fdc-backend
   pm2 restart amazon-fdc-backend
   ```

### Log Locations
- Application logs: `./logs/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`
- System logs: `journalctl -u amazon-fdc-backend`

## Security Checklist

- [ ] Change default database passwords
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Set up automated backups
- [ ] Configure fail2ban for SSH protection

## Performance Optimization

- [ ] Enable Nginx gzip compression
- [ ] Configure Redis caching
- [ ] Set up database connection pooling
- [ ] Monitor memory usage
- [ ] Configure log rotation

This deployment guide provides a production-ready setup for the Amazon FDC Tool. Follow each step carefully and customize the configuration according to your specific requirements.