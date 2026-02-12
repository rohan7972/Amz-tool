# 🚀 Phase 3 Deployment Guide

**Amazon FDC Tool - Complete Phase 3 Deployment Instructions**

---

## 📋 Quick Start

```bash
# 1. SSH into production
ssh user@35.200.168.177

# 2. Navigate to project
cd /var/www/amazon-fdc-tool

# 3. Pull latest code
git checkout feature/microagent-amz-comprehensive-v3
git pull

# 4. Set password and deploy
export DB_PASSWORD='your_password'
./deploy-phase3.sh
```

**That's it! The automated script handles everything.**

---

## 📊 What Gets Deployed

### Backend Code (New in Phase 3):
- ✅ 15 API endpoints (campaigns + keywords)
- ✅ Service layer with business logic
- ✅ Amazon API client with sandbox mode
- ✅ Database connection pooling
- ✅ Authentication middleware

### Database (New in Phase 3):
- ✅ 8 tables: campaigns, ad_groups, keywords, product_ads, performance_metrics, negative_keywords, search_terms, sync_logs
- ✅ Indexes for query optimization
- ✅ Foreign key relationships
- ✅ Automatic triggers
- ✅ Test data (5 campaigns, 10 keywords, 30 days metrics)

---

## 🎯 Deployment Methods

### Method 1: Automated (Recommended) ⚡

**One command deployment:**

```bash
./deploy-phase3.sh
```

**Steps it performs:**
1. Pulls latest code from GitHub
2. Installs dependencies
3. Runs database migrations
4. Verifies tables
5. Builds TypeScript
6. Restarts PM2 service
7. Tests health endpoint

**Time:** ~2-3 minutes

---

### Method 2: Step-by-Step (Manual Control) 🔧

#### Step 1: Update Code
```bash
cd /var/www/amazon-fdc-tool
git checkout feature/microagent-amz-comprehensive-v3
git pull
```

#### Step 2: Install Dependencies
```bash
cd backend
npm install
```

#### Step 3: Run Migrations
```bash
export DB_PASSWORD='your_password'
./run-migrations.sh
```

#### Step 4: Build Backend
```bash
cd backend
npm run build
```

#### Step 5: Restart Service
```bash
pm2 restart amazon-fdc-backend
pm2 save
```

---

## 🧪 Testing After Deployment

### Quick Test:
```bash
# Health check
curl http://localhost:3001/health

# Expected: {"status":"healthy",...}
```

### Comprehensive Test:
```bash
# Get JWT token first (from your auth system)
export JWT_TOKEN="your_jwt_token"

# Run full test suite
./test-api-endpoints.sh
```

**Test Coverage:**
- ✅ 7 Campaign endpoints
- ✅ 8 Keyword endpoints
- ✅ Authentication
- ✅ Error handling
- ✅ Data validation

---

## 📝 Environment Configuration

### Required Variables in `.env`:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amazon_fdc_tool
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_long_random_secret_minimum_32_chars

# Amazon API (Sandbox Mode for Testing)
AMAZON_CLIENT_ID=your_test_client_id
AMAZON_CLIENT_SECRET=your_test_client_secret
AMAZON_REFRESH_TOKEN=your_test_refresh_token
AMAZON_SANDBOX_MODE=true

# Application
NODE_ENV=production
PORT=3001
```

---

## 🔍 Verification Checklist

After deployment, verify:

### 1. Service Status
```bash
pm2 status amazon-fdc-backend
# Should show: "online" ✅
```

### 2. Database Tables
```bash
psql -U postgres -d amazon_fdc_tool -c "\dt"
# Should list 8 tables ✅
```

### 3. Test Data
```bash
psql -U postgres -d amazon_fdc_tool -c "SELECT COUNT(*) FROM campaigns;"
# Should return: 5 ✅

psql -U postgres -d amazon_fdc_tool -c "SELECT COUNT(*) FROM keywords;"
# Should return: 10 ✅
```

### 4. API Endpoints
```bash
curl http://localhost:3001/health
# Should return: {"status":"healthy"} ✅
```

### 5. Logs Clean
```bash
pm2 logs amazon-fdc-backend --lines 20
# Should have no errors ✅
```

---

## 🐛 Troubleshooting

### Issue: Can't Connect to Database

**Solution:**
```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Test connection
psql -U postgres -c "SELECT 1"
```

### Issue: TypeScript Build Fails

**Solution:**
```bash
# Clean rebuild
rm -rf dist/ node_modules/
npm install
npm run build
```

### Issue: PM2 Won't Start

**Solution:**
```bash
# Check logs for error details
pm2 logs amazon-fdc-backend --lines 50

# Try running directly to see error
node dist/index.js
```

### Issue: Migration Fails

**Solution:**
```bash
# Check if tables already exist
psql -U postgres -d amazon_fdc_tool -c "\dt"

# Drop and recreate if needed
psql -U postgres -d amazon_fdc_tool -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
./run-migrations.sh
```

---

## 📊 API Endpoints Available

### Campaign API (`/api/campaigns`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all campaigns |
| GET | `/:id` | Get campaign details |
| POST | `/` | Create campaign |
| PUT | `/:id` | Update campaign |
| DELETE | `/:id` | Archive campaign |
| GET | `/:id/performance` | Get metrics |
| POST | `/sync` | Sync from Amazon |

### Keywords API (`/api/keywords`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List keywords |
| GET | `/:id` | Get keyword details |
| POST | `/` | Create keyword |
| PUT | `/:id` | Update keyword |
| DELETE | `/:id` | Archive keyword |
| POST | `/bulk-update-bids` | Bulk bid updates |
| GET | `/:id/performance` | Get metrics |
| POST | `/sync` | Sync from Amazon |

---

## 🔐 Security Notes

- ✅ All endpoints require JWT authentication
- ✅ User ownership validation on all operations
- ✅ Parameterized SQL queries (SQL injection safe)
- ✅ Environment variables for secrets
- ✅ Sandbox mode enabled by default

---

## 📈 Next Steps After Deployment

### 1. Test API Endpoints ✅
```bash
./test-api-endpoints.sh
```

### 2. Update Frontend Integration
Replace mock data with real API calls in frontend.

### 3. Configure Real Amazon Credentials
Once you have production credentials, update `.env`:
```bash
AMAZON_SANDBOX_MODE=false
AMAZON_CLIENT_ID=amzn1.application-oa2-client.xxxxx
AMAZON_CLIENT_SECRET=xxxxx
AMAZON_REFRESH_TOKEN=Atzr|xxxxx
```

### 4. Monitor Performance
```bash
pm2 monit
pm2 logs amazon-fdc-backend
```

---

## 📞 Quick Reference

**Scripts:**
- `./deploy-phase3.sh` - Full deployment
- `./run-migrations.sh` - Database only
- `./test-api-endpoints.sh` - API testing

**Useful Commands:**
```bash
# Check service
pm2 status

# View logs
pm2 logs amazon-fdc-backend

# Restart service
pm2 restart amazon-fdc-backend

# Monitor resources
pm2 monit

# Database access
psql -U postgres -d amazon_fdc_tool
```

**Production Server:** 35.200.168.177  
**Backend Port:** 3001  
**Database:** amazon_fdc_tool  
**Branch:** feature/microagent-amz-comprehensive-v3

---

## ✅ Deployment Success Criteria

- [x] Code deployed from GitHub
- [x] Dependencies installed
- [x] Database migrations executed
- [x] 8 tables created
- [x] Test data loaded
- [x] TypeScript compiled
- [x] PM2 service running
- [x] Health endpoint responds
- [x] No errors in logs

**Phase 3 Status:** Backend Core Complete (70%)

---

_Quick Guide - For full details see PHASE_3_PROGRESS_SUMMARY.md_  
_Last Updated: December 7, 2025_
