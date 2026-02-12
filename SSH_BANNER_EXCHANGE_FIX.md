# 🔧 Fix: SSH Banner Exchange Timeout

## ✅ Current Status

**Progress Made**: ✓ Port 22 is now OPEN (Security Group fixed!)

**Current Issue**: SSH times out during "banner exchange"
```
Connection timed out during banner exchange
```

## 🔍 What This Means

- ✅ **Security Group is correct** - Port 22 is accessible
- ✅ **TCP connection works** - We can reach port 22
- ❌ **SSH service not responding** - Service issue on the instance

## 🎯 Possible Causes

1. **SSH service is not running** (most common)
2. **Instance needs restart**
3. **SSH service is misconfigured**
4. **Resource exhaustion** (CPU/Memory)
5. **Network ACL blocking**
6. **Wrong instance state**

## 🚀 Solutions (Try in Order)

### Solution 1: Restart EC2 Instance (Recommended)

This often fixes SSH banner exchange issues.

#### Using AWS Console:
1. Go to: https://console.aws.amazon.com/ec2/
2. Select region: **ap-south-1 (Mumbai)**
3. Click **Instances**
4. Find instance: **13.204.41.42**
5. Select it (checkbox)
6. Click **Instance state** → **Reboot instance**
7. Confirm the reboot
8. Wait 2-3 minutes

#### Using AWS CLI:
```bash
# Find instance ID
INSTANCE_ID=$(aws ec2 describe-instances \
  --region ap-south-1 \
  --filters "Name=ip-address,Values=13.204.41.42" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text)

echo "Instance ID: $INSTANCE_ID"

# Reboot instance
aws ec2 reboot-instances --region ap-south-1 --instance-ids $INSTANCE_ID

echo "Instance rebooting... wait 2-3 minutes"
```

#### After Reboot:
Wait 2-3 minutes, then test:
```bash
ssh -i "Rohan.pem" ubuntu@13.204.41.42
```

---

### Solution 2: Check Instance Status

#### AWS Console:
1. Go to EC2 → Instances
2. Find your instance (13.204.41.42)
3. Check:
   - **Instance state**: Should be "running" (green)
   - **Status checks**: Should be "2/2 checks passed"
   - **System status**: OK
   - **Instance status**: OK

If status checks fail, the instance has a problem.

#### AWS CLI:
```bash
# Check instance status
aws ec2 describe-instance-status \
  --region ap-south-1 \
  --instance-ids $INSTANCE_ID

# If instance is stopped, start it
aws ec2 start-instances \
  --region ap-south-1 \
  --instance-ids $INSTANCE_ID
```

---

### Solution 3: Connect via AWS Session Manager

If SSH still doesn't work, you can access the instance via AWS Session Manager:

#### Prerequisites:
- SSM agent must be installed on instance
- Instance must have IAM role with SSM permissions

#### Using AWS Console:
1. Go to EC2 → Instances
2. Select your instance
3. Click **Connect** button (top)
4. Choose **Session Manager** tab
5. Click **Connect**

This opens a web-based terminal to your instance.

#### From Terminal, Fix SSH:
```bash
# Check if SSH is running
sudo systemctl status sshd

# Start SSH if stopped
sudo systemctl start sshd

# Enable SSH to start on boot
sudo systemctl enable sshd

# Restart SSH service
sudo systemctl restart sshd

# Check SSH config
sudo sshd -t
```

---

### Solution 4: Check Network ACLs

Network ACLs can block traffic even if Security Groups allow it.

#### AWS Console:
1. Go to VPC → Network ACLs
2. Find the ACL associated with your instance's subnet
3. Check **Inbound Rules**:
   - Rule for port 22 (SSH) should exist
   - Action should be "ALLOW"
   - Source should include your IP or 0.0.0.0/0

4. Check **Outbound Rules**:
   - Should allow ephemeral ports (1024-65535)
   - Or allow all traffic

#### Default Network ACL:
If unsure, use the default Network ACL which allows all traffic.

---

### Solution 5: Try Alternative SSH Port

Some instances may have SSH on a different port.

```bash
# Try port 2222
ssh -i "your-key.pem" -p 2222 ubuntu@your-ec2-host.compute.amazonaws.com

# Try port 22222
ssh -i "your-key.pem" -p 22222 ubuntu@your-ec2-host.compute.amazonaws.com
```

---

### Solution 6: Check Instance Logs

#### AWS Console:
1. Go to EC2 → Instances
2. Select your instance
3. Click **Actions** → **Monitor and troubleshoot** → **Get system log**
4. Look for errors related to SSH or sshd

#### AWS CLI:
```bash
# Get console output
aws ec2 get-console-output \
  --region ap-south-1 \
  --instance-id $INSTANCE_ID \
  --output text
```

Look for:
- SSH service start failures
- Port conflicts
- Permission errors
- Configuration errors

---

### Solution 7: Verify SSH Key Pair

Make sure you're using the correct key pair:

#### Check Instance Key Pair Name:
```bash
# AWS CLI
aws ec2 describe-instances \
  --region ap-south-1 \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].KeyName' \
  --output text
```

This should return the key pair name. Verify it matches your PEM file.

#### If Key Doesn't Match:
You may need to:
1. Create a new instance with the correct key
2. Or use AWS Session Manager to add your public key

