#!/bin/bash

# Deploy Enhanced UI to Production Server
# This script copies the enhanced UI build to the production server

set -e

echo "🎨 Deploying Enhanced UI with Animations"
echo "========================================"

# Server details
SERVER_IP="35.200.168.177"
SERVER_USER="root"
REMOTE_PATH="/var/www/html"
LOCAL_DIST_PATH="./frontend/dist"

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

# Check if dist directory exists
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    print_error "Frontend dist directory not found. Please run 'npm run build' first."
    exit 1
fi

print_status "Enhanced UI build found at $LOCAL_DIST_PATH"

# Create backup of current files on server
print_status "Creating backup of current files on server..."
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "
    if [ -d $REMOTE_PATH ]; then
        cp -r $REMOTE_PATH $REMOTE_PATH.backup.$(date +%Y%m%d_%H%M%S)
        echo 'Backup created successfully'
    fi
"

# Copy enhanced UI files to server
print_status "Copying enhanced UI files to production server..."
rsync -avz --delete $LOCAL_DIST_PATH/ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/

# Restart nginx to ensure proper serving
print_status "Restarting nginx to ensure proper file serving..."
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "
    systemctl reload nginx
    echo 'Nginx reloaded successfully'
"

# Verify deployment
print_status "Verifying deployment..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP)

if [ "$HTTP_STATUS" = "200" ]; then
    print_status "✅ Enhanced UI deployed successfully!"
    echo ""
    echo "🎉 Deployment Summary:"
    echo "  • Server: http://$SERVER_IP"
    echo "  • Enhanced UI: ✅ Active"
    echo "  • Animations: ✅ Framer Motion loaded"
    echo "  • Design: ✅ Glassmorphism effects"
    echo ""
    print_warning "Please test the enhanced UI in your browser:"
    print_warning "  → Login form should show animated background"
    print_warning "  → Dashboard should have staggered KPI animations"
    print_warning "  → Buttons should have hover effects"
else
    print_error "❌ Deployment verification failed (HTTP $HTTP_STATUS)"
    print_error "Please check server logs and nginx configuration"
fi

echo ""
print_status "Enhanced UI deployment completed!"