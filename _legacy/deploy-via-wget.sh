#!/bin/bash

# Deploy Enhanced UI via wget from local server
# This script serves files locally and instructs the production server to download them

set -e

echo "🚀 Deploying Enhanced UI via wget"
echo "================================="

# Configuration
SERVER_IP="35.200.168.177"
LOCAL_IP=$(hostname -I | awk '{print $1}')
LOCAL_PORT="8080"

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

# Check if local server is running
if ! curl -s http://localhost:$LOCAL_PORT > /dev/null; then
    print_error "Local server not running on port $LOCAL_PORT"
    print_status "Starting local server..."
    cd frontend/dist
    python3 -m http.server $LOCAL_PORT &
    LOCAL_SERVER_PID=$!
    sleep 2
    cd ../..
else
    print_status "Local server already running on port $LOCAL_PORT"
fi

print_status "Enhanced UI available at: http://localhost:$LOCAL_PORT"
print_status "Local IP: $LOCAL_IP"

# Create deployment commands for the production server
cat > deployment_commands.sh << EOF
#!/bin/bash
# Commands to run on production server to download enhanced UI

echo "Downloading enhanced UI files..."

# Create backup of current files
mkdir -p /var/www/html/backup-\$(date +%Y%m%d_%H%M%S)
cp -r /var/www/html/* /var/www/html/backup-\$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Download new files
cd /tmp
wget -r -np -nH -nd http://$LOCAL_IP:$LOCAL_PORT/ -P enhanced-ui/
wget -r -np -nH -nd http://$LOCAL_IP:$LOCAL_PORT/assets/ -P enhanced-ui/assets/

# Copy to web directory
cp -r enhanced-ui/* /var/www/html/
chown -R www-data:www-data /var/www/html/
chmod -R 644 /var/www/html/*
chmod 755 /var/www/html/

# Restart nginx
systemctl reload nginx

echo "Enhanced UI deployment completed!"
EOF

print_status "Created deployment commands in deployment_commands.sh"

# Try to execute deployment via SSH (if possible)
print_status "Attempting SSH deployment..."

if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no root@$SERVER_IP "bash -s" < deployment_commands.sh 2>/dev/null; then
    print_status "✅ Enhanced UI deployed successfully via SSH!"
else
    print_warning "SSH deployment failed. Trying alternative methods..."
    
    # Try to trigger deployment via HTTP API
    if curl -f -X POST -d "command=deploy" http://$SERVER_IP/api/deploy 2>/dev/null; then
        print_status "✅ Deployment triggered via API!"
    else
        print_warning "API deployment not available"
        
        # Create manual instructions
        print_status "Creating manual deployment instructions..."
        
        cat > MANUAL_DEPLOYMENT.md << EOF
# Manual Enhanced UI Deployment

## Current Status
- ✅ Enhanced UI served locally at: http://localhost:$LOCAL_PORT
- ✅ Local IP address: $LOCAL_IP
- ❌ Automatic deployment failed

## Manual Deployment Steps

### Option 1: Direct Server Access
Run these commands on the production server ($SERVER_IP):

\`\`\`bash
# Create backup
mkdir -p /var/www/html/backup-\$(date +%Y%m%d_%H%M%S)
cp -r /var/www/html/* /var/www/html/backup-\$(date +%Y%m%d_%H%M%S)/

# Download enhanced UI
cd /tmp
wget -r -np -nH -nd http://$LOCAL_IP:$LOCAL_PORT/ -P enhanced-ui/
wget -r -np -nH -nd http://$LOCAL_IP:$LOCAL_PORT/assets/ -P enhanced-ui/assets/

# Deploy
cp -r enhanced-ui/* /var/www/html/
chown -R www-data:www-data /var/www/html/
systemctl reload nginx
\`\`\`

### Option 2: File Transfer
1. Download files from http://localhost:$LOCAL_PORT
2. Upload to server manually
3. Extract to /var/www/html/

## Enhanced UI Features
- 🎨 Glassmorphism effects on cards
- ✨ Framer Motion animations
- 🌟 Interactive hover effects
- 💫 Animated background
- 🎭 Loading skeletons

## Verification
After deployment, the server should serve:
- index-cc16289e.js (enhanced UI)
- index-afb02c6e.css (glassmorphism styles)
- All animation assets included
EOF

        print_status "📋 Manual deployment instructions: MANUAL_DEPLOYMENT.md"
    fi
fi

# Verify current server status
print_status "Checking current server status..."
CURRENT_JS=$(curl -s http://$SERVER_IP | grep -o 'assets/index-[^"]*\.js' | head -1)
ENHANCED_JS="assets/index-cc16289e.js"

if [ "$CURRENT_JS" = "$ENHANCED_JS" ]; then
    print_status "✅ Enhanced UI is deployed! ($CURRENT_JS)"
else
    print_warning "⚠️  Server still serving: $CURRENT_JS"
    print_warning "   Enhanced UI ready: $ENHANCED_JS"
fi

print_status "Enhanced UI deployment attempt completed!"
print_status "Local server running at: http://localhost:$LOCAL_PORT"