# 🚀 Deploy from Your Local Machine

## ⚠️ Important Notice

**Current Situation**: The deployment cannot be completed from this automated environment due to SSH connectivity restrictions.

**Solution**: You need to deploy from your **local machine** where you have direct access to your EC2 instance.

---

## ✅ Everything is Ready

All deployment materials have been prepared and are ready for you to use:

### 📦 What's Been Prepared
- ✅ Complete deployment documentation (7 guides)
- ✅ Automated deployment script
- ✅ Connection testing script
- ✅ Docker production configurations
- ✅ Environment templates
- ✅ Security best practices implemented
- ✅ Troubleshooting guides

---

## 🎯 Deploy in 3 Steps

### Step 1: Get the Files (5 minutes)

**Option A: Clone from GitHub** (Recommended)
```bash
# On your local machine
git clone -b feature/docker-integration https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git
cd Amazon-FDC-Tool-amazon-tool-v4
```

**Option B: Download as ZIP**
1. Go to: https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in that directory

### Step 2: Setup Your Environment (2 minutes)

```bash
# Copy your PEM file to the project directory
cp /path/to/Rohan.pem ./

# Set correct permissions
chmod 400 Rohan.pem

# Verify you have the PEM file
ls -la Rohan.pem
# Should show: -r-------- ... Rohan.pem
```

### Step 3: Test and Deploy (30 minutes)

```bash
# Test SSH connection first
./check-connection.sh

# If test passes, deploy
./deploy-to-ec2.sh
```

---

## 🔍 Current Issue: Port 22 Closed

**Latest Status**: Port 22 is currently **CLOSED** or **BLOCKED**

This means:
- Security Group may have been modified
- EC2 instance may be stopped
- Network ACL may be blocking

### Quick Fix:

#### Check EC2 Instance Status
1. Go to AWS Console: https://console.aws.amazon.com/ec2/
2. Region: **ap-south-1 (Mumbai)**
3. Click **Instances**
4. Find instance with IP: **13.204.41.42**
5. Check status:
   - **If stopped**: Click "Start instance"
   - **If running**: Check Security Group

#### Re-check Security Group
1. Select the instance
2. Click **Security** tab (bottom panel)
3. Click on the Security Group name
4. Click **Inbound rules**
5. Verify rule exists:
   ```
   Type: SSH
   Port: 22
   Source: Your IP or 0.0.0.0/0
   ```
6. If missing, click "Edit inbound rules" → "Add rule"

---

## 📋 Pre-Deployment Checklist

Before running deployment:

### AWS Prerequisites
- [ ] EC2 instance is **running** (check AWS Console)
- [ ] Security Group allows port 22 from your IP
- [ ] Security Group allows port 80 (HTTP) from 0.0.0.0/0
- [ ] Security Group allows port 443 (HTTPS) from 0.0.0.0/0
- [ ] You're in the correct region: **ap-south-1 (Mumbai)**

### Local Prerequisites
- [ ] Git installed on your machine
- [ ] Terminal/Command Prompt available
- [ ] Rohan.pem file accessible
- [ ] Internet connection working
- [ ] Can run bash scripts (Mac/Linux) or use Git Bash (Windows)

### Test Connection
```bash
# This must work before deployment
ssh -i "Rohan.pem" ubuntu@13.204.41.42

# If successful, you'll see:
# ubuntu@ip-xxx-xxx-xxx-xxx:~$
# Type 'exit' to disconnect
```

---

## 🚀 Automated Deployment

Once SSH works, run:

```bash
./deploy-to-ec2.sh
```

### What the Script Does:
1. ✅ Verifies SSH connectivity
2. ✅ Installs Docker & Docker Compose
3. ✅ Installs Git and utilities
4. ✅ Clones repository to server
5. ✅ Generates secure passwords
6. ✅ Configures environment variables
7. ✅ Creates nginx configuration
8. ✅ Builds Docker images
9. ✅ Starts all containers (PostgreSQL, Redis, Backend, Frontend, Nginx)
10. ✅ Initializes database
11. ✅ Verifies deployment
12. ✅ Shows you the results

