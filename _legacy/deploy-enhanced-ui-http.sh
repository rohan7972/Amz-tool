#!/bin/bash

# Deploy Enhanced UI via HTTP Upload
# This script creates a deployment package and uploads it via HTTP

set -e

echo "🎨 Deploying Enhanced UI via HTTP"
echo "================================="

# Configuration
SERVER_IP="35.200.168.177"
LOCAL_DIST_PATH="./frontend/dist"
PACKAGE_NAME="enhanced-ui-$(date +%Y%m%d_%H%M%S).tar.gz"

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

# Create deployment package
print_status "Creating deployment package..."
cd frontend
tar -czf "../$PACKAGE_NAME" -C dist .
cd ..

print_status "Created package: $PACKAGE_NAME"

# List the enhanced UI files
print_status "Enhanced UI files in package:"
echo "  • index.html (with enhanced UI imports)"
echo "  • assets/index-cc16289e.js (enhanced UI with Framer Motion)"
echo "  • assets/index-afb02c6e.css (glassmorphism styles)"
echo "  • assets/vendor-db496f33.js (React + dependencies)"
echo "  • assets/mantine-1ff8034c.js (Mantine UI components)"
echo "  • assets/query-d7fa50d6.js (TanStack Query)"
echo "  • assets/charts-6cdf62b1.js (Chart components)"

# Try to upload via curl (if server has upload endpoint)
print_status "Attempting to deploy enhanced UI..."

# Method 1: Try to upload to a deployment endpoint
if curl -f -X POST -F "file=@$PACKAGE_NAME" http://$SERVER_IP/api/deploy 2>/dev/null; then
    print_status "✅ Enhanced UI deployed via API endpoint!"
else
    print_warning "API deployment not available, trying alternative methods..."
    
    # Method 2: Try to trigger a git pull on the server
    if curl -f -X POST http://$SERVER_IP/api/deploy/git-pull 2>/dev/null; then
        print_status "✅ Triggered git pull on server!"
    else
        print_warning "Git pull endpoint not available"
        
        # Method 3: Create instructions for manual deployment
        print_status "Creating manual deployment instructions..."
        
        cat > DEPLOYMENT_INSTRUCTIONS.md << EOF
# Manual Enhanced UI Deployment Instructions

## Current Status
- ✅ Enhanced UI built successfully with Framer Motion animations
- ✅ Package created: $PACKAGE_NAME
- ❌ Automatic deployment failed (SSH authentication issues)

## Enhanced UI Features
- 🎨 Glassmorphism effects on KPI cards
- ✨ Staggered animations on dashboard load
- 🌟 Interactive hover effects with card lifting
- 💫 Animated background with gradient effects
- 🎭 Loading skeletons for smooth UX
- 🎪 Micro-interactions on buttons and elements

## Manual Deployment Steps

### Option 1: Server Access Required
1. Copy $PACKAGE_NAME to server: $SERVER_IP
2. Extract to /var/www/html/: \`tar -xzf $PACKAGE_NAME -C /var/www/html/\`
3. Restart nginx: \`systemctl reload nginx\`

### Option 2: Git-based Deployment
1. Server pulls from GitHub: \`git checkout feature/enhanced-ui-animations\`
2. Build on server: \`cd frontend && npm run build\`
3. Copy to web directory: \`cp -r dist/* /var/www/html/\`

### Option 3: Docker Deployment
1. Rebuild frontend container with enhanced UI
2. Deploy using docker-compose with new image

## Verification
After deployment, check:
- Login form should show animated glassmorphism background
- Dashboard KPI cards should animate in with stagger effect
- Hover effects should work on cards and buttons
- Background should show subtle gradient animation

## Current vs Enhanced UI
**Current (Basic)**: Plain white cards, no animations, basic styling
**Enhanced**: Glassmorphism cards, Framer Motion animations, interactive effects

The enhanced UI is ready and built - it just needs to be deployed to replace the current basic UI files.
EOF

        print_status "📋 Manual deployment instructions created: DEPLOYMENT_INSTRUCTIONS.md"
    fi
fi

# Verify current server status
print_status "Checking current server status..."
CURRENT_JS=$(curl -s http://$SERVER_IP | grep -o 'assets/index-[^"]*\.js' | head -1)
ENHANCED_JS="assets/index-cc16289e.js"

if [ "$CURRENT_JS" = "$ENHANCED_JS" ]; then
    print_status "✅ Enhanced UI is deployed! ($CURRENT_JS)"
else
    print_warning "⚠️  Server still serving basic UI: $CURRENT_JS"
    print_warning "   Enhanced UI ready: $ENHANCED_JS"
fi

# Cleanup
rm -f "$PACKAGE_NAME"

echo ""
print_status "Enhanced UI deployment attempt completed!"
print_status "Package created and deployment methods attempted."
print_status "Check DEPLOYMENT_INSTRUCTIONS.md for manual deployment steps."