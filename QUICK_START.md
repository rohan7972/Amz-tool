# ⚡ Quick Start - Deploy in 3 Steps

## 🚨 Current Status: SSH Port Blocked

**Issue**: Connection to port 22 is timing out  
**Cause**: AWS Security Group is blocking SSH access  
**Time to Fix**: 5 minutes

---

## 🎯 Your 3-Step Deployment Plan

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Fix AWS Security Group (5 minutes)             │
│  ↓                                                       │
│  STEP 2: Test SSH Connection (1 minute)                 │
│  ↓                                                       │
│  STEP 3: Deploy Application (20-30 minutes)             │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 STEP 1: Fix AWS Security Group

### Quick Method (AWS Console)

1. **Go to AWS Console**
   - Open: https://console.aws.amazon.com/ec2/
   - Region: **ap-south-1 (Mumbai)** ⚠️ Important!

2. **Find Your Instance**
   - Click "Instances" in left sidebar
   - Find instance with IP: **13.204.41.42**
   - Click on it

3. **Edit Security Group**
   - In bottom panel, click **Security** tab
   - Click on the **Security Group name** (blue link)
   - Click **Inbound rules** tab
   - Click **Edit inbound rules**

4. **Add SSH Rule**
   ```
   Click "Add rule"
   
   Type:         SSH
   Protocol:     TCP (auto)
   Port Range:   22 (auto)
   Source:       My IP (select this option)
   Description:  SSH access
   
   Click "Save rules"
   ```

5. **Add Web Traffic Rules**
   ```
   Add rule:
   Type: HTTP, Port: 80, Source: 0.0.0.0/0
   
   Add rule:
   Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   
   Click "Save rules"
   ```

**✅ Done!** Wait 30 seconds for rules to propagate.

### Detailed Instructions

See: **FIX_AWS_SECURITY_GROUP.md** for detailed guide with AWS CLI commands and troubleshooting.

---

## 📋 STEP 2: Test SSH Connection

From your local machine (where you have the Rohan.pem file):

```bash
# Navigate to project directory
cd /path/to/Amazon-FDC-Tool-amazon-tool-v4

# Ensure PEM file is here
ls Rohan.pem

# Test SSH connection
ssh -i "Rohan.pem" ubuntu@13.204.41.42

# If successful, you'll see:
# ubuntu@ip-xxx-xxx-xxx-xxx:~$
# Type 'exit' to disconnect
```

### Or Use Automated Test Script

```bash
./check-connection.sh
```

**Expected Output:**
```
[1/6] Checking PEM file... ✓
[2/6] Checking PEM file permissions... ✓
[3/6] Checking internet connectivity... ✓
[4/6] Checking DNS resolution... ✓
[5/6] Checking port 22 connectivity... ✓
[6/6] Testing SSH connection... ✓

═══════════════════════════════════════════════════
  ✓ All checks passed!
  You can proceed with deployment.
═══════════════════════════════════════════════════
```

**If test fails**: Go back to Step 1 and verify Security Group rules.

---

## 📋 STEP 3: Deploy Application

### Option A: Automated Deployment (Recommended)

```bash
# Simply run the deployment script
./deploy-to-ec2.sh
```

**What it does:**
- ✅ Installs Docker, Docker Compose, Git on server
- ✅ Clones repository to `/opt/amazon-fdc-tool`
- ✅ Generates secure passwords
- ✅ Configures environment variables
- ✅ Builds all Docker containers
- ✅ Starts all services
- ✅ Initializes database
- ✅ Verifies deployment

**Time**: 20-30 minutes

**You'll see progress indicators for each step.**

### Option B: Manual Deployment

```bash
# Follow the detailed guide
cat MANUAL_DEPLOYMENT_GUIDE.md
```

Then execute commands step-by-step on the server.

**Time**: 30-45 minutes

---

## ✅ Verification

After deployment completes, test these URLs:

### 1. Health Check
```bash
curl http://13.204.41.42:3001/health
```
Expected: `{"status":"ok"}`

### 2. Frontend
Open in browser: http://13.204.41.42

Expected: React application loads

### 3. Backend API
```bash
curl http://13.204.41.42:3001/api
```

### 4. Check Containers
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml ps"
```

Expected: 5 containers running:
- amazon-fdc-postgres (Up)
- amazon-fdc-redis (Up)
- amazon-fdc-backend (Up)
- amazon-fdc-frontend (Up)
- amazon-fdc-nginx (Up)

---

## 🎉 Success!

If all verifications pass, your application is deployed and running!

**Access your application:**
- Frontend: http://13.204.41.42
- Backend: http://13.204.41.42:3001
- Health: http://13.204.41.42:3001/health

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | This file - 3-step deployment |
| **FIX_AWS_SECURITY_GROUP.md** | Fix SSH connectivity issue |
| **DEPLOYMENT_README.md** | Complete deployment overview |
| **DEPLOYMENT_STRATEGY.md** | Architecture & strategy |
| **MANUAL_DEPLOYMENT_GUIDE.md** | Step-by-step manual guide |
| **DEPLOYMENT_COMPLETE_SUMMARY.md** | Full summary |

---

## 🔧 Common Commands

### View Logs
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml logs -f"
```

### Restart Application
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml restart"
```

### Stop Application
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml down"
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| SSH times out | Fix AWS Security Group (Step 1) |
| Permission denied | Run `chmod 400 Rohan.pem` |
| Port already in use | Stop conflicting service |
| Container won't start | Check logs with `docker-compose logs` |
| Out of memory | Increase EC2 instance size |

**Detailed troubleshooting**: See MANUAL_DEPLOYMENT_GUIDE.md

---

## 🚀 Ready?

**Start here:**

```bash
# Step 1: Fix Security Group
# Go to AWS Console and follow instructions above

# Step 2: Test connection
./check-connection.sh

# Step 3: Deploy
./deploy-to-ec2.sh
```

**That's it!** Your application will be deployed automatically.

---

**Time Estimate:**
- Fix Security Group: 5 minutes
- Test connection: 1 minute
- Automated deployment: 20-30 minutes
- **Total: ~30 minutes**

---

**Questions?** Check the documentation files or logs for detailed information.

**Last Updated**: December 26, 2025  
**Server**: 13.204.41.42  
**Region**: ap-south-1 (Mumbai)