**Duration**: 20-30 minutes

---

## 📖 Manual Deployment Alternative

If you prefer step-by-step control:

```bash
# Read the comprehensive guide
cat MANUAL_DEPLOYMENT_GUIDE.md

# Or view in your browser/editor
# Then follow each step carefully
```

**Duration**: 30-45 minutes

---

## 🧪 Testing Your Deployment

After deployment completes:

### 1. Check Container Status
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml ps"
```

Expected: 5 containers running

### 2. Test Backend Health
```bash
curl http://13.204.41.42:3001/health
```

Expected: `{"status":"ok"}`

### 3. Access Frontend
Open browser: http://13.204.41.42

Expected: React application loads

### 4. Check Logs
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml logs --tail=50"
```

Expected: No critical errors

---

## 📁 All Available Documentation

| File | Purpose | When to Use |
|------|---------|-------------|
| **START_HERE.md** | Main entry point | Read first |
| **CURRENT_STATUS.md** | Current progress | Check status |
| **QUICK_START.md** | 3-step quick guide | Fast deployment |
| **FIX_AWS_SECURITY_GROUP.md** | Fix port 22 | If SSH blocked |
| **SSH_BANNER_EXCHANGE_FIX.md** | Fix SSH issues | If SSH hangs |
| **DEPLOY_FROM_LOCAL_MACHINE.md** | This guide | Deploying locally |
| **DEPLOYMENT_README.md** | Complete overview | Full context |
| **DEPLOYMENT_STRATEGY.md** | Architecture & strategy | Deep dive |
| **MANUAL_DEPLOYMENT_GUIDE.md** | Step-by-step manual | Manual control |
| **DEPLOYMENT_COMPLETE_SUMMARY.md** | Full summary | Reference |

---

## 🔧 Common Issues & Solutions

### Issue 1: "SSH: Connection timed out"
**Solution**: 
- Check Security Group (port 22)
- Ensure instance is running
- Verify you're using correct IP

**Guide**: FIX_AWS_SECURITY_GROUP.md

### Issue 2: "Permission denied (publickey)"
**Solution**:
```bash
chmod 400 Rohan.pem
# Verify correct key pair in AWS Console
```

### Issue 3: "Port 22: Connection refused"
**Solution**: 
- Reboot EC2 instance
- Wait 3 minutes
- Retry connection

**Guide**: SSH_BANNER_EXCHANGE_FIX.md

### Issue 4: Docker build fails
**Solution**:
```bash
# On server, clean and retry
docker system prune -a
cd /opt/amazon-fdc-tool
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Issue 5: Out of memory
**Solution**:
- Increase EC2 instance size (t3.medium → t3.large)
- Or add swap space (instructions in MANUAL_DEPLOYMENT_GUIDE.md)

---

## 🎯 Deployment Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ YOUR LOCAL MACHINE                               │
│                                                  │
│  1. Clone repository                             │
│  2. Copy Rohan.pem                               │
│  3. Run: ./check-connection.sh                   │
│     └─→ Tests SSH connectivity                   │
│                                                  │
│  4. Run: ./deploy-to-ec2.sh                      │
│     ├─→ Connects via SSH                         │
│     ├─→ Installs dependencies                    │
│     ├─→ Configures environment                   │
│     └─→ Deploys Docker containers                │
└──────────────────┬──────────────────────────────┘
                   │ SSH Connection
                   ▼
┌─────────────────────────────────────────────────┐
│ EC2 SERVER (13.204.41.42)                        │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Docker Containers                         │  │
│  ├──────────────────────────────────────────┤  │
│  │ • Nginx (Port 80, 443)                    │  │
│  │ • Frontend (React)                        │  │
│  │ • Backend (Node.js + Express)             │  │
│  │ • PostgreSQL (Database)                   │  │
│  │ • Redis (Cache)                           │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ USERS ACCESS APPLICATION                         │
│                                                  │
│  http://13.204.41.42                             │
│  http://13.204.41.42:3001                        │
└─────────────────────────────────────────────────┘
```

