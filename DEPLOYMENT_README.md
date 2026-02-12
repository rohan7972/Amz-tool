# 🚀 Amazon FDC Tool - Deployment Instructions

## ⚠️ Important Notice

**SSH Connection Issue Detected**: The deployment container cannot directly connect to your EC2 server at 13.204.41.42. This is likely due to AWS Security Group restrictions.

**Solution**: You need to deploy from your **local machine** where you have SSH access configured.

---

## 📦 What's Been Prepared

All deployment files and scripts have been created and are ready for you to use:

### ✅ Documentation Created
1. **DEPLOYMENT_STRATEGY.md** - Comprehensive deployment strategy and architecture
2. **MANUAL_DEPLOYMENT_GUIDE.md** - Step-by-step manual deployment instructions
3. **DEPLOYMENT_README.md** - This file with quick start instructions

### ✅ Scripts Created
1. **deploy-to-ec2.sh** - Automated deployment script
2. All necessary Docker configurations are in place

### ✅ Project Status
- ✅ Full-stack application ready (React + Node.js + PostgreSQL + Redis)
- ✅ Docker Compose production configuration ready
- ✅ Database migrations prepared
- ✅ Nginx reverse proxy configured
- ✅ Health checks implemented
- ✅ Environment configuration templates ready

---

## 🎯 Quick Deployment Options

### Option 1: Automated Deployment (Recommended) ⚡

**From your local machine:**

```bash
# 1. Make sure you're in the project directory
cd /path/to/Amazon-FDC-Tool-amazon-tool-v4

# 2. Ensure your PEM file is in the correct location
# Copy Rohan.pem to the project root if it's not already there

# 3. Run the automated deployment script
./deploy-to-ec2.sh
```

The script will:
- ✅ Verify SSH connectivity
- ✅ Install Docker, Docker Compose, and Git on the server
- ✅ Clone the repository
- ✅ Generate secure passwords
- ✅ Configure environment variables
- ✅ Build and deploy all containers
- ✅ Initialize the database
- ✅ Verify the deployment

**Estimated Time**: 20-30 minutes

---

### Option 2: Manual Deployment (Detailed Control) 🛠️

**Follow the detailed guide:**

```bash
# Open the manual deployment guide
cat MANUAL_DEPLOYMENT_GUIDE.md

# Or follow these quick steps:
```

1. **Connect to EC2**:
   ```bash
   ssh -i "Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com
   ```

2. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu
   sudo apt install -y docker-compose git
   exit  # Logout and login again
   ```

3. **Clone Repository**:
   ```bash
   sudo mkdir -p /opt/amazon-fdc-tool
   sudo chown ubuntu:ubuntu /opt/amazon-fdc-tool
   cd /opt/amazon-fdc-tool
   git clone -b feature/docker-integration https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git .
   ```

4. **Configure Environment**:
   ```bash
   # Generate secure passwords
   DB_PASSWORD=$(openssl rand -base64 32)
   REDIS_PASSWORD=$(openssl rand -base64 32)
   JWT_SECRET=$(openssl rand -base64 48)
   JWT_REFRESH_SECRET=$(openssl rand -base64 48)
   
   # Create .env file
   cat > .env << EOF
   DB_USER=amazon_fdc_user
   DB_PASSWORD=$DB_PASSWORD
   POSTGRES_PASSWORD=$DB_PASSWORD
   REDIS_PASSWORD=$REDIS_PASSWORD
   JWT_SECRET=$JWT_SECRET
   JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
   AMAZON_CLIENT_ID=sandbox
   AMAZON_CLIENT_SECRET=sandbox
   AMAZON_ADVERTISING_CLIENT_ID=sandbox
   AMAZON_ADVERTISING_CLIENT_SECRET=sandbox
   REACT_APP_API_URL=http://13.204.41.42:3001
   EOF
   chmod 600 .env
   ```

5. **Deploy**:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

6. **Verify**:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   curl http://localhost:3001/health
   ```

**Estimated Time**: 30-45 minutes

---

## 🔍 Pre-Deployment Checklist

Before you start, make sure:

- [ ] **AWS Security Group** is configured:
  - Port 22 (SSH) - Your IP address
  - Port 80 (HTTP) - 0.0.0.0/0 (all IPs)
  - Port 443 (HTTPS) - 0.0.0.0/0 (all IPs)
  - Port 3001 (Backend API) - 0.0.0.0/0 (optional, for testing)

- [ ] **EC2 Instance** is running:
  - Instance ID: Check in AWS Console
  - Instance state: Should be "running"
  - Instance type: t3.medium or better recommended

- [ ] **Local Machine** has:
  - SSH access to EC2 (test: `ssh -i "Rohan.pem" ubuntu@13.204.41.42`)
  - Git installed
  - Internet connection
  - Rohan.pem file with correct permissions (chmod 400)

- [ ] **Repository Access**:
  - Can clone from GitHub
  - On correct branch: feature/docker-integration

---

## 🔐 Configure AWS Security Group

### Method 1: AWS Console (Web Interface)

1. Go to **AWS Console** → **EC2** → **Security Groups**
2. Find the security group attached to instance at 13.204.41.42
3. Click **Edit inbound rules**
4. Add/Verify these rules:
   ```
   Type        Protocol  Port Range  Source          Description
   SSH         TCP       22          My IP           SSH access
   HTTP        TCP       80          0.0.0.0/0       Web traffic
   HTTPS       TCP       443         0.0.0.0/0       Secure web traffic
   Custom TCP  TCP       3001        0.0.0.0/0       Backend API (optional)
   Custom TCP  TCP       5432        0.0.0.0/0       PostgreSQL (NOT recommended for production)
   ```
