#!/bin/bash

# Remote deployment script for enhanced UI
# This script can be executed on the VPS server to deploy the enhanced UI

set -e

echo "🚀 Starting Enhanced UI Deployment"
echo "=================================="

# Configuration
BACKUP_DIR="/var/www/html/backup-$(date +%Y%m%d_%H%M%S)"
WEB_DIR="/var/www/html"
REPO_URL="https://github.com/r2w34/Amazon-FDC-Tool.git"
BRANCH="feature/enhanced-ui-animations"

# Colors
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root"
    exit 1
fi

# Create backup
print_status "Creating backup of current files..."
mkdir -p "$BACKUP_DIR"
cp -r "$WEB_DIR"/* "$BACKUP_DIR"/ 2>/dev/null || true
print_status "Backup created at: $BACKUP_DIR"

# Check if git is available
if ! command -v git &> /dev/null; then
    print_warning "Git not found, installing..."
    apt update && apt install -y git
fi

# Check if node/npm is available
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found, installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Clone or update repository
TEMP_DIR="/tmp/amazon-fdc-tool-deploy"
if [ -d "$TEMP_DIR" ]; then
    print_status "Updating existing repository..."
    cd "$TEMP_DIR"
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
else
    print_status "Cloning repository..."
    git clone -b "$BRANCH" "$REPO_URL" "$TEMP_DIR"
    cd "$TEMP_DIR"
fi

# Build the enhanced UI
print_status "Building enhanced UI..."
cd "$TEMP_DIR/frontend"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Build the project
print_status "Building project..."
npm run build

# Deploy the built files
print_status "Deploying enhanced UI..."
cp -r dist/* "$WEB_DIR"/
chown -R www-data:www-data "$WEB_DIR"
chmod -R 644 "$WEB_DIR"/*
chmod 755 "$WEB_DIR"

# Restart nginx
print_status "Restarting nginx..."
systemctl reload nginx

# Verify deployment
print_status "Verifying deployment..."
if curl -s http://localhost | grep -q "index-cc16289e.js"; then
    print_status "✅ Enhanced UI deployed successfully!"
    print_status "🎨 Features deployed:"
    print_status "   - Glassmorphism effects"
    print_status "   - Framer Motion animations"
    print_status "   - Interactive hover effects"
    print_status "   - Animated gradient background"
else
    print_warning "⚠️  Deployment may not be complete. Please check manually."
fi

# Cleanup
print_status "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

print_status "🎉 Enhanced UI deployment completed!"
print_status "🌐 Your server now serves the enhanced UI with animations!"

echo ""
echo "Deployment Summary:"
echo "=================="
echo "✅ Backup created: $BACKUP_DIR"
echo "✅ Enhanced UI deployed to: $WEB_DIR"
echo "✅ Nginx reloaded"
echo "✅ Permissions set correctly"
echo ""
echo "🎯 Next steps:"
echo "1. Visit your website to see the enhanced UI"
echo "2. Test the animations and glassmorphism effects"
echo "3. Verify all functionality is working"
echo ""
echo "🚀 Enjoy your enhanced Amazon FDC Tool!"