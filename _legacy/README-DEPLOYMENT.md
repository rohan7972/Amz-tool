# Amazon FDC Tool - Production Deployment Guide

This guide provides comprehensive instructions for deploying the Amazon FDC Tool to a production VPS server using Docker.

## 🚀 Quick Start

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- 4GB+ RAM recommended
- 20GB+ disk space
- Domain name (optional, for SSL)
- Non-root user with sudo privileges

### One-Command Deployment
```bash
# Clone the repository
git clone https://github.com/r2w34/Amazon-FDC-Tool.git
cd Amazon-FDC-Tool

# Make deployment script executable
chmod +x deploy-docker.sh

# Run deployment
./deploy-docker.sh
```

## 📋 Detailed Setup Instructions

### 1. Server Preparation

#### Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip
```

#### Create Application User (Recommended)
```bash
sudo adduser amazon-fdc
sudo usermod -aG sudo amazon-fdc
su - amazon-fdc
```

### 2. Clone Repository
```bash
git clone https://github.com/r2w34/Amazon-FDC-Tool.git
cd Amazon-FDC-Tool
```

### 3. Configure Environment

#### Copy Environment Template
```bash
cp .env.production .env.production.local
```

#### Edit Environment Variables
```bash
nano .env.production.local
```

**Required Configuration:**
```env
# Database Configuration
POSTGRES_DB=amazon_fdc_db
POSTGRES_USER=amazon_fdc_user
POSTGRES_PASSWORD=your_secure_password_here

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Amazon API Configuration
AMAZON_CLIENT_ID=your_amazon_client_id
AMAZON_CLIENT_SECRET=your_amazon_client_secret
AMAZON_REFRESH_TOKEN=your_amazon_refresh_token

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost
API_URL=http://localhost/api
```

### 4. Deploy Application
```bash
./deploy-docker.sh
```

## 🔧 Deployment Script Commands

The deployment script supports multiple commands:

```bash
# Deploy application (default)
./deploy-docker.sh deploy

# Stop application
./deploy-docker.sh stop

# Restart application
./deploy-docker.sh restart

# View logs
./deploy-docker.sh logs

# Check status
./deploy-docker.sh status

# Create backup
./deploy-docker.sh backup

# Run health checks
./deploy-docker.sh health
```

## 🏗️ Architecture Overview

### Docker Services
- **Frontend**: Nginx serving React application
- **Backend**: Node.js API server
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx (handles routing and SSL)

### Port Configuration
- **80**: HTTP (Nginx reverse proxy)
- **443**: HTTPS (when SSL configured)
- **3001**: Backend API (internal)
- **5432**: PostgreSQL (internal)
- **6379**: Redis (internal)

### Data Persistence
- PostgreSQL data: `./data/postgres`
- Redis data: `./data/redis`
- Application logs: `./logs`
- Backups: `./backups`

## 🔒 Security Configuration

### SSL/HTTPS Setup (Recommended)

#### Using Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop application temporarily
./deploy-docker.sh stop

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com

# Update nginx configuration for SSL
# Edit frontend/nginx.conf to include SSL settings

# Restart application
./deploy-docker.sh deploy
```

#### Manual SSL Certificate
1. Place certificate files in `ssl/` directory
2. Update `frontend/nginx.conf` with SSL configuration
3. Redeploy application

### Firewall Configuration
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

## 📊 Monitoring and Maintenance

### View Application Logs
```bash
# All services
./deploy-docker.sh logs

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Monitor Resource Usage
```bash
# Container stats
docker stats

# System resources
htop
df -h
```

### Database Backup
```bash
# Manual backup
./deploy-docker.sh backup

# Automated backup (add to crontab)
0 2 * * * /path/to/Amazon-FDC-Tool/deploy-docker.sh backup
```

### Health Checks
```bash
# Run health checks
./deploy-docker.sh health

# Manual health check
curl http://localhost/api/health
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Redeploy
./deploy-docker.sh deploy
```

### Database Migration
```bash
# Access database container
docker-compose -f docker-compose.prod.yml exec postgres psql -U amazon_fdc_user -d amazon_fdc_db

# Run migrations (if needed)
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

### Restore from Backup
```bash
# Stop application
./deploy-docker.sh stop

# Restore database
docker-compose -f docker-compose.prod.yml up -d postgres
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U amazon_fdc_user -d amazon_fdc_db < backups/backup_YYYYMMDD_HHMMSS.sql

# Start application
./deploy-docker.sh deploy
```

## 🐛 Troubleshooting

### Common Issues

#### Containers Won't Start
```bash
# Check logs
./deploy-docker.sh logs

# Check disk space
df -h

# Check memory usage
free -h
```

#### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Verify environment variables
docker-compose -f docker-compose.prod.yml exec backend env | grep POSTGRES
```

#### Permission Issues
```bash
# Fix data directory permissions
sudo chown -R $USER:$USER data/
```

#### Port Conflicts
```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80

# Stop conflicting services
sudo systemctl stop apache2  # if Apache is running
sudo systemctl stop nginx    # if system Nginx is running
```

### Performance Optimization

#### Increase Container Resources
Edit `docker-compose.prod.yml` to add resource limits:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

#### Database Optimization
```sql
-- Connect to database
docker-compose -f docker-compose.prod.yml exec postgres psql -U amazon_fdc_user -d amazon_fdc_db

-- Check database size
SELECT pg_size_pretty(pg_database_size('amazon_fdc_db'));

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM campaigns WHERE account_id = 'xxx';
```

## 📞 Support

### Log Files
- Application logs: `./logs/`
- Deployment logs: `./deploy.log`
- Container logs: `docker-compose logs`

### Useful Commands
```bash
# Container status
docker-compose -f docker-compose.prod.yml ps

# Resource usage
docker stats

# Clean up unused images
docker image prune -f

# Clean up unused volumes
docker volume prune -f
```

### Getting Help
1. Check logs for error messages
2. Verify environment configuration
3. Ensure all required services are running
4. Check system resources (disk, memory, CPU)
5. Review firewall and network settings

## 🎯 Production Checklist

- [ ] Server meets minimum requirements
- [ ] Environment variables configured
- [ ] SSL certificate installed (recommended)
- [ ] Firewall configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Domain name configured (if applicable)
- [ ] Amazon API credentials configured
- [ ] Email SMTP configured (optional)
- [ ] Health checks passing

## 📈 Scaling Considerations

### Horizontal Scaling
- Use Docker Swarm or Kubernetes for multi-server deployment
- Implement load balancing with multiple backend instances
- Use external database service (AWS RDS, Google Cloud SQL)

### Vertical Scaling
- Increase server resources (CPU, RAM, disk)
- Optimize database queries and indexes
- Implement Redis caching for frequently accessed data

### Performance Monitoring
- Set up application monitoring (Prometheus, Grafana)
- Monitor database performance
- Track API response times and error rates