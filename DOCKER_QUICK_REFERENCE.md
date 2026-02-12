# 🐳 Docker Quick Reference - Amazon FDC Tool

**Quick access guide for Docker commands and workflows**

---

## 🚀 Quick Start Commands

### **Development Environment**

```bash
# Start all services (development mode)
docker-compose up -d

# Start with logs visible
docker-compose up

# Start specific service
docker-compose up -d frontend
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### **Production Environment**

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend
```

---

## 📊 Monitoring & Debugging

### **Check Service Status**

```bash
# List all running containers
docker-compose ps

# Check specific service
docker-compose ps backend

# View resource usage
docker stats

# View detailed container info
docker inspect amazon-fdc-backend
```

### **View Logs**

```bash
# All services
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Last 100 lines
docker-compose logs --tail=100 backend

# Logs from last hour
docker-compose logs --since 1h backend
```

### **Execute Commands in Containers**

```bash
# Open bash shell in backend container
docker-compose exec backend bash

# Run npm command
docker-compose exec backend npm run migrate

# Check Node.js version
docker-compose exec backend node --version

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d amazon_fdc_tool
```

---

## 🔧 Common Tasks

### **Database Operations**

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d amazon_fdc_tool

# Run migrations
docker-compose exec backend npm run migrate

# Rollback migration
docker-compose exec backend npm run migrate:rollback

# Seed database
docker-compose exec backend npm run seed

# Backup database
docker-compose exec postgres pg_dump -U postgres amazon_fdc_tool > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U postgres amazon_fdc_tool
```

### **Redis Operations**

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Check Redis keys
docker-compose exec redis redis-cli KEYS '*'

# Flush all Redis data (⚠️ careful!)
docker-compose exec redis redis-cli FLUSHALL

# Get Redis info
docker-compose exec redis redis-cli INFO
```

### **Frontend Operations**

```bash
# Rebuild frontend
docker-compose build frontend

# Install new package
docker-compose exec frontend npm install <package-name>

# Run frontend tests
docker-compose exec frontend npm test

# Build production bundle
docker-compose exec frontend npm run build
```

### **Backend Operations**

```bash
# Rebuild backend
docker-compose build backend

# Install new package
docker-compose exec backend npm install <package-name>

# Run backend tests
docker-compose exec backend npm test

# Check TypeScript compilation
docker-compose exec backend npm run build
```

---

## 🔄 Rebuild & Restart

### **Rebuild After Code Changes**

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache (clean build)
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

### **Restart Services**

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Restart with rebuild
docker-compose up -d --build backend
```

---

## 🧹 Cleanup Commands

### **Remove Containers**

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove containers, volumes, and images
docker-compose down -v --rmi all
```

### **Clean Docker System**

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused (⚠️ careful!)
docker system prune -a --volumes
```

---

## 🐛 Troubleshooting

### **Container Won't Start**

```bash
# Check logs for errors
docker-compose logs backend

# Check container status
docker-compose ps

# Inspect container
docker inspect amazon-fdc-backend

# Try rebuilding
docker-compose build --no-cache backend
docker-compose up -d backend
```

### **Port Already in Use**

```bash
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Mac/Linux)
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### **Database Connection Issues**

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec backend node -e "require('./src/database/db')"

# Restart PostgreSQL
docker-compose restart postgres
```

### **Redis Connection Issues**

```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli PING

# Check Redis logs
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

### **Frontend Not Loading**

```bash
# Check if frontend is running
docker-compose ps frontend

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Check NGINX logs (production)
docker-compose -f docker-compose.prod.yml logs nginx
```

---

## 📦 Environment Variables

### **View Environment Variables**

```bash
# Backend environment
docker-compose exec backend env

# Frontend environment
docker-compose exec frontend env

# Specific variable
docker-compose exec backend printenv DATABASE_URL
```

### **Update Environment Variables**

```bash
# 1. Edit .env file or docker-compose.yml
# 2. Restart service
docker-compose up -d --force-recreate backend

# Or rebuild
docker-compose up -d --build backend
```

---

## 🔍 Health Checks

### **Check Application Health**

```bash
# Backend health
curl http://localhost:5000/health

# Frontend (development)
curl http://localhost:3000

# Database health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli PING
```

