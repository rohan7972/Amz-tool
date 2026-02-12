# 🔓 Fix AWS Security Group - Enable SSH Access

## ⚠️ Current Issue

**Error**: `Connection to 13.204.41.42 port 22 timed out`

**Cause**: AWS Security Group is blocking SSH connections to your EC2 instance.

**Solution**: Open port 22 in the Security Group to allow SSH access.

---

## 🎯 Quick Fix (5 Minutes)

### Option 1: AWS Console (Web Interface) - Recommended

#### Step 1: Go to AWS Console

1. Open your web browser
2. Navigate to: https://console.aws.amazon.com/ec2/
3. Sign in with your AWS credentials
4. **Select Region**: Make sure you're in **ap-south-1 (Mumbai)** region (top-right corner)

#### Step 2: Find Your EC2 Instance

1. In the left sidebar, click **Instances**
2. Find your instance with IP **13.204.41.42**
3. Click on the instance to select it
4. Look at the bottom panel, find **Security** tab
5. Note the **Security group name** (e.g., `sg-xxxxxxxxx`)

#### Step 3: Edit Security Group

1. Click on the security group name (it's a link)
2. This will open the Security Groups page
3. Click the **Inbound rules** tab
4. Click **Edit inbound rules** button

#### Step 4: Add SSH Rule

1. Click **Add rule**
2. Configure the rule:
   ```
   Type:   SSH
   Protocol:   TCP
   Port Range:   22
   Source:   My IP  (This will auto-detect your current IP)
   Description:   SSH access from my location
   ```
3. Click **Save rules**

#### Step 5: Verify

Wait 10-20 seconds for the rule to take effect, then test:

```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42
```

**Expected**: You should now be able to connect! ✅

---

### Option 2: AWS CLI (Command Line)

If you have AWS CLI configured:

```bash
# Get your current public IP
MY_IP=$(curl -s https://checkip.amazonaws.com)
echo "Your IP: $MY_IP"

# Find your security group ID
INSTANCE_ID=$(aws ec2 describe-instances \
  --region ap-south-1 \
  --filters "Name=ip-address,Values=13.204.41.42" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text)

echo "Instance ID: $INSTANCE_ID"

# Get security group ID
SG_ID=$(aws ec2 describe-instances \
  --region ap-south-1 \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' \
  --output text)

echo "Security Group ID: $SG_ID"

# Add SSH rule
aws ec2 authorize-security-group-ingress \
  --region ap-south-1 \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr $MY_IP/32

echo "✓ SSH access enabled for your IP: $MY_IP"

# Test connection
ssh -i "Rohan.pem" ubuntu@13.204.41.42
```

---

## 🔐 Complete Security Group Configuration

For full application functionality, you need these rules:

### Required Inbound Rules

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web traffic |
| Custom TCP | TCP | 3001 | 0.0.0.0/0 | Backend API (optional) |

### AWS Console Configuration

1. Go to **EC2 → Security Groups**
2. Select your security group
3. Click **Edit inbound rules**
4. Add all rules above
5. Click **Save rules**

### AWS CLI Configuration

```bash
# Variables
REGION="ap-south-1"
MY_IP=$(curl -s https://checkip.amazonaws.com)
SG_ID="sg-xxxxxxxxx"  # Replace with your security group ID

# Add SSH (your IP only)
aws ec2 authorize-security-group-ingress \
  --region $REGION \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr $MY_IP/32

# Add HTTP (all IPs)
aws ec2 authorize-security-group-ingress \
  --region $REGION \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Add HTTPS (all IPs)
aws ec2 authorize-security-group-ingress \
  --region $REGION \
  --group-id $SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Add Backend API (all IPs) - Optional
aws ec2 authorize-security-group-ingress \
  --region $REGION \
  --group-id $SG_ID \
  --protocol tcp \
  --port 3001 \
  --cidr 0.0.0.0/0

echo "✓ All security rules configured!"
```

---

## 🧪 Test Your Configuration

### Test 1: Check Port 22 (SSH)
```bash
# Test if port 22 is open
nc -zv 13.204.41.42 22

# Expected output:
# Connection to 13.204.41.42 22 port [tcp/ssh] succeeded!
```

### Test 2: SSH Connection
```bash
# Test SSH connection
ssh -i "Rohan.pem" ubuntu@13.204.41.42 "echo 'SSH works!'"

# Expected output:
# SSH works!
```

### Test 3: Run Connection Check Script
```bash
# Run the comprehensive check
./check-connection.sh

# Expected output:
# ✓ All checks passed!
```

---

## 🐛 Still Not Working?

### Checklist

- [ ] **EC2 Instance is Running**
  - Go to AWS Console → EC2 → Instances
  - Instance state should be "running" (green dot)
  - If stopped, select it and click "Start instance"

- [ ] **Correct Region Selected**
  - Ensure you're in **ap-south-1 (Mumbai)** region
  - Check the region selector in top-right of AWS Console

- [ ] **Correct Security Group**
  - Verify you're editing the security group attached to this instance
  - Instance may have multiple security groups

- [ ] **Rule Applied**
  - Wait 30-60 seconds after adding rules
  - AWS needs time to propagate changes

- [ ] **Your IP Hasn't Changed**
  - Check your current IP: `curl https://checkip.amazonaws.com`
  - If using VPN, your IP may change
  - Use 0.0.0.0/0 for testing (less secure, but confirms it works)

- [ ] **Correct PEM File**
  - Verify you're using the correct key pair file
  - Check in AWS Console: EC2 → Instances → Key pair name
  - Must match your Rohan.pem file

- [ ] **PEM File Permissions**
  - Run: `chmod 400 Rohan.pem`
  - Verify: `ls -la Rohan.pem` should show `-r--------`

---

## 🔄 Alternative: Temporary Wide-Open Access

**For testing only** - not recommended for production:

```bash
# Allow SSH from anywhere (NOT SECURE - for testing only)
aws ec2 authorize-security-group-ingress \
  --region ap-south-1 \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0
```

This opens SSH to the entire internet. Only use this to test if Security Group is the issue, then **immediately change it back** to your specific IP.

**To change back:**
```bash
# Remove the wide-open rule
aws ec2 revoke-security-group-ingress \
  --region ap-south-1 \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

# Add your specific IP
MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \
  --region ap-south-1 \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr $MY_IP/32
```

---

## 📸 Visual Guide (AWS Console)

### Step-by-Step Screenshots Guide

1. **AWS Console Login**
   - Go to: https://console.aws.amazon.com/ec2/
   - Select region: **ap-south-1 (Mumbai)**

2. **Find Instance**
   ```
   EC2 Dashboard
   └── Instances (running)
       └── Find instance with IP: 13.204.41.42
           └── Click on it
   ```

3. **Find Security Group**
   ```
   Instance Details (bottom panel)
   └── Security tab
       └── Security groups
           └── Click on the security group name (blue link)
   ```

4. **Edit Inbound Rules**
   ```
   Security Group Details
   └── Inbound rules tab
       └── "Edit inbound rules" button
           └── "Add rule" button
   ```

5. **Add SSH Rule**
   ```
   Type: SSH
   Protocol: TCP (auto-filled)
   Port Range: 22 (auto-filled)
   Source: My IP (recommended)
   Description: SSH access from my location
   
   [Save rules] button
   ```

---

## 🎯 After Fixing Security Group

Once SSH access is working:

1. **Test Connection**
   ```bash
   ./check-connection.sh
   ```

2. **Deploy Application**
   ```bash
   ./deploy-to-ec2.sh
   ```

3. **Verify Deployment**
   ```bash
   curl http://13.204.41.42:3001/health
   ```

---

## 📞 Get Help

### Check Current Rules

```bash
# Using AWS CLI
aws ec2 describe-security-groups \
  --region ap-south-1 \
  --group-ids $SG_ID

# Or check in AWS Console
# EC2 → Security Groups → Select your group → Inbound rules tab
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection timed out` | Security Group blocks port | Add inbound rule for port 22 |
| `Permission denied (publickey)` | Wrong PEM file or permissions | Verify PEM file, run `chmod 400` |
| `Host key verification failed` | SSH key changed | Run `ssh-keygen -R 13.204.41.42` |
| `Network unreachable` | Instance not running | Start instance in AWS Console |

---

## ✅ Success Criteria

You've successfully fixed the Security Group when:

- [ ] `nc -zv 13.204.41.42 22` shows "succeeded"
- [ ] `./check-connection.sh` passes all checks
- [ ] `ssh -i "Rohan.pem" ubuntu@13.204.41.42` connects successfully

---

## 🚀 Next Steps

After fixing SSH access:

1. Run connection test: `./check-connection.sh`
2. Deploy application: `./deploy-to-ec2.sh`
3. Access application: http://13.204.41.42

---

**Need More Help?**

1. Check AWS Documentation: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html
2. Review: DEPLOYMENT_README.md
3. Follow: MANUAL_DEPLOYMENT_GUIDE.md

---

**Remember**: Security Group changes take effect immediately, but allow 10-30 seconds for propagation.

**Last Updated**: December 26, 2025  
**Region**: ap-south-1 (Mumbai)  
**Instance IP**: 13.204.41.42
