#!/bin/bash

# API Endpoint Testing Script
# Tests all Phase 3 endpoints

set -e

echo "================================================"
echo "Amazon FDC Tool - API Endpoint Tests"
echo "================================================"
echo ""

# Configuration
BASE_URL="http://localhost:3001"
# Replace with a valid JWT token from your auth system
JWT_TOKEN="${JWT_TOKEN:-your_jwt_token_here}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  Method: $method"
    echo "  Endpoint: $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}  ✓ PASS (HTTP $http_code)${NC}"
        echo "  Response: $(echo $body | jq -c '.' 2>/dev/null || echo $body)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}  ✗ FAIL (HTTP $http_code)${NC}"
        echo "  Response: $body"
        ((TESTS_FAILED++))
    fi
    echo ""
}

echo -e "${YELLOW}=== Health Check ===${NC}"
echo ""
test_endpoint "GET" "/health" "Health check endpoint"

echo -e "${YELLOW}=== Campaign Endpoints ===${NC}"
echo ""
test_endpoint "GET" "/api/campaigns" "Get all campaigns"
test_endpoint "POST" "/api/campaigns/sync" "Sync campaigns from Amazon"
test_endpoint "POST" "/api/campaigns" "Create new campaign" '{
  "name": "Test Campaign API",
  "state": "enabled",
  "dailyBudget": 50.00,
  "targetingType": "manual",
  "startDate": "2025-12-08"
}'

# Store campaign ID if creation was successful
CAMPAIGN_ID=$(echo "$body" | jq -r '.data.id' 2>/dev/null || echo "")

if [ ! -z "$CAMPAIGN_ID" ] && [ "$CAMPAIGN_ID" != "null" ]; then
    echo -e "${GREEN}Created campaign with ID: $CAMPAIGN_ID${NC}"
    echo ""
    
    test_endpoint "GET" "/api/campaigns/$CAMPAIGN_ID" "Get campaign by ID"
    test_endpoint "GET" "/api/campaigns/$CAMPAIGN_ID/performance?days=7" "Get campaign performance"
    test_endpoint "PUT" "/api/campaigns/$CAMPAIGN_ID" "Update campaign" '{
      "name": "Test Campaign Updated",
      "dailyBudget": 75.00
    }'
fi

echo -e "${YELLOW}=== Keyword Endpoints ===${NC}"
echo ""
test_endpoint "GET" "/api/keywords" "Get all keywords"

if [ ! -z "$CAMPAIGN_ID" ] && [ "$CAMPAIGN_ID" != "null" ]; then
    test_endpoint "GET" "/api/keywords?campaignId=$CAMPAIGN_ID" "Get keywords by campaign"
fi

test_endpoint "POST" "/api/keywords/sync" "Sync keywords from Amazon"
test_endpoint "POST" "/api/keywords" "Create new keyword" '{
  "campaignId": "'"$CAMPAIGN_ID"'",
  "keywordText": "test keyword api",
  "matchType": "phrase",
  "bid": 1.25,
  "state": "enabled"
}'

# Store keyword ID if creation was successful
KEYWORD_ID=$(echo "$body" | jq -r '.data.id' 2>/dev/null || echo "")

if [ ! -z "$KEYWORD_ID" ] && [ "$KEYWORD_ID" != "null" ]; then
    echo -e "${GREEN}Created keyword with ID: $KEYWORD_ID${NC}"
    echo ""
    
    test_endpoint "GET" "/api/keywords/$KEYWORD_ID" "Get keyword by ID"
    test_endpoint "GET" "/api/keywords/$KEYWORD_ID/performance?days=7" "Get keyword performance"
    test_endpoint "PUT" "/api/keywords/$KEYWORD_ID" "Update keyword" '{
      "bid": 1.50,
      "state": "enabled"
    }'
    
    test_endpoint "POST" "/api/keywords/bulk-update-bids" "Bulk update keyword bids" '{
      "updates": [
        {
          "id": "'"$KEYWORD_ID"'",
          "bid": 2.00
        }
      ]
    }'
fi

echo ""
echo "================================================"
echo -e "${GREEN}Test Results Summary${NC}"
echo "================================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Check the output above.${NC}"
    exit 1
fi
