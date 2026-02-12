# 🎯 Docker Functionality Improvement Plan

**Practical steps to enhance your Docker setup**

---

## 📋 Current Status

### ✅ What's Working
- Docker Compose setup for development and production
- Multi-container architecture (frontend, backend, postgres, redis)
- Volume persistence for databases
- Environment variable management
- Basic health checks

### ⚠️ What Needs Improvement
- Security (secrets management)
- Monitoring and logging
- Backup strategy
- Performance optimization
- Development experience
- Production readiness

---

## 🚀 Improvement Roadmap

### **Phase 1: Security Hardening** (Week 1)

#### 1.1 Implement Docker Secrets

**Current Issue**: Passwords in plain text in docker-compose.yml

**Solution**: Use Docker secrets

```yaml
# docker-compose.prod.yml
version: '3.8'

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  jwt_refresh_secret:
    file: ./secrets/jwt_refresh_secret.txt
  google_client_secret:
    file: ./secrets/google_client_secret.txt
  amazon_client_secret:
    file: ./secrets/amazon_client_secret.txt

services:
  backend:
    image: amazon-fdc-backend:latest
    secrets:
      - db_password
      - jwt_secret
      - jwt_refresh_secret
      - google_client_secret
      - amazon_client_secret
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
```

**Implementation Steps**:
```bash
# 1. Create secrets directory
mkdir -p secrets

# 2. Generate secure passwords
openssl rand -base64 32 > secrets/db_password.txt
openssl rand -base64 32 > secrets/jwt_secret.txt
openssl rand -base64 32 > secrets/jwt_refresh_secret.txt

# 3. Add existing secrets
echo "GOCSPX-..." > secrets/google_client_secret.txt
echo "Atzr|..." > secrets/amazon_client_secret.txt

# 4. Secure permissions
chmod 600 secrets/*

# 5. Add to .gitignore
echo "secrets/" >> .gitignore

# 6. Update backend to read from files
# See backend/src/config/secrets.ts below
```

**Backend Code** (`backend/src/config/secrets.ts`):
```typescript
import fs from 'fs';
import path from 'path';

export const getSecret = (name: string, fallback?: string): string => {
  const secretFile = process.env[`${name}_FILE`];
  
  if (secretFile && fs.existsSync(secretFile)) {
    return fs.readFileSync(secretFile, 'utf8').trim();
  }
  
  return process.env[name] || fallback || '';
};

// Usage
export const config = {
  database: {
    password: getSecret('DB_PASSWORD'),
  },
  jwt: {
    secret: getSecret('JWT_SECRET'),
    refreshSecret: getSecret('JWT_REFRESH_SECRET'),
  },
  google: {
    clientSecret: getSecret('GOOGLE_CLIENT_SECRET'),
  },
};
```

#### 1.2 Add .dockerignore Files

**Create `backend/.dockerignore`**:
```
node_modules
npm-debug.log
.env
.env.*
dist
coverage
.git
.gitignore
README.md
.vscode
.idea
*.log
```

**Create `frontend/.dockerignore`**:
```
node_modules
npm-debug.log
.env
.env.*
dist
build
coverage
.git
.gitignore
README.md
.vscode
.idea
*.log
```

#### 1.3 Scan Images for Vulnerabilities

```bash
# Install Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Scan images
trivy image amazon-fdc-backend:latest
trivy image amazon-fdc-frontend:latest

# Add to CI/CD pipeline
# .github/workflows/security-scan.yml
```

---

### **Phase 2: Monitoring & Logging** (Week 2)

#### 2.1 Add Prometheus + Grafana

**Create `docker-compose.monitoring.yml`**:
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3002:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
```

**Create `monitoring/prometheus.yml`**:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
```

**Add metrics endpoint to backend**:
```bash
npm install prom-client
```