### **Production Health Checks**

```bash
# Application health
curl https://app.sellerai.in/health

# Backend API
curl https://app.sellerai.in/api/health

# Check all services
docker-compose -f docker-compose.prod.yml ps
```

---

## 📈 Performance Monitoring

### **Resource Usage**

```bash
# Real-time stats
docker stats

# Specific container
docker stats amazon-fdc-backend

# Export stats
docker stats --no-stream > stats.txt
```

### **Container Metrics**

```bash
# CPU usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}"

# Memory usage
docker stats --format "table {{.Container}}\t{{.MemUsage}}"

# Network I/O
docker stats --format "table {{.Container}}\t{{.NetIO}}"
```

---

## 🔐 Security Commands

### **Scan Images for Vulnerabilities**

```bash
# Scan backend image
docker scan amazon-fdc-tool-backend

# Scan with Trivy
trivy image amazon-fdc-tool-backend:latest
```

### **Update Base Images**

```bash
# Pull latest base images
docker-compose pull

# Rebuild with latest
docker-compose build --pull
```

---

## 📝 Useful Aliases

Add these to your `.bashrc` or `.zshrc`:

```bash
# Docker Compose shortcuts
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'
alias dcp='docker-compose ps'

# Amazon FDC Tool specific
alias fdc-start='docker-compose up -d'
alias fdc-stop='docker-compose down'
alias fdc-logs='docker-compose logs -f'
alias fdc-backend='docker-compose exec backend bash'
alias fdc-db='docker-compose exec postgres psql -U postgres -d amazon_fdc_tool'
```

---

## 🎯 Common Workflows

### **Daily Development Workflow**

```bash
# 1. Start services
docker-compose up -d

# 2. Check status
docker-compose ps

# 3. View logs (in separate terminal)
docker-compose logs -f

# 4. Make code changes (hot reload enabled)

# 5. Run tests
docker-compose exec backend npm test

# 6. Stop when done
docker-compose down
```

### **Deploy New Version**

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild images
docker-compose -f docker-compose.prod.yml build

# 3. Stop old containers
docker-compose -f docker-compose.prod.yml down

# 4. Start new containers
docker-compose -f docker-compose.prod.yml up -d

# 5. Check health
curl https://app.sellerai.in/health

# 6. Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

### **Database Migration**

```bash
# 1. Create migration
docker-compose exec backend npm run migrate:make migration_name

# 2. Run migration
docker-compose exec backend npm run migrate

# 3. Verify
docker-compose exec postgres psql -U postgres -d amazon_fdc_tool -c "\dt"
```

### **Backup & Restore**

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres amazon_fdc_tool > backup_$(date +%Y%m%d).sql

# Restore
docker-compose down
docker volume rm amazon-fdc-tool_postgres_data
docker-compose up -d postgres
sleep 10
cat backup_20260102.sql | docker-compose exec -T postgres psql -U postgres amazon_fdc_tool
docker-compose up -d
```

---

## 🆘 Emergency Commands

### **Complete Reset** (⚠️ Deletes all data!)

```bash
# Stop everything
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean system
docker system prune -a --volumes -f

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

### **Quick Fix for Most Issues**

```bash
# 1. Stop all services
docker-compose down

# 2. Remove volumes
docker volume prune -f

# 3. Rebuild without cache
docker-compose build --no-cache

# 4. Start fresh
docker-compose up -d

# 5. Check logs
docker-compose logs -f
```

---

## 📚 Additional Resources

- **Docker Docs**: https://docs.docker.com/
- **Docker Compose Docs**: https://docs.docker.com/compose/
- **Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Security**: https://docs.docker.com/engine/security/

---

## 💡 Pro Tips

1. **Use `.dockerignore`** to exclude unnecessary files from builds
2. **Multi-stage builds** reduce image size significantly
3. **Health checks** ensure containers are actually working
4. **Named volumes** persist data between container restarts
5. **Resource limits** prevent containers from consuming all system resources
6. **Logging drivers** help centralize logs
7. **Networks** isolate services for security

---

**Need help?** Check the logs first: `docker-compose logs -f`

**Still stuck?** Review `PROJECT_ANALYSIS_AND_RECOMMENDATIONS.md` for detailed guidance.