---

### Solution 8: Use EC2 Instance Connect

For Amazon Linux 2 or Ubuntu 16.04+:

#### AWS Console:
1. Go to EC2 → Instances
2. Select your instance
3. Click **Connect** button
4. Choose **EC2 Instance Connect** tab
5. Click **Connect**

#### AWS CLI:
```bash
# Install EC2 Instance Connect CLI
pip install ec2instanceconnectcli

# Connect
mssh ubuntu@$INSTANCE_ID --region ap-south-1
```

---

## 🧪 Test SSH Connection

After trying any solution, test with:

```bash
# Basic test
ssh -i "Rohan.pem" ubuntu@13.204.41.42

# Verbose test (see what's happening)
ssh -vvv -i "Rohan.pem" ubuntu@13.204.41.42

# Quick command test
ssh -i "Rohan.pem" ubuntu@13.204.41.42 "echo Connection works"
```

---

## 📊 Diagnostic Commands

### From Your Local Machine:

```bash
# Test port 22 connectivity
nc -zv 13.204.41.42 22

# Test with telnet
telnet 13.204.41.42 22

# Detailed SSH debug
ssh -vvv -i "Rohan.pem" ubuntu@13.204.41.42 2>&1 | tee ssh-debug.log
```

### Check Current Status:

```bash
# Port status
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/13.204.41.42/22' && echo "Port 22 OPEN" || echo "Port 22 CLOSED"

# Security Group
aws ec2 describe-security-groups \
  --region ap-south-1 \
  --filters "Name=ip-permission.from-port,Values=22"
```

---

## ✅ Success Criteria

SSH is working when you see:

```bash
$ ssh -i "Rohan.pem" ubuntu@13.204.41.42
Welcome to Ubuntu 22.04.x LTS (GNU/Linux ...)

ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

---

## 🎯 Recommended Solution Path

**For most cases, this is the quickest fix:**

1. **Reboot the instance** (via AWS Console)
   - Takes 2-3 minutes
   - Fixes 80% of banner exchange issues

2. **Wait 3 minutes** for instance to fully boot

3. **Test SSH connection**:
   ```bash
   ssh -i "Rohan.pem" ubuntu@13.204.41.42
   ```

4. **If still fails**, use **Session Manager** to access instance and fix SSH service

---

## 🆘 Still Not Working?

### Option A: Launch New Instance

If the instance is broken, consider launching a new one:

1. Take a snapshot of current instance (if has data)
2. Launch new EC2 instance:
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Same key pair (Rohan)
   - Proper Security Group (port 22, 80, 443 open)
3. Deploy application on new instance

### Option B: Use Session Manager

Access via AWS Session Manager and manually fix SSH:

```bash
# In Session Manager terminal:
sudo systemctl restart sshd
sudo systemctl status sshd
sudo tail -f /var/log/auth.log
```

### Option C: Recreate Instance from AMI

If you have an AMI:
1. Go to AMIs
2. Launch instance from AMI
3. Use correct key pair
4. Configure Security Group properly

---

## 📋 Verification Checklist

- [ ] Port 22 is open (Security Group)
- [ ] Instance is in "running" state
- [ ] Status checks pass (2/2)
- [ ] Correct key pair being used
- [ ] Correct username (ubuntu for Ubuntu)
- [ ] PEM file has 400 permissions
- [ ] Network ACL allows port 22
- [ ] SSH service is running on instance

---

## 🔄 Alternative Deployment Approach

If SSH continues to fail, you can:

1. **Use AWS CodeDeploy** - Deploy without SSH
2. **Use AWS ECS** - Deploy with Docker containers
3. **Use AWS Elastic Beanstalk** - Managed deployment
4. **Use EC2 User Data** - Script runs on instance startup

For this project, let me know if you'd like me to create a deployment script using AWS Systems Manager (no SSH required).

---

## 📞 Next Steps

**Immediate action:**

1. **Reboot the EC2 instance** in AWS Console
2. **Wait 3 minutes**
3. **Test SSH**: `ssh -i "Rohan.pem" ubuntu@13.204.41.42`

If that works → Proceed with deployment: `./deploy-to-ec2.sh`

If that fails → Try Session Manager or create new instance

---

## 💡 Quick Commands Reference

```bash
# Test connection
ssh -i "Rohan.pem" ubuntu@13.204.41.42

# Debug connection
ssh -vvv -i "Rohan.pem" ubuntu@13.204.41.42

# Check port
nc -zv 13.204.41.42 22

# Get instance ID
aws ec2 describe-instances \
  --region ap-south-1 \
  --filters "Name=ip-address,Values=13.204.41.42" \
  --query 'Reservations[0].Instances[0].InstanceId'

# Reboot instance
aws ec2 reboot-instances \
  --region ap-south-1 \
  --instance-ids i-xxxxxxxxxxxxx
```

---

**Status**: Port 22 is OPEN ✓  
**Issue**: SSH banner exchange timeout  
**Recommended Fix**: Reboot EC2 instance  
**Time**: 5 minutes  
**Success Rate**: 80%+

---

**Last Updated**: December 26, 2025  
**Server**: 13.204.41.42  
**Region**: ap-south-1 (Mumbai)
