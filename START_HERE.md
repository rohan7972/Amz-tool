# 🎯 START HERE - Amazon FDC Tool Deployment

## 📌 Current Situation

**✅ Good News**: All deployment files and scripts are ready!  
**⚠️ Issue**: SSH connection is blocked by AWS Security Group  
**⏱️ Time to Deploy**: ~30 minutes (once Security Group is fixed)

---

## 🚨 IMMEDIATE ACTION REQUIRED

**Problem**: `Connection to 13.204.41.42 port 22 timed out`

**This means**: AWS Security Group is not configured to allow SSH access.

**Action**: Open AWS Console and configure Security Group ← **DO THIS FIRST**

---

## 🎯 Your Complete Action Plan

```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│  📋 PHASE 1: Fix AWS Security Group                        │
│  Time: 5 minutes                                            │
│  Location: AWS Console                                      │
│  File: FIX_AWS_SECURITY_GROUP.md                           │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  🧪 PHASE 2: Verify SSH Connection                         │
│  Time: 1 minute                                             │
│  Command: ./check-connection.sh                             │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  🚀 PHASE 3: Deploy Application                            │
│  Time: 20-30 minutes                                        │
│  Command: ./deploy-to-ec2.sh                                │
│                                                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ PHASE 4: Verify & Test                                 │
│  Time: 5 minutes                                            │
│  URL: http://13.204.41.42                                   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 📖 Documentation Index

**Read files in this order:**

### 🔥 URGENT - Fix Connection First
1. **FIX_AWS_SECURITY_GROUP.md** ← Read this NOW
   - How to open port 22 in AWS
   - Step-by-step with screenshots guide
   - AWS CLI commands included

### ⚡ Quick Deployment
2. **QUICK_START.md** ← After fixing Security Group
   - 3-step deployment process
   - Quick commands
   - Fast verification

### 🤖 Automated Deployment
3. **Run: ./deploy-to-ec2.sh** ← Easiest method
   - One command deployment
   - Fully automated
   - 20-30 minutes

### 📚 Detailed Information
4. **DEPLOYMENT_README.md**
   - Complete overview
   - All options explained
   - Post-deployment guide

5. **MANUAL_DEPLOYMENT_GUIDE.md**
   - Step-by-step manual deployment
   - Every command explained
   - Troubleshooting included

6. **DEPLOYMENT_STRATEGY.md**
   - Architecture details
   - Security best practices
   - Monitoring setup

7. **DEPLOYMENT_COMPLETE_SUMMARY.md**
   - Everything summarized
   - All features listed
   - Quick reference

---

## 🎬 Quick Start (After Fixing Security Group)

```bash
# IMPORTANT: Set your environment variables first:
export REPO_URL="https://github.com/your-org/Amazon-FDC-Tool.git"
export BRANCH="main"
export EC2_HOST="your-ec2-host.compute.amazonaws.com"
export PEM_FILE="./path/to/your-key.pem"

# 1. Clone repository (if not already done)
git clone -b $BRANCH $REPO_URL
cd Amazon-FDC-Tool

# 2. Copy your PEM file here
cp "$PEM_FILE" ./key.pem
chmod 400 key.pem

# 3. Test connection
./check-connection.sh

# 4. Deploy (if test passes)
./deploy-to-ec2.sh

# 5. Verify
echo "Your application is deployed at https://your-domain.com"
```

---

## 📋 Pre-Flight Checklist

Before you start:

- [ ] **AWS Console Access** - You can log into AWS Console
- [ ] **Region Selected** - ap-south-1 (Mumbai) region
- [ ] **Instance Running** - EC2 instance is in "running" state
- [ ] **PEM Key File** - Your EC2 key pair (.pem file) is available locally
- [ ] **Git Access** - Can clone from GitHub
- [ ] **Internet Connection** - Stable internet connection

---

## 🔓 Fix AWS Security Group NOW

### Quick Fix (5 minutes)

1. **Go to AWS Console**
   ```
   https://console.aws.amazon.com/ec2/
   ```

2. **Select Region**
   - Top right corner
   - Choose: **ap-south-1 (Mumbai)**

3. **Find Your Instance**
   - Left sidebar: **Instances**
   - Find IP: **13.204.41.42**
   - Click on it

4. **Edit Security Group**
   - Bottom panel: **Security** tab
   - Click the **Security Group name**
   - Click **Inbound rules**
   - Click **Edit inbound rules**

5. **Add These Rules**
   ```
   Rule 1:
   Type: SSH
   Port: 22
   Source: My IP
   
   Rule 2:
   Type: HTTP
   Port: 80
   Source: 0.0.0.0/0
   
   Rule 3:
   Type: HTTPS
   Port: 443
   Source: 0.0.0.0/0
   ```

6. **Save**
   - Click **Save rules**
   - Wait 30 seconds

### Detailed Instructions

See **FIX_AWS_SECURITY_GROUP.md** for:
- Visual step-by-step guide
- AWS CLI commands
- Troubleshooting
- Verification steps

---

## 🧪 Test SSH Connection

After fixing Security Group:

```bash
# IMPORTANT: Update with your EC2 details
export EC2_HOST="your-ec2-host.compute.amazonaws.com"
export PEM_FILE="./path/to/your-key.pem"

# Quick test
ssh -i "$PEM_FILE" ubuntu@$EC2_HOST

