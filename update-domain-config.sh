#!/bin/bash

# Update Domain Configuration Script
# Updates all config files to use custom domain with HTTPS

set -e

# IMPORTANT: Update these values before running this script
DOMAIN="${DOMAIN:-your-domain.com}"
NEW_FRONTEND_URL="https://$DOMAIN"
NEW_BACKEND_URL="https://$DOMAIN/api"

echo "================================================"
echo "  Update Configuration to HTTPS Domain"
echo "  Domain: $DOMAIN"
echo "================================================"
echo ""
echo "⚠️  IMPORTANT: This script will update your .env.production"
echo "    Configure the following in your environment:"
echo "    - Set DOMAIN environment variable before running"
echo "    - Or update the DOMAIN variable in this script"
echo "    - Update database credentials securely"
echo "    - Update OAuth and API credentials"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

cd /opt/amazon-fdc-tool

echo "📋 Step 1: Backing up current configuration..."
sudo cp .env.production .env.production.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

echo ""
echo "🔧 Step 2: Updating .env.production..."
echo "⚠️  REMINDER: Update credentials in the .env.production file after this script completes"

sudo tee .env.production > /dev/null <<EOF
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=amazon_fdc_tool
DB_USER=amazon_fdc_user
DB_PASSWORD=YOUR_SECURE_DB_PASSWORD_CHANGE_THIS_IN_PRODUCTION

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=YOUR_SECURE_REDIS_PASSWORD_CHANGE_THIS_IN_PRODUCTION

# JWT Configuration
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_32_CHARACTERS_MINIMUM
JWT_EXPIRES_IN=7d

# Encryption Key (for sensitive data storage)
ENCRYPTION_KEY=amazon-fdc-tool-encryption-key-32-character-minimum

# Google OAuth - UPDATE WITH YOUR CREDENTIALS
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=$NEW_FRONTEND_URL/api/auth/google/callback

# Amazon SP-API - UPDATE WITH YOUR CREDENTIALS
SP_API_LWA_APP_ID=YOUR_SP_API_APP_ID_HERE
SP_API_LWA_CLIENT_SECRET=YOUR_SP_API_CLIENT_SECRET_HERE
AMAZON_SANDBOX_MODE=false
SP_API_PROD_ENDPOINT=https://sellingpartnerapi-na.amazon.com
SP_API_SANDBOX_ENDPOINT=https://sandbox.sellingpartnerapi-na.amazon.com
SP_API_REGION=us-east-1

# Application URLs
FRONTEND_URL=$NEW_FRONTEND_URL
BACKEND_URL=$NEW_BACKEND_URL

# Node Environment
NODE_ENV=production

# API Configuration
PORT=3001

# CORS Origins
CORS_ORIGIN=$NEW_FRONTEND_URL

# Frontend Vite Configuration
VITE_API_URL=/api
VITE_API_BASE_URL=/api
EOF

echo "✅ .env.production updated with domain: $DOMAIN"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Edit .env.production to add your actual credentials"
echo "2. Update Google OAuth credentials"
echo "3. Update Amazon SP-API credentials"
echo "4. Update database and Redis passwords"
echo "5. Restart services: docker-compose restart"
echo ""
echo ""
echo "📋 Step 3: Verifying Docker configuration..."
if grep -q "51439:80" docker-compose.prod.yml; then
    echo "✅ Docker ports correctly configured"
else
    echo "⚠️  Warning: Check docker-compose.prod.yml port mappings"
fi

echo ""
echo "🔨 Step 4: Rebuilding Docker containers with new configuration..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production build

echo ""
echo "🚀 Step 5: Restarting services..."
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production down
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

echo ""
echo "⏳ Step 6: Waiting for services to start..."
sleep 15

echo ""
echo "✅ Step 7: Checking service health..."
sudo docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📊 Step 8: Checking backend logs..."
echo "=== Backend Logs (last 20 lines) ==="
sudo docker logs --tail 20 amazon-fdc-backend

echo ""
echo "================================================"
echo "  ✅ Configuration Update Complete!"
echo "================================================"
echo ""
echo "📋 Summary of Changes:"
echo "  Old URL: $OLD_FRONTEND_URL"
echo "  New URL: $NEW_FRONTEND_URL"
echo "  Protocol: HTTPS (SSL Enabled)"
echo ""
echo "✅ Services Running:"
echo "  Frontend: https://$DOMAIN"
echo "  Backend API: https://$DOMAIN/api"
echo "  OAuth Callback: https://$DOMAIN/api/oauth/callback/sp-api"
echo ""
echo "⚠️  CRITICAL: Update OAuth Redirect URIs in Amazon Seller Central!"
echo ""
echo "Go to: https://sellercentral.amazon.com/apps/manage"
echo "Update redirect URI to: https://$DOMAIN/api/oauth/callback/sp-api"
echo ""
echo "🧪 Test your application:"
echo "  1. Open: https://$DOMAIN"
echo "  2. Login with Google OAuth"
echo "  3. Test Amazon OAuth connection"
echo ""
echo "📖 Check logs if needed:"
echo "  Backend: sudo docker logs -f amazon-fdc-backend"
echo "  Frontend: sudo docker logs -f amazon-fdc-frontend"
echo ""
