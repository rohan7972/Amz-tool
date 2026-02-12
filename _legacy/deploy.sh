#!/bin/bash

# Amazon FDC Tool - Production Deployment Script
# This script deploys the application to a VPS server using Docker

set -e

echo "🚀 Amazon FDC Tool - Production Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PostgreSQL
print_status "Installing PostgreSQL..."
apt install postgresql postgresql-contrib -y

# Install Redis
print_status "Installing Redis..."
apt install redis-server -y

# Install PM2
print_status "Installing PM2..."
npm install -g pm2

# Install Git
print_status "Installing Git..."
apt install git -y

# Install Nginx
print_status "Installing Nginx..."
apt install nginx -y

# Start services
print_status "Starting services..."
systemctl start postgresql
systemctl enable postgresql
systemctl start redis
systemctl enable redis
systemctl start nginx
systemctl enable nginx

# Create application directory
APP_DIR="/opt/amazon-fdc-tool"
print_status "Creating application directory: $APP_DIR"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository
print_status "Cloning Amazon FDC Tool repository..."
if [ -d ".git" ]; then
    print_warning "Repository already exists, pulling latest changes..."
    git pull origin feature/update-amazon-fdc-microagent-v2
else
    git clone https://github.com/r2w34/Amazon-FDC-Tool.git .
    git checkout feature/update-amazon-fdc-microagent-v2
fi

# Setup database
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql << EOF
CREATE DATABASE amazon_fdc_tool;
CREATE USER fdc_user WITH ENCRYPTED PASSWORD 'FDC_SecurePass_2024!';
GRANT ALL PRIVILEGES ON DATABASE amazon_fdc_tool TO fdc_user;
\q
EOF

# Install dependencies
print_status "Installing application dependencies..."
npm install --legacy-peer-deps

# Build backend
print_status "Building backend..."
cd backend
npm run build
cd ..

# Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://$(curl -s ifconfig.me)

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=fdc_user
DB_PASSWORD=FDC_SecurePass_2024!
DB_NAME=amazon_fdc_tool

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
EOF

# Build frontend
print_status "Building frontend..."
cd frontend
npm run build
cd ..

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'amazon-fdc-backend',
      script: './backend/dist/index.js',
      cwd: '$APP_DIR',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Configure Nginx
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/amazon-fdc-tool << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Frontend static files
    location / {
        root $APP_DIR/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable site and disable default
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/amazon-fdc-tool /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Configure firewall
print_status "Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'

# Create backup script
print_status "Creating backup script..."
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/amazon-fdc-tool"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

PGPASSWORD="FDC_SecurePass_2024!" pg_dump -h localhost -U fdc_user amazon_fdc_tool > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup-db.sh

# Add backup to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup-db.sh") | crontab -

# Create update script
print_status "Creating update script..."
cat > update.sh << 'EOF'
#!/bin/bash
cd /opt/amazon-fdc-tool
git pull origin feature/update-amazon-fdc-microagent-v2
npm install --legacy-peer-deps
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..
pm2 restart amazon-fdc-backend
EOF

chmod +x update.sh

# Final status check
print_status "Checking service status..."
sleep 5

if pm2 list | grep -q "amazon-fdc-backend.*online"; then
    print_status "✅ Backend service is running"
else
    print_error "❌ Backend service failed to start"
    pm2 logs amazon-fdc-backend --lines 20
fi

if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx is not running"
fi

if systemctl is-active --quiet postgresql; then
    print_status "✅ PostgreSQL is running"
else
    print_error "❌ PostgreSQL is not running"
fi

if systemctl is-active --quiet redis; then
    print_status "✅ Redis is running"
else
    print_error "❌ Redis is not running"
fi

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

print_status "🎉 Deployment completed!"
echo ""
echo "📋 Deployment Summary:"
echo "  • Application directory: $APP_DIR"
echo "  • Server IP: $SERVER_IP"
echo "  • Frontend URL: http://$SERVER_IP"
echo "  • Backend API: http://$SERVER_IP/api"
echo "  • Health check: http://$SERVER_IP/health"
echo ""
echo "🔧 Management Commands:"
echo "  • Check status: pm2 status"
echo "  • View logs: pm2 logs amazon-fdc-backend"
echo "  • Restart app: pm2 restart amazon-fdc-backend"
echo "  • Update app: $APP_DIR/update.sh"
echo "  • Backup DB: $APP_DIR/backup-db.sh"
echo ""
echo "📁 Important files:"
echo "  • Environment: $APP_DIR/.env"
echo "  • PM2 config: $APP_DIR/ecosystem.config.js"
echo "  • Nginx config: /etc/nginx/sites-available/amazon-fdc-tool"
echo "  • Logs: $APP_DIR/logs/"
echo ""
print_warning "⚠️  Remember to:"
print_warning "   1. Configure your Amazon API credentials in .env"
print_warning "   2. Set up SSL certificate for production"
print_warning "   3. Configure domain name in Nginx"
print_warning "   4. Review and update security settings"