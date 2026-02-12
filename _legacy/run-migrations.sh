#!/bin/bash

# Database Migration Script
# Run this to execute database migrations

set -e

echo "================================================"
echo "Database Migration Script"
echo "================================================"
echo ""

# Configuration
DB_NAME="${DB_NAME:-amazon_fdc_tool}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Database Configuration:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is accessible
echo -e "${YELLOW}Checking PostgreSQL connection...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "\l" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL connection successful${NC}"
else
    echo -e "${RED}✗ Cannot connect to PostgreSQL${NC}"
    echo "Make sure PostgreSQL is running and credentials are correct"
    echo "Set DB_PASSWORD environment variable: export DB_PASSWORD='your_password'"
    exit 1
fi
echo ""

# Check if database exists
echo -e "${YELLOW}Checking if database exists...${NC}"
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${GREEN}✓ Database '$DB_NAME' exists${NC}"
else
    echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    echo -e "${GREEN}✓ Database created${NC}"
fi
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="$SCRIPT_DIR/backend/database/migrations"

echo -e "${YELLOW}Migrations directory: $MIGRATIONS_DIR${NC}"
echo ""

# Run migration 001
echo -e "${YELLOW}Running migration: 001_create_core_tables.sql${NC}"
if [ -f "$MIGRATIONS_DIR/001_create_core_tables.sql" ]; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATIONS_DIR/001_create_core_tables.sql"
    echo -e "${GREEN}✓ Core tables migration completed${NC}"
else
    echo -e "${RED}✗ Migration file not found: $MIGRATIONS_DIR/001_create_core_tables.sql${NC}"
    exit 1
fi
echo ""

# Run migration 002
echo -e "${YELLOW}Running migration: 002_seed_test_data.sql${NC}"
if [ -f "$MIGRATIONS_DIR/002_seed_test_data.sql" ]; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$MIGRATIONS_DIR/002_seed_test_data.sql"
    echo -e "${GREEN}✓ Seed data migration completed${NC}"
else
    echo -e "${RED}✗ Migration file not found: $MIGRATIONS_DIR/002_seed_test_data.sql${NC}"
    exit 1
fi
echo ""

# Verify tables created
echo -e "${YELLOW}Verifying tables...${NC}"
TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'")

echo "Tables found: $TABLE_COUNT"
echo ""
echo "Table list:"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"
echo ""

# Count records in main tables
echo -e "${YELLOW}Checking data...${NC}"
CAMPAIGN_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM campaigns" 2>/dev/null || echo "0")
KEYWORD_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM keywords" 2>/dev/null || echo "0")
METRIC_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM performance_metrics" 2>/dev/null || echo "0")

echo "  Campaigns: $CAMPAIGN_COUNT"
echo "  Keywords: $KEYWORD_COUNT"
echo "  Performance Metrics: $METRIC_COUNT"
echo ""

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Database migrations completed successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy backend code: npm run build && pm2 restart amazon-fdc-backend"
echo "2. Test API endpoints: ./test-api-endpoints.sh"
echo ""