---

## 💻 Platform-Specific Instructions

### macOS / Linux
```bash
# All scripts work directly
./check-connection.sh
./deploy-to-ec2.sh
```

### Windows
```bash
# Use Git Bash (comes with Git for Windows)
# Or WSL (Windows Subsystem for Linux)

# In Git Bash:
./check-connection.sh
./deploy-to-ec2.sh

# Or in PowerShell:
bash check-connection.sh
bash deploy-to-ec2.sh
```

---

## ✅ Success Criteria

Your deployment is successful when:

1. **SSH works**: `ssh -i "Rohan.pem" ubuntu@13.204.41.42` ✅
2. **Containers running**: All 5 containers show "Up" ✅
3. **Health check passes**: `curl http://13.204.41.42:3001/health` returns OK ✅
4. **Frontend loads**: http://13.204.41.42 shows the application ✅
5. **No errors in logs**: No critical errors ✅

---

## 🎊 After Successful Deployment

### Your Application URLs:
- **Frontend**: http://13.204.41.42
- **Backend API**: http://13.204.41.42:3001
- **API Health**: http://13.204.41.42:3001/health

### Common Operations:

**View Logs**:
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml logs -f"
```

**Restart Application**:
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml restart"
```

**Stop Application**:
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml down"
```

**Update Application**:
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 << 'EOF'
  cd /opt/amazon-fdc-tool
  git pull origin feature/docker-integration
  docker-compose -f docker-compose.prod.yml down
  docker-compose -f docker-compose.prod.yml build
  docker-compose -f docker-compose.prod.yml up -d
EOF
```

---

## 📞 Need Help?

### Quick References:
- **Connection issues**: FIX_AWS_SECURITY_GROUP.md
- **SSH problems**: SSH_BANNER_EXCHANGE_FIX.md
- **Step-by-step guide**: MANUAL_DEPLOYMENT_GUIDE.md
- **Full documentation**: DEPLOYMENT_STRATEGY.md

### Debug Commands:
```bash
# Test port
nc -zv 13.204.41.42 22

# Debug SSH
ssh -vvv -i "Rohan.pem" ubuntu@13.204.41.42

# Check Security Group
aws ec2 describe-security-groups --region ap-south-1

# Check instance status
aws ec2 describe-instances --region ap-south-1 \
  --filters "Name=ip-address,Values=13.204.41.42"
```

---

## 🚦 Current Status

**Port 22**: Currently CLOSED ❌

**Next Actions**:
1. Check if EC2 instance is running
2. Verify Security Group has port 22 rule
3. Ensure you're in ap-south-1 region
4. Test from your local machine

**From Your Local Machine**:
```bash
# Clone repository
git clone -b feature/docker-integration \
  https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git

# Navigate and test
cd Amazon-FDC-Tool-amazon-tool-v4
cp /path/to/Rohan.pem ./
chmod 400 Rohan.pem
./check-connection.sh
```

---

## 🎯 Summary

**What's Ready**:
- ✅ All deployment files and scripts
- ✅ Complete documentation (10 files)
- ✅ Docker configurations
- ✅ Environment templates
- ✅ Security best practices

**What You Need To Do**:
1. Ensure EC2 instance is running
2. Fix Security Group (port 22)
3. Clone repository to your local machine
4. Run: `./deploy-to-ec2.sh`

**Time Required**: ~30 minutes total

---

**Last Updated**: December 26, 2025  
**Server**: 13.204.41.42  
**Region**: ap-south-1 (Mumbai)  
**Status**: Ready for deployment from your local machine  
**Deployment Method**: Automated script or manual guide available