# Or use automated test
./check-connection.sh
```

**Expected**: Connection successful ✅

**If fails**: Review FIX_AWS_SECURITY_GROUP.md

---

## 🚀 Deploy Application

### Automated Method (Recommended)

```bash
./deploy-to-ec2.sh
```

**This script will:**
1. ✅ Check prerequisites
2. ✅ Install Docker & dependencies
3. ✅ Clone repository
4. ✅ Generate secure passwords
5. ✅ Configure environment
6. ✅ Build Docker images
7. ✅ Start all services
8. ✅ Initialize database
9. ✅ Verify deployment

**Duration**: 20-30 minutes

### Manual Method

```bash
# Read the guide
cat MANUAL_DEPLOYMENT_GUIDE.md

# Then follow each step
```

**Duration**: 30-45 minutes

---

## ✅ Verify Deployment

After deployment completes:

### 1. Check Health
```bash
curl http://13.204.41.42:3001/health
```
Expected: `{"status":"ok"}`

### 2. Open Frontend
Browser: http://13.204.41.42

Expected: Application loads

### 3. Check Containers
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml ps"
```

Expected: All 5 containers "Up"

---

## 🎉 After Successful Deployment

Your application will be running at:

- **Frontend**: http://13.204.41.42
- **Backend API**: http://13.204.41.42:3001
- **Health Check**: http://13.204.41.42:3001/health

### What's Deployed

✅ React Frontend (Mantine UI)  
✅ Node.js Backend (Express + TypeScript)  
✅ PostgreSQL Database  
✅ Redis Cache  
✅ Nginx Reverse Proxy  
✅ Docker Containers (5 total)  
✅ Automated Health Checks  
✅ Secure Environment Configuration  

---

## 📁 All Files Created

### Documentation (7 files)
- ✅ START_HERE.md (this file)
- ✅ QUICK_START.md
- ✅ FIX_AWS_SECURITY_GROUP.md
- ✅ DEPLOYMENT_README.md
- ✅ DEPLOYMENT_STRATEGY.md
- ✅ MANUAL_DEPLOYMENT_GUIDE.md
- ✅ DEPLOYMENT_COMPLETE_SUMMARY.md

### Scripts (2 files)
- ✅ deploy-to-ec2.sh (automated deployment)
- ✅ check-connection.sh (connection tester)

### Configuration
- ✅ docker-compose.prod.yml
- ✅ Backend Dockerfile.prod
- ✅ Frontend Dockerfile.prod
- ✅ Nginx configuration
- ✅ Environment templates

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| SSH timeout | Fix AWS Security Group (see FIX_AWS_SECURITY_GROUP.md) |
| Permission denied | Run `chmod 400 your-key.pem` |
| Wrong region | Ensure ap-south-1 (Mumbai) is selected |
| Instance stopped | Start instance in AWS Console |
| Port in use | Stop conflicting service |

**Full troubleshooting**: MANUAL_DEPLOYMENT_GUIDE.md

---

## 📞 Get Help

1. **Check logs**
   ```bash
   ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
     "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml logs"
   ```

2. **Read documentation**
   - FIX_AWS_SECURITY_GROUP.md
   - MANUAL_DEPLOYMENT_GUIDE.md
   - DEPLOYMENT_STRATEGY.md

3. **Run diagnostics**
   ```bash
   ./check-connection.sh
   ```

---

## ⚡ TL;DR (Too Long; Didn't Read)

**Problem**: SSH port blocked  
**Fix**: Open AWS Console → Security Groups → Add SSH rule (port 22)  
**Deploy**: Run `./deploy-to-ec2.sh`  
**Access**: http://13.204.41.42

**Read**: FIX_AWS_SECURITY_GROUP.md for detailed instructions.

---

## 🎯 Your Next Command

```bash
# First, fix AWS Security Group in AWS Console
# Then run:
./check-connection.sh
```

If that passes:

```bash
./deploy-to-ec2.sh
```

---

## 📊 Deployment Checklist

**Before Deployment:**
- [ ] AWS Security Group configured (port 22, 80, 443)
- [ ] SSH connection working
- [ ] PEM key file available (chmod 400)
- [ ] EC2 instance running
- [ ] Correct region selected (ap-south-1)

**During Deployment:**
- [ ] ./deploy-to-ec2.sh running
- [ ] Monitor progress (20-30 min)
- [ ] No errors in output

**After Deployment:**
- [ ] All containers running
- [ ] Health check returns OK
- [ ] Frontend loads in browser
- [ ] No critical errors in logs

---

## 🎊 Success!

When everything works:

✅ 5 Docker containers running  
✅ Application accessible at http://13.204.41.42  
✅ Backend API responding  
✅ Database initialized  
✅ No errors in logs  

**Congratulations!** Your Amazon FDC Tool is deployed and ready to use! 🚀

---

## 📚 Learn More

- **Architecture**: DEPLOYMENT_STRATEGY.md
- **Operations**: MANUAL_DEPLOYMENT_GUIDE.md
- **Features**: README.md
- **Technical Docs**: docs/ folder

---

**Current Server**: 13.204.41.42  
**Region**: ap-south-1 (Mumbai)  
**Status**: Ready for deployment  
**Next Step**: Fix AWS Security Group  
**Time Required**: ~30 minutes total

---

# 🚀 LET'S GET STARTED!

**Your first action:**

1. Open AWS Console
2. Follow instructions in **FIX_AWS_SECURITY_GROUP.md**
3. Come back and run `./check-connection.sh`

**Good luck!** 🎉
