#!/bin/bash

# Phase 3 Deployment Script
# Run this on the production server (35.200.168.177)

set -e  # Exit on error

echo "================================================"
echo "Amazon FDC Tool - Phase 3 Deployment"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/amazon-fdc-tool"
BACKEND_DIR="$APP_DIR/backend"
DB_NAME="amazon_fdc_tool"
DB_USER="postgres"

echo -e "${YELLOW}Step 1: Pulling latest code from GitHub${NC}"
cd $APP_DIR
git fetch origin
git checkout feature/microagent-amz-comprehensive-v3
git pull origin feature/microagent-amz-comprehensive-v3
echo -e "${GREEN}✓ Code updated${NC}"
echo ""

echo -e "${YELLOW}Step 2: Installing backend dependencies${NC}"
cd $BACKEND_DIR
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 3: Running database migrations${NC}"
echo "Running migration: 001_create_core_tables.sql"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -f database/migrations/001_create_core_tables.sql
echo -e "${GREEN}✓ Core tables created${NC}"

echo "Running migration: 002_seed_test_data.sql"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -f database/migrations/002_seed_test_data.sql
echo -e "${GREEN}✓ Test data seeded${NC}"
echo ""

echo -e "${YELLOW}Step 4: Verifying database tables${NC}"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -c "\dt" | grep -E "campaigns|keywords|ad_groups|performance_metrics"
echo -e "${GREEN}✓ Tables verified${NC}"
echo ""

echo -e "${YELLOW}Step 5: Building backend TypeScript${NC}"
npm run build
echo -e "${GREEN}✓ Backend built successfully${NC}"
echo ""

echo -e "${YELLOW}Step 6: Restarting backend service${NC}"
pm2 restart amazon-fdc-backend || pm2 start dist/index.js --name amazon-fdc-backend
pm2 save
echo -e "${GREEN}✓ Backend service restarted${NC}"
echo ""

echo -e "${YELLOW}Step 7: Checking service status${NC}"
pm2 status amazon-fdc-backend
echo ""

echo -e "${YELLOW}Step 8: Testing health endpoint${NC}"
sleep 2
curl -s http://localhost:3001/health | jq '.' || echo "Backend is starting..."
echo ""

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Phase 3 Deployment Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Test API endpoints with: ./test-api-endpoints.sh"
echo "2. Check logs with: pm2 logs amazon-fdc-backend"
echo "3. Monitor with: pm2 monit"
echo ""