```typescript
// backend/src/middleware/metrics.ts
import client from 'prom-client';

const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

#### 2.2 Centralized Logging with ELK Stack

**Add to `docker-compose.monitoring.yml`**:
```yaml
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - monitoring

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    volumes:
      - ./monitoring/logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"
    networks:
      - monitoring
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    networks:
      - monitoring
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

**Update backend logging**:
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Http({
      host: 'logstash',
      port: 5000,
      path: '/',
    }),
  ],
});
```

---

### **Phase 3: Backup & Recovery** (Week 3)

#### 3.1 Automated Database Backups

**Add to `docker-compose.prod.yml`**:
```yaml
  postgres-backup:
    image: prodrigestivill/postgres-backup-local
    container_name: postgres-backup
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_DB=amazon_fdc_db
      - POSTGRES_USER=amazon_fdc_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - SCHEDULE=@daily
      - BACKUP_KEEP_DAYS=7
      - BACKUP_KEEP_WEEKS=4
      - BACKUP_KEEP_MONTHS=6
    volumes:
      - ./backups:/backups
    depends_on:
      - postgres
    networks:
      - app-network
```

#### 3.2 Backup Script

**Create `scripts/backup.sh`**:
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
COMPOSE_FILE="docker-compose.prod.yml"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
docker-compose -f $COMPOSE_FILE exec -T postgres pg_dump -U amazon_fdc_user amazon_fdc_db > $BACKUP_DIR/postgres_$DATE.sql

# Backup Redis
echo "Backing up Redis..."
docker-compose -f $COMPOSE_FILE exec redis redis-cli SAVE
docker cp amazon-fdc-redis:/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# Compress backups
echo "Compressing backups..."
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/postgres_$DATE.sql $BACKUP_DIR/redis_$DATE.rdb

# Remove uncompressed files
rm $BACKUP_DIR/postgres_$DATE.sql $BACKUP_DIR/redis_$DATE.rdb

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/backup_$DATE.tar.gz s3://your-bucket/backups/

# Remove old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

**Make executable**:
```bash
chmod +x scripts/backup.sh
```

**Add cron job**:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/scripts/backup.sh >> /var/log/backup.log 2>&1
```

#### 3.3 Restore Script

**Create `scripts/restore.sh`**:
```bash
#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file>"
  exit 1
fi

BACKUP_FILE=$1
COMPOSE_FILE="docker-compose.prod.yml"

# Extract backup
echo "Extracting backup..."
tar -xzf $BACKUP_FILE -C ./backups/

# Stop services
echo "Stopping services..."
docker-compose -f $COMPOSE_FILE down

# Restore PostgreSQL
echo "Restoring PostgreSQL..."
docker-compose -f $COMPOSE_FILE up -d postgres
sleep 10
cat ./backups/postgres_*.sql | docker-compose -f $COMPOSE_FILE exec -T postgres psql -U amazon_fdc_user amazon_fdc_db

# Restore Redis
echo "Restoring Redis..."
docker cp ./backups/redis_*.rdb amazon-fdc-redis:/data/dump.rdb
docker-compose -f $COMPOSE_FILE restart redis

# Start all services
echo "Starting all services..."
docker-compose -f $COMPOSE_FILE up -d

echo "Restore completed!"
```

---

### **Phase 4: Performance Optimization** (Week 4)

#### 4.1 Multi-Stage Docker Builds

**Optimize `backend/Dockerfile.prod`**:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
```

**Optimize `frontend/Dockerfile.prod`**:
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 4.2 Resource Limits

**Update `docker-compose.prod.yml`**:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped

  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: unless-stopped

  postgres:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G
    restart: unless-stopped

  redis:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    restart: unless-stopped
```

#### 4.3 Connection Pooling

**Update `backend/src/database/db.ts`**:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum pool size
  min: 5,  // Minimum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', err);
  process.exit(-1);
});

export default pool;
```

---

### **Phase 5: Development Experience** (Week 5)

#### 5.1 Hot Reload for Backend

**Update `backend/Dockerfile.dev`**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon ts-node

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start with nodemon for hot reload
CMD ["nodemon", "--watch", "src", "--ext", "ts", "--exec", "ts-node", "src/index.ts"]
```