5. Click **Save rules**

### Method 2: AWS CLI

```bash
# Get your current IP
MY_IP=$(curl -s https://checkip.amazonaws.com)

# Get security group ID
SG_ID="sg-xxxxxxxxx"  # Replace with your security group ID

# Add rules
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_IP/32
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 3001 --cidr 0.0.0.0/0
```

---

## 🧪 Test SSH Connection First

**Before starting deployment, test your SSH connection:**

```bash
# From your local machine
ssh -i "Rohan.pem" ubuntu@ec2-13-204-41-42.ap-south-1.compute.amazonaws.com

# If this works, you'll see:
# ubuntu@ip-xxx-xxx-xxx-xxx:~$

# Test with the IP address directly
ssh -i "Rohan.pem" ubuntu@13.204.41.42
```

**If SSH fails:**
1. ✅ Check AWS Security Group (port 22 must be open to your IP)
2. ✅ Verify EC2 instance is running (check AWS Console)
3. ✅ Ensure PEM file permissions are correct: `chmod 400 Rohan.pem`
4. ✅ Verify you're using the correct PEM file
5. ✅ Try connecting from a different network

---

## 🚀 Deploy Now

### Using Automated Script

```bash
# Clone this repository to your local machine (if you haven't already)
git clone -b feature/docker-integration https://github.com/r2w34/Amazon-FDC-Tool-amazon-tool-v4.git
cd Amazon-FDC-Tool-amazon-tool-v4

# Copy your PEM file to the project root
cp /path/to/Rohan.pem ./

# Set permissions
chmod 400 Rohan.pem

# Run deployment script
./deploy-to-ec2.sh
```

### Using Manual Steps

Follow the **MANUAL_DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions.

---

## 📊 After Deployment

Once deployment is complete, your application will be available at:

- **Frontend**: http://13.204.41.42
- **Backend API**: http://13.204.41.42:3001
- **Health Check**: http://13.204.41.42:3001/health

### Verify Deployment

```bash
# Check container status
ssh -i "Rohan.pem" ubuntu@13.204.41.42 "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml ps"

# View logs
ssh -i "Rohan.pem" ubuntu@13.204.41.42 "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml logs --tail=50"

# Test health endpoint
curl http://13.204.41.42:3001/health
```

Expected response: `{"status":"ok","timestamp":"..."}`

---

## 🔄 Common Operations

### View Logs
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml logs -f"
```

### Restart Services
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml restart"
```

### Stop Services
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42 \
  "cd /opt/amazon-fdc-tool && docker-compose -f docker-compose.prod.yml down"
```

### Update Application
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

## 📖 Additional Documentation

- **DEPLOYMENT_STRATEGY.md** - Complete deployment strategy, architecture diagrams, security, monitoring
- **MANUAL_DEPLOYMENT_GUIDE.md** - Detailed step-by-step manual deployment with troubleshooting
- **README.md** - Project overview and features
- **docs/** - Additional technical documentation

---

## 🆘 Troubleshooting

### Issue: SSH Connection Timeout

**Symptoms**: `ssh: connect to host 13.204.41.42 port 22: Connection timed out`

**Solutions**:
1. Check AWS Security Group - ensure port 22 is open to your IP
2. Verify EC2 instance is running
3. Check VPC and subnet configuration
4. Try from a different network

### Issue: Docker Not Found

**Symptoms**: `docker: command not found`

**Solution**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
exit  # Logout and login again
```

### Issue: Permission Denied

**Symptoms**: `permission denied (publickey)`

**Solution**:
```bash
# Check PEM file permissions
chmod 400 Rohan.pem

# Verify you're using the correct PEM file
# Verify the EC2 key pair name matches in AWS Console
```

### Issue: Port Already in Use

**Symptoms**: `Error starting userland proxy: listen tcp: address already in use`

**Solution**:
```bash
# Find process using the port
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>

# Or stop existing containers
docker-compose -f docker-compose.prod.yml down
```

---

## 📞 Need Help?

1. **Check Logs**: `docker-compose -f docker-compose.prod.yml logs`
2. **Read Documentation**: Check DEPLOYMENT_STRATEGY.md and MANUAL_DEPLOYMENT_GUIDE.md
3. **Verify Prerequisites**: Ensure all checklist items are complete
4. **AWS Support**: Check EC2 instance status and security groups

---

## ✅ Success Criteria

Your deployment is successful when:

- [ ] All Docker containers are running (5 containers)
- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend loads in browser at http://13.204.41.42
- [ ] No critical errors in logs
- [ ] Database is initialized and accessible
- [ ] API endpoints respond correctly

---

## 🎉 You're Ready!

Everything is prepared and ready for deployment. Choose your method:

1. **Quick & Easy**: Run `./deploy-to-ec2.sh` from your local machine
2. **Manual Control**: Follow MANUAL_DEPLOYMENT_GUIDE.md step by step

**Remember**: You must deploy from a machine that can SSH into the EC2 server!

---

**Prepared**: December 26, 2025  
**Target Server**: 13.204.41.42 (ec2-13-204-41-42.ap-south-1.compute.amazonaws.com)  
**Branch**: feature/docker-integration  
**Status**: Ready for Deployment 🚀
