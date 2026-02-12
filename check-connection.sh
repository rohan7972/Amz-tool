#!/bin/bash

###############################################################################
# Connection Test Script
# Tests SSH connectivity and provides troubleshooting steps
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# IMPORTANT: Update these values before running this script
EC2_HOST="${EC2_HOST:-your-ec2-host.compute.amazonaws.com}"
EC2_IP="${EC2_IP:-xxx.xxx.xxx.xxx}"
PEM_FILE="${PEM_FILE:-./path/to/your-key.pem}"

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Amazon FDC Tool - Connection Test${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Check 1: PEM file exists
echo -e "${BLUE}[1/6] Checking PEM file...${NC}"
if [ -f "$PEM_FILE" ]; then
    echo -e "${GREEN}✓ PEM file found: $PEM_FILE${NC}"
else
    echo -e "${RED}✗ PEM file not found: $PEM_FILE${NC}"
    echo -e "${YELLOW}  → Copy your PEM file to: $(pwd)/$PEM_FILE${NC}"
    exit 1
fi

# Check 2: PEM file permissions
echo -e "${BLUE}[2/6] Checking PEM file permissions...${NC}"
PERMS=$(stat -c %a "$PEM_FILE" 2>/dev/null || stat -f %A "$PEM_FILE" 2>/dev/null)
if [ "$PERMS" = "400" ]; then
    echo -e "${GREEN}✓ PEM file permissions are correct (400)${NC}"
else
    echo -e "${YELLOW}⚠ Fixing PEM file permissions...${NC}"
    chmod 400 "$PEM_FILE"
    echo -e "${GREEN}✓ PEM file permissions set to 400${NC}"
fi

# Check 3: Internet connectivity
echo -e "${BLUE}[3/6] Checking internet connectivity...${NC}"
if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Internet connection is working${NC}"
else
    echo -e "${RED}✗ No internet connection${NC}"
    exit 1
fi

# Check 4: DNS resolution
echo -e "${BLUE}[4/6] Checking DNS resolution...${NC}"
if nslookup $EC2_HOST >/dev/null 2>&1; then
    echo -e "${GREEN}✓ DNS resolution working${NC}"
else
    echo -e "${YELLOW}⚠ DNS resolution failed, will try IP address${NC}"
fi

# Check 5: Port 22 connectivity
echo -e "${BLUE}[5/6] Checking port 22 connectivity...${NC}"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$EC2_IP/22" 2>/dev/null; then
    echo -e "${GREEN}✓ Port 22 is open and accessible${NC}"
else
    echo -e "${RED}✗ Cannot connect to port 22${NC}"
    echo -e "${YELLOW}  This usually means:${NC}"
    echo -e "${YELLOW}  1. AWS Security Group doesn't allow SSH from your IP${NC}"
    echo -e "${YELLOW}  2. EC2 instance is not running${NC}"
    echo -e "${YELLOW}  3. Network firewall is blocking the connection${NC}"
    echo ""
    echo -e "${BLUE}  To fix this:${NC}"
    echo -e "  1. Go to AWS Console → EC2 → Security Groups"
    echo -e "  2. Find the security group for this instance"
    echo -e "  3. Add inbound rule: Type=SSH, Port=22, Source=My IP"
    echo ""
    exit 1
fi

# Check 6: SSH connectivity
echo -e "${BLUE}[6/6] Testing SSH connection...${NC}"
if ssh -i "$PEM_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_IP" "echo 'SSH connection successful'" 2>/dev/null; then
    echo -e "${GREEN}✓ SSH connection successful!${NC}"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ All checks passed!${NC}"
    echo -e "${GREEN}  You can proceed with deployment.${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Run: ${GREEN}./deploy-to-ec2.sh${NC}"
    echo -e "  2. Or follow: ${GREEN}MANUAL_DEPLOYMENT_GUIDE.md${NC}"
    echo ""
else
    echo -e "${RED}✗ SSH connection failed${NC}"
    echo ""
    echo -e "${YELLOW}Possible issues:${NC}"
    echo -e "  1. Wrong PEM file (not matching EC2 key pair)"
    echo -e "  2. Wrong username (should be 'ubuntu' for Ubuntu instances)"
    echo -e "  3. EC2 instance is not running"
    echo -e "  4. Security group blocks SSH from your IP"
    echo ""
    echo -e "${BLUE}Troubleshooting steps:${NC}"
    echo -e "  1. Verify instance is running in AWS Console"
    echo -e "  2. Check Security Group inbound rules"
    echo -e "  3. Verify PEM file matches the EC2 key pair"
    echo -e "  4. Try from a different network"
    echo ""
    echo -e "${BLUE}Get your current IP:${NC}"
    MY_IP=$(curl -s https://checkip.amazonaws.com)
    echo -e "  Your IP: ${GREEN}$MY_IP${NC}"
    echo -e "  Add this IP to Security Group inbound rules"
    echo ""
    exit 1
fi