#### 5.2 Docker Compose Override

**Create `docker-compose.override.yml`** (for local development):
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - LOG_LEVEL=debug

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  postgres:
    ports:
      - "5432:5432"  # Expose for local tools

  redis:
    ports:
      - "6379:6379"  # Expose for local tools
```

#### 5.3 Makefile for Common Commands

**Create `Makefile`**:
```makefile
.PHONY: help dev prod stop logs clean backup restore

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker-compose up -d
	@echo "Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"
	@echo "Adminer: http://localhost:8080"

prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Production environment started!"

stop: ## Stop all containers
	docker-compose down

logs: ## View logs
	docker-compose logs -f

clean: ## Remove all containers and volumes
	docker-compose down -v
	docker system prune -f

backup: ## Backup database
	./scripts/backup.sh

restore: ## Restore database (usage: make restore FILE=backup.tar.gz)
	./scripts/restore.sh $(FILE)

test: ## Run tests
	docker-compose exec backend npm test
	docker-compose exec frontend npm test

shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U amazon_fdc_user amazon_fdc_db

monitoring: ## Start monitoring stack
	docker-compose -f docker-compose.monitoring.yml up -d
	@echo "Monitoring started!"
	@echo "Prometheus: http://localhost:9090"
	@echo "Grafana: http://localhost:3002"
	@echo "Kibana: http://localhost:5601"
```

**Usage**:
```bash
make dev      # Start development
make logs     # View logs
make backup   # Backup database
make help     # Show all commands
```

---

## 📊 Success Metrics

After implementing these improvements, you should see:

### **Security**
- ✅ No plain text passwords in config files
- ✅ All images scanned for vulnerabilities
- ✅ Non-root users in containers
- ✅ Secrets properly managed

### **Monitoring**
- ✅ Real-time metrics in Grafana
- ✅ Centralized logs in Kibana
- ✅ Error tracking in Sentry
- ✅ Uptime monitoring

### **Reliability**
- ✅ Automated daily backups
- ✅ Tested restore procedure
- ✅ Health checks for all services
- ✅ Auto-restart on failure

### **Performance**
- ✅ Optimized Docker images (50% smaller)
- ✅ Connection pooling configured
- ✅ Resource limits set
- ✅ Caching implemented

### **Developer Experience**
- ✅ Hot reload working
- ✅ One-command startup (`make dev`)
- ✅ Easy access to logs and shells
- ✅ Consistent environment

---

## 🎯 Implementation Checklist

### Week 1: Security
- [ ] Implement Docker secrets
- [ ] Add .dockerignore files
- [ ] Scan images with Trivy
- [ ] Update to multi-stage builds
- [ ] Run as non-root user

### Week 2: Monitoring
- [ ] Set up Prometheus + Grafana
- [ ] Add metrics endpoint to backend
- [ ] Configure ELK stack
- [ ] Set up Sentry for errors
- [ ] Create Grafana dashboards

### Week 3: Backup
- [ ] Add postgres-backup service
- [ ] Create backup script
- [ ] Create restore script
- [ ] Test restore procedure
- [ ] Set up automated backups

### Week 4: Performance
- [ ] Optimize Dockerfiles
- [ ] Add resource limits
- [ ] Configure connection pooling
- [ ] Enable Redis persistence
- [ ] Add health checks

### Week 5: Developer Experience
- [ ] Enable hot reload
- [ ] Create docker-compose.override.yml
- [ ] Create Makefile
- [ ] Document common workflows
- [ ] Add development scripts

---

## 📚 Resources

- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Docker Security**: https://docs.docker.com/engine/security/
- **Prometheus**: https://prometheus.io/docs/
- **Grafana**: https://grafana.com/docs/
- **ELK Stack**: https://www.elastic.co/guide/

---

**Ready to start?** Begin with Week 1 (Security) and work through each phase systematically!
