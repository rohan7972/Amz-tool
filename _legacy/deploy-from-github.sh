#!/bin/bash

# Deploy Enhanced UI from GitHub Repository
# This script pulls the latest enhanced UI from GitHub and deploys it

set -e

echo "🎨 Deploying Enhanced UI from GitHub"
echo "===================================="

# Server details
SERVER_IP="35.200.168.177"
SERVER_USER="root"
REPO_URL="https://github.com/r2w34/Amazon-FDC-Tool.git"
BRANCH="feature/enhanced-ui-animations"
REMOTE_APP_DIR="/opt/amazon-fdc-tool"
REMOTE_WEB_DIR="/var/www/html"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create deployment commands to run on server
DEPLOY_COMMANDS="
set -e
echo '🎨 Starting Enhanced UI deployment on server...'

# Navigate to app directory or create it
if [ ! -d '$REMOTE_APP_DIR' ]; then
    echo 'Creating application directory...'
    mkdir -p $REMOTE_APP_DIR
    cd $REMOTE_APP_DIR
    git clone $REPO_URL .
else
    echo 'Updating existing repository...'
    cd $REMOTE_APP_DIR
    git fetch origin
fi

# Checkout the enhanced UI branch
echo 'Checking out enhanced UI branch...'
git checkout $BRANCH
git pull origin $BRANCH

# Install dependencies if needed
echo 'Installing frontend dependencies...'
cd frontend
npm install --legacy-peer-deps

# Build the enhanced UI
echo 'Building enhanced UI...'
npm run build

# Backup current web files
echo 'Creating backup of current web files...'
if [ -d '$REMOTE_WEB_DIR' ]; then
    cp -r $REMOTE_WEB_DIR $REMOTE_WEB_DIR.backup.\$(date +%Y%m%d_%H%M%S)
fi

# Deploy enhanced UI files
echo 'Deploying enhanced UI files...'
rm -rf $REMOTE_WEB_DIR/*
cp -r dist/* $REMOTE_WEB_DIR/

# Set proper permissions
echo 'Setting proper permissions...'
chown -R www-data:www-data $REMOTE_WEB_DIR
chmod -R 755 $REMOTE_WEB_DIR

# Restart nginx
echo 'Restarting nginx...'
systemctl reload nginx

echo '✅ Enhanced UI deployment completed!'
echo 'Server: http://$SERVER_IP'
echo 'Enhanced UI features:'
echo '  • Framer Motion animations'
echo '  • Glassmorphism effects'
echo '  • Staggered KPI card animations'
echo '  • Interactive hover effects'
"

print_status "Connecting to server and deploying enhanced UI..."

# Execute deployment commands on server
if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "$DEPLOY_COMMANDS"; then
    print_status "✅ Enhanced UI deployed successfully!"
    echo ""
    echo "🎉 Deployment Summary:"
    echo "  • Server: http://$SERVER_IP"
    echo "  • Branch: $BRANCH"
    echo "  • Enhanced UI: ✅ Active"
    echo "  • Animations: ✅ Framer Motion loaded"
    echo "  • Design: ✅ Glassmorphism effects"
    echo ""
    print_warning "Please test the enhanced UI in your browser:"
    print_warning "  → Login form should show animated background"
    print_warning "  → Dashboard should have staggered KPI animations"
    print_warning "  → Buttons should have hover effects"
    
    # Verify deployment
    print_status "Verifying deployment..."
    sleep 3
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        print_status "✅ Server is responding correctly (HTTP $HTTP_STATUS)"
    else
        print_warning "⚠️  Server response: HTTP $HTTP_STATUS"
    fi
else
    print_error "❌ Deployment failed!"
    print_error "Please check:"
    print_error "  • SSH access to server"
    print_error "  • Server has git, node, and npm installed"
    print_error "  • Network connectivity"
    exit 1
fi

echo ""
print_status "Enhanced UI deployment from GitHub completed!"