# 🏗️ System Architecture - Amazon FDC Tool

**Visual representation of the application architecture**

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER / CLIENT                                │
│                    (Browser / Mobile App)                            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS (SSL/TLS)
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                      NGINX (Reverse Proxy)                           │
│  - SSL Termination                                                   │
│  - Load Balancing                                                    │
│  - Static File Serving                                               │
│  - Compression (gzip/brotli)                                         │
└────────────┬───────────────────────────────┬────────────────────────┘
             │                               │
             │ Port 3000                     │ Port 3001
             │                               │
┌────────────▼──────────────┐   ┌───────────▼────────────────────────┐
│    FRONTEND CONTAINER     │   │     BACKEND CONTAINER              │
│                           │   │                                    │
│  React 18 + TypeScript    │   │  Node.js + Express + TypeScript    │
│  Vite (Dev Server)        │   │                                    │
│  Mantine UI               │   │  ┌──────────────────────────────┐  │
│  React Query              │   │  │   API Routes Layer           │  │
│  Zustand (State)          │   │  │  /api/auth                   │  │
│  Socket.io Client         │   │  │  /api/users                  │  │
│                           │   │  │  /api/campaigns              │  │
│  ┌─────────────────────┐  │   │  │  /api/dashboard              │  │
│  │  Components         │  │   │  │  /api/automation             │  │
│  │  - Dashboard        │  │   │  │  /api/admin                  │  │
│  │  - Campaigns        │  │   │  └──────────────────────────────┘  │
│  │  - Reports          │  │   │                                    │
│  │  - Admin Panel      │  │   │  ┌──────────────────────────────┐  │
│  └─────────────────────┘  │   │  │   Middleware Layer           │  │
│                           │   │  │  - Authentication (JWT)      │  │
│  ┌─────────────────────┐  │   │  │  - Rate Limiting             │  │
│  │  Pages              │  │   │  │  - Error Handling            │  │
│  │  - Login            │  │   │  │  - Validation                │  │
│  │  - Dashboard        │  │   │  │  - Logging                   │  │
│  │  - Daily Report     │  │   │  └──────────────────────────────┘  │
│  │  - Settings         │  │   │                                    │
│  └─────────────────────┘  │   │  ┌──────────────────────────────┐  │
│                           │   │  │   Services Layer             │  │
│  ┌─────────────────────┐  │   │  │  - SyncService               │  │
│  │  Services           │  │   │  │  - AmazonAPIService          │  │
│  │  - API Client       │  │   │  │  - NotificationService       │  │
│  │  - Auth Service     │  │   │  │  - AutomationService         │  │
│  └─────────────────────┘  │   │  └──────────────────────────────┘  │
│                           │   │                                    │
└───────────────────────────┘   └────────┬───────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    │                    │                    │
┌───────────────────▼──────┐  ┌──────────▼─────────┐  ┌──────▼──────────┐
│  POSTGRESQL CONTAINER    │  │  REDIS CONTAINER   │  │  ADMINER        │
│                          │  │                    │  │  (DB Admin UI)  │
│  PostgreSQL 15           │  │  Redis 7 Alpine    │  │                 │
│                          │  │                    │  │  Port 8080      │
│  ┌────────────────────┐  │  │  ┌──────────────┐  │  │                 │
│  │  Database Schema   │  │  │  │  Cache       │  │  └─────────────────┘
│  │                    │  │  │  │  - Sessions  │  │
│  │  - users           │  │  │  │  - API Data  │  │
│  │  - accounts        │  │  │  │  - Metrics   │  │
│  │  - campaigns       │  │  │  └──────────────┘  │
│  │  - keywords        │  │  │                    │
│  │  - metrics         │  │  │  ┌──────────────┐  │
│  │  - automations     │  │  │  │  Job Queue   │  │
│  │  - notifications   │  │  │  │  - Sync Jobs │  │
│  │  - admin_settings  │  │  │  │  - Emails    │  │
│  └────────────────────┘  │  │  │  - Reports   │  │
│                          │  │  └──────────────┘  │
│  Volume: postgres_data   │  │                    │
│  Port: 5432 (internal)   │  │  Volume: redis_data│
└──────────────────────────┘  │  Port: 6379        │
                              └────────────────────┘
