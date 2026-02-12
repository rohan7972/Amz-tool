#!/bin/bash

# Deploy OAuth Fix Script
# This script deploys the OAuth improvements to the production server

set -e

SERVER="${SERVER:-ubuntu@your-ec2-host.compute.amazonaws.com}"
PEM_FILE="${PEM_FILE:-./path/to/your-key.pem}"
REMOTE_DIR="${REMOTE_DIR:-/opt/amazon-fdc-tool}"

echo "================================================"
echo "  Amazon FDC Tool - OAuth Fix Deployment"
echo "================================================"
echo ""

echo "📋 Step 1: Copying updated backend OAuth route..."
scp -i "$PEM_FILE" \
  backend/src/routes/oauth.ts \
  "$SERVER:/tmp/oauth.ts"

echo "📋 Step 2: Copying updated frontend component..."
scp -i "$PEM_FILE" \
  frontend/src/components/accounts/ConnectAccountModal.tsx \
  "$SERVER:/tmp/ConnectAccountModal.tsx"

echo "📋 Step 3: Copying OAuth setup guide..."
scp -i "$PEM_FILE" \
  /workspace/OAUTH_SETUP_GUIDE.md \
  "$SERVER:/tmp/OAUTH_SETUP_GUIDE.md"

echo ""
echo "🚀 Step 4: Deploying changes to server..."

ssh -i "$PEM_FILE" "$SERVER" << 'ENDSSH'
set -e

cd /opt/amazon-fdc-tool

echo "📦 Copying files to project directory..."
sudo cp /tmp/oauth.ts backend/src/routes/oauth.ts
sudo cp /tmp/ConnectAccountModal.tsx frontend/src/components/accounts/ConnectAccountModal.tsx
sudo cp /tmp/OAUTH_SETUP_GUIDE.md ./OAUTH_SETUP_GUIDE.md

echo ""
echo "🔧 Checking current configuration..."
echo "AMAZON_SANDBOX_MODE: $(grep AMAZON_SANDBOX_MODE .env.production | cut -d= -f2)"
echo "FRONTEND_URL: $(grep FRONTEND_URL .env.production | cut -d= -f2)"
echo "BACKEND_URL: $(grep BACKEND_URL .env.production | cut -d= -f2)"

echo ""
echo "🔨 Rebuilding backend container..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production build backend

echo ""
echo "🔨 Rebuilding frontend container..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production build frontend

echo ""
echo "🚀 Restarting services..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "✅ Checking service health..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production ps

echo ""
echo "📊 Checking backend logs..."
sudo docker logs --tail 20 amazon-fdc-backend

echo ""
echo "================================================"
echo "  Deployment Complete!"
echo "================================================"
echo ""
echo "📝 Important Notes:"
echo ""
echo "1. OAuth callback will now redirect to /settings instead of /dashboard/accounts"
echo "2. Better error handling and logging added"
echo "3. Support for both 'code' and 'spapi_oauth_code' parameters"
echo ""
echo "⚠️  SANDBOX MODE LIMITATION:"
echo "Amazon SP-API sandbox does NOT show consent screen."
echo "To test full OAuth flow, you must:"
echo "  1. Register your app in Amazon Seller Central"
echo "  2. Add redirect URI: http://13.204.41.42/api/oauth/callback/sp-api"
echo "  3. Set AMAZON_SANDBOX_MODE=false in .env.production"
echo "  4. Restart services"
echo ""
echo "📖 Read OAUTH_SETUP_GUIDE.md for detailed instructions"
echo ""
echo "🔗 Test OAuth flow at: http://13.204.41.42/settings"
echo ""
ENDSSH

echo "✅ Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Read the OAUTH_SETUP_GUIDE.md on the server"
echo "2. Register your app in Amazon Seller Central"
echo "3. Switch to production mode (AMAZON_SANDBOX_MODE=false)"
echo "4. Test the OAuth flow"
echo ""