```

---

## 🔄 Data Flow Diagram

### **User Authentication Flow**

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Click "Login with Google"
     ▼
┌────────────────┐
│   Frontend     │
└────┬───────────┘
     │
     │ 2. Redirect to Google OAuth
     ▼
┌────────────────┐
│  Google OAuth  │
└────┬───────────┘
     │
     │ 3. User authorizes
     ▼
┌────────────────┐
│   Backend      │
│  /api/auth/    │
│  google/       │
│  callback      │
└────┬───────────┘
     │
     │ 4. Verify token
     │ 5. Create/update user
     │ 6. Generate JWT
     ▼
┌────────────────┐
│  PostgreSQL    │
│  (users table) │
└────┬───────────┘
     │
     │ 7. Return JWT
     ▼
┌────────────────┐
│   Frontend     │
│  (Store token) │
└────┬───────────┘
     │
     │ 8. Redirect to Dashboard
     ▼
┌──────────┐
│Dashboard │
└──────────┘
```

### **Amazon Account Connection Flow**

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Click "Connect Amazon Account"
     ▼
┌────────────────┐
│   Frontend     │
└────┬───────────┘
     │
     │ 2. POST /api/oauth/authorize
     ▼
┌────────────────┐
│   Backend      │
└────┬───────────┘
     │
     │ 3. Generate OAuth URL
     │ 4. Redirect to Amazon
     ▼
┌────────────────┐
│  Amazon SP-API │
│  Authorization │
└────┬───────────┘
     │
     │ 5. User authorizes
     │ 6. Redirect with code
     ▼
┌────────────────┐
│   Backend      │
│  /api/oauth/   │
│  callback      │
└────┬───────────┘
     │
     │ 7. Exchange code for tokens
     │ 8. Store account details
     ▼
┌────────────────┐
│  PostgreSQL    │
│  (accounts)    │
└────┬───────────┘
     │
     │ 9. Start initial sync
     ▼
┌────────────────┐
│  Redis Queue   │
│  (Sync Job)    │
└────┬───────────┘
     │
     │ 10. Process sync
     ▼
┌────────────────┐
│ Amazon API     │
│ (Fetch data)   │
└────┬───────────┘
     │
     │ 11. Store campaigns, metrics
     ▼
┌────────────────┐
│  PostgreSQL    │
│  (campaigns,   │
│   metrics)     │
└────────────────┘
```

### **Dashboard Data Flow**

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Navigate to Dashboard
     ▼
┌────────────────┐
│   Frontend     │
│  (React Query) │
└────┬───────────┘
     │
     │ 2. GET /api/dashboard/metrics
     ▼
┌────────────────┐
│   Backend      │
│  (Check cache) │
└────┬───────────┘
     │
     │ 3. Cache miss
     ▼
┌────────────────┐
│  PostgreSQL    │
│  (Query data)  │
└────┬───────────┘
     │
     │ 4. Calculate metrics
     │    - Total Sales
     │    - ACoS
     │    - RoAS
     │    - Trends
     ▼
┌────────────────┐
│   Backend      │
│  (Store cache) │
└────┬───────────┘
     │
     │ 5. Cache in Redis (5 min TTL)
     ▼
┌────────────────┐
│  Redis Cache   │
└────┬───────────┘
     │
     │ 6. Return JSON
     ▼
┌────────────────┐
│   Frontend     │
│  (Render UI)   │
└────┬───────────┘
     │
     │ 7. Display charts & KPIs
     ▼
┌──────────┐
│Dashboard │
└──────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                             │
├─────────────────────────────────────────────────────────────────┤
│  id (PK)           │ UUID                                       │
│  email             │ VARCHAR(255) UNIQUE                        │
│  name              │ VARCHAR(255)                               │
│  password_hash     │ VARCHAR(255) (nullable for OAuth)          │
│  role              │ ENUM('user', 'admin', 'super_admin')       │
│  google_id         │ VARCHAR(255) (nullable)                    │
│  created_at        │ TIMESTAMP                                  │
│  updated_at        │ TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ACCOUNTS TABLE                            │
├─────────────────────────────────────────────────────────────────┤
│  id (PK)           │ UUID                                       │
│  user_id (FK)      │ UUID → users.id                            │
│  amazon_seller_id  │ VARCHAR(255)                               │
│  marketplace       │ VARCHAR(50)                                │
│  region            │ VARCHAR(50)                                │
│  access_token      │ TEXT (encrypted)                           │
│  refresh_token     │ TEXT (encrypted)                           │
│  status            │ ENUM('active', 'inactive', 'error')        │
│  last_sync_at      │ TIMESTAMP                                  │
│  created_at        │ TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAMPAIGNS TABLE                            │
├─────────────────────────────────────────────────────────────────┤
│  id (PK)           │ UUID                                       │
│  account_id (FK)   │ UUID → accounts.id                         │
│  campaign_id       │ VARCHAR(255) (Amazon ID)                   │
│  name              │ VARCHAR(255)                               │
│  status            │ ENUM('ENABLED', 'PAUSED', 'ARCHIVED')      │
│  budget            │ DECIMAL(10,2)                              │
│  budget_type       │ ENUM('DAILY', 'LIFETIME')                  │
│  targeting_type    │ ENUM('AUTO', 'MANUAL')                     │
│  created_at        │ TIMESTAMP                                  │
│  updated_at        │ TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMPAIGN_METRICS TABLE                       │
├─────────────────────────────────────────────────────────────────┤
│  id (PK)           │ UUID                                       │
│  campaign_id (FK)  │ UUID → campaigns.id                        │
│  date              │ DATE                                       │
│  impressions       │ INTEGER                                    │
│  clicks            │ INTEGER                                    │
│  spend             │ DECIMAL(10,2)                              │
│  sales             │ DECIMAL(10,2)                              │
│  orders            │ INTEGER                                    │
│  acos              │ DECIMAL(5,2)                               │
│  roas              │ DECIMAL(5,2)                               │
│  cpc               │ DECIMAL(5,2)                               │
│  ctr               │ DECIMAL(5,2)                               │
│  cvr               │ DECIMAL(5,2)                               │
│  created_at        │ TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATIONS TABLE                            │
├─────────────────────────────────────────────────────────────────┤
│  id (PK)           │ UUID                                       │
│  user_id (FK)      │ UUID → users.id                            │
│  name              │ VARCHAR(255)                               │
│  entity_type       │ ENUM('campaign', 'keyword', 'product')     │
│  conditions        │ JSONB (rule conditions)                    │
│  actions           │ JSONB (actions to perform)                 │
│  schedule          │ VARCHAR(50) (cron expression)              │
│  status            │ ENUM('active', 'paused', 'archived')       │
│  last_run_at       │ TIMESTAMP                                  │
│  created_at        │ TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   NOTIFICATIONS TABLE                           │
├─────────────────────────────────────────────────────────────────┤
│  id (PK)           │ UUID                                       │
│  user_id (FK)      │ UUID → users.id                            │
│  type              │ VARCHAR(50)                                │
│  title             │ VARCHAR(255)                               │
│  message           │ TEXT                                       │
│  data              │ JSONB (additional data)                    │
│  read              │ BOOLEAN                                    │
│  created_at        │ TIMESTAMP                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### **Authentication**
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login with email/password
POST   /api/auth/google            # Login with Google
GET    /api/auth/google/callback   # Google OAuth callback
POST   /api/auth/refresh           # Refresh JWT token
POST   /api/auth/logout            # Logout user
```

### **Users**
```
GET    /api/users/me               # Get current user
PUT    /api/users/me               # Update current user
DELETE /api/users/me               # Delete current user
```

### **Amazon Accounts**
```
GET    /api/accounts               # List all accounts
POST   /api/accounts               # Add new account
GET    /api/accounts/:id           # Get account details
PUT    /api/accounts/:id           # Update account
DELETE /api/accounts/:id           # Remove account
POST   /api/accounts/:id/sync      # Trigger sync
```

### **OAuth**
```
GET    /api/oauth/authorize        # Start Amazon OAuth flow
GET    /api/oauth/callback         # Amazon OAuth callback
```

### **Dashboard**
```
GET    /api/dashboard/metrics      # Get dashboard metrics
GET    /api/dashboard/trends       # Get performance trends
GET    /api/dashboard/summary      # Get summary data
```

### **Campaigns**
```
GET    /api/campaigns              # List campaigns
GET    /api/campaigns/:id          # Get campaign details
PUT    /api/campaigns/:id          # Update campaign
DELETE /api/campaigns/:id          # Delete campaign
GET    /api/campaigns/:id/metrics  # Get campaign metrics
```

### **Automation**
```
GET    /api/automation/rules       # List automation rules
POST   /api/automation/rules       # Create rule
PUT    /api/automation/rules/:id   # Update rule
DELETE /api/automation/rules/:id   # Delete rule
POST   /api/automation/rules/:id/execute  # Execute rule
```

### **Admin**
```
GET    /api/admin/users            # List all users (admin only)
GET    /api/admin/stats            # System statistics
GET    /api/admin/logs             # System logs
POST   /api/admin/settings         # Update settings
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├── HTTPS/TLS encryption (Let's Encrypt)
├── NGINX reverse proxy
├── Rate limiting (express-rate-limit)
└── CORS configuration

Layer 2: Application Security
├── Helmet.js (HTTP headers)
├── Input validation (Joi/Zod)
├── SQL injection prevention (parameterized queries)
├── XSS prevention (sanitization)
└── CSRF protection

Layer 3: Authentication & Authorization
├── JWT tokens (access + refresh)
├── OAuth 2.0 (Google, Amazon)
├── Role-based access control (RBAC)
├── Session management (Redis)
└── Password hashing (bcrypt)

Layer 4: Data Security
├── Encrypted credentials (AES-256)
├── Database encryption at rest
├── Secure environment variables
└── Secrets management

Layer 5: Monitoring & Logging
├── Winston logging
├── Error tracking (Sentry recommended)
├── Audit logs
└── Security alerts
```

---

## 📊 Deployment Architecture

### **Current Setup (Single Server)**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                             │
│                  (t3.medium, ap-south-1)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Docker Engine                          │ │
│  │                                                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │ Frontend │  │ Backend  │  │PostgreSQL│  │  Redis   │ │ │
│  │  │Container │  │Container │  │Container │  │Container │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  │                                                           │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              NGINX Container                         │ │ │
│  │  │  - Reverse Proxy                                     │ │ │
│  │  │  - SSL Termination                                   │ │ │
│  │  │  - Load Balancing                                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Volumes:                                                       │
│  - postgres_data (persistent)                                   │
│  - redis_data (persistent)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (443)
                              ▼
                    ┌──────────────────┐
                    │  app.sellerai.in │
                    │  (Domain + SSL)  │
                    └──────────────────┘
```

### **Recommended Setup (Scalable)**

```
┌─────────────────────────────────────────────────────────────────┐
│                      Load Balancer (AWS ALB)                    │
└────────────┬────────────────────────────────┬───────────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐      ┌────────────────────────┐
│   EC2 Instance 1       │      │   EC2 Instance 2       │
│   (Frontend + Backend) │      │   (Frontend + Backend) │
└────────────┬───────────┘      └────────────┬───────────┘
             │                                │
             └────────────────┬───────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   RDS PostgreSQL │
                    │   (Multi-AZ)     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  ElastiCache     │
                    │  (Redis Cluster) │
                    └──────────────────┘
```

---

## 🔄 CI/CD Pipeline (Recommended)

```
┌──────────────┐
│  Developer   │
│  (Git Push)  │
└──────┬───────┘
       │
       │ 1. Push to GitHub
       ▼
┌──────────────────┐
│  GitHub Actions  │
│  (CI Pipeline)   │
└──────┬───────────┘
       │
       │ 2. Run tests
       │ 3. Build Docker images
       │ 4. Push to registry
       ▼
┌──────────────────┐
│  Docker Registry │
│  (ECR/Docker Hub)│
└──────┬───────────┘
       │
       │ 5. Trigger deployment
       ▼
┌──────────────────┐
│  AWS EC2         │
│  (Pull & Deploy) │
└──────┬───────────┘
       │
       │ 6. Health check
       ▼
┌──────────────────┐
│  Production      │
│  (Live)          │
└──────────────────┘
```

---

## 📈 Monitoring Stack (Recommended)

```
Application Metrics → Prometheus → Grafana → Alerts
       │
       ├─ Response times
       ├─ Error rates
       ├─ Request counts
       └─ Resource usage

Application Logs → ELK Stack → Kibana → Search
       │
       ├─ Error logs
       ├─ Access logs
       ├─ Audit logs
       └─ Debug logs

Error Tracking → Sentry → Notifications
       │
       ├─ Exceptions
       ├─ Stack traces
       └─ User context

Uptime Monitoring → Pingdom/UptimeRobot → Alerts
       │
       ├─ Availability
       ├─ Response time
       └─ SSL expiry
```

---

This architecture provides a solid foundation for scaling from hundreds to thousands of users while maintaining security, performance, and reliability.
