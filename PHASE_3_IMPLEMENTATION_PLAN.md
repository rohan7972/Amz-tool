# Phase 3 Implementation Plan - Amazon FDC Tool

**Start Date:** December 7, 2024  
**Phase:** 3 - Backend Integration & Advanced Features  
**Status:** 🟡 In Progress

---

## 🎯 Phase 3 Objectives

### Primary Goals
1. ✅ Replace mock data with real database integration
2. ✅ Implement Amazon Advertising API client structure (with test credentials)
3. ✅ Create full CRUD operations for campaigns and keywords
4. ✅ Add Redis caching layer for performance
5. ✅ Implement proper error handling and loading states
6. ✅ Deploy integrated system to production

### Success Criteria
- Backend serves real data from PostgreSQL
- Frontend displays dynamic data from API
- CRUD operations working (Create, Read, Update, Delete)
- Caching reduces database load
- Error messages display properly
- Loading states provide feedback

---

## 🏗️ Architecture Changes

### Before (Phase 2)
```
Frontend (Mock Data) → Display Only
Backend → Basic Auth + Mock Endpoints
Database → Not Connected
```

### After (Phase 3)
```
Frontend → Backend API → Redis Cache → PostgreSQL
                ↓
         Amazon Ad API (Test Mode)
```

---

## 📋 Implementation Tasks

### Task 1: Database Schema Design ✅
**Priority:** HIGH  
**Status:** Todo

**Actions:**
- [ ] Design campaigns table schema
- [ ] Design keywords table schema
- [ ] Design ad_groups table schema
- [ ] Design performance_metrics table schema
- [ ] Create migration files
- [ ] Add indexes for performance
- [ ] Set up foreign key relationships

**Schema Preview:**
```sql
-- campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  campaign_type VARCHAR(50) NOT NULL,
  targeting_type VARCHAR(50),
  daily_budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  amazon_campaign_id VARCHAR(255) UNIQUE,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- keywords table
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  keyword_text VARCHAR(500) NOT NULL,
  match_type VARCHAR(20) NOT NULL,
  bid DECIMAL(10,2),
  status VARCHAR(50),
  amazon_keyword_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- performance_metrics table
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'campaign' or 'keyword'
  entity_id UUID NOT NULL,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  sales DECIMAL(10,2) DEFAULT 0,
  orders INTEGER DEFAULT 0,
  ctr DECIMAL(5,2),
  cpc DECIMAL(10,2),
  acos DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, date)
);
```

---

### Task 2: Amazon Advertising API Client ✅
**Priority:** HIGH  
**Status:** Todo

**Actions:**
- [ ] Research Amazon Advertising API structure
- [ ] Create API client class with test credentials
- [ ] Implement OAuth 2.0 flow structure
- [ ] Create methods for fetching campaigns
- [ ] Create methods for fetching keywords
- [ ] Create methods for performance reports
- [ ] Add error handling and retry logic
- [ ] Mock responses for testing

**Test Credentials Structure:**
```typescript
// backend/src/config/amazon-api.ts
export const amazonApiConfig = {
  clientId: process.env.AMAZON_CLIENT_ID || 'test_client_id',
  clientSecret: process.env.AMAZON_CLIENT_SECRET || 'test_client_secret',
  refreshToken: process.env.AMAZON_REFRESH_TOKEN || 'test_refresh_token',
  sandbox: process.env.AMAZON_SANDBOX === 'true',
  endpoints: {
    production: 'https://advertising-api.amazon.com',
    sandbox: 'https://advertising-api-test.amazon.com'
  }
};
```

---

### Task 3: Backend API Endpoints ✅
**Priority:** HIGH  
**Status:** Todo

**Campaigns Endpoints:**
- [ ] GET /api/campaigns - List all campaigns
- [ ] GET /api/campaigns/:id - Get campaign details
- [ ] POST /api/campaigns - Create new campaign
- [ ] PUT /api/campaigns/:id - Update campaign
- [ ] DELETE /api/campaigns/:id - Delete campaign
- [ ] GET /api/campaigns/:id/performance - Get campaign metrics

**Keywords Endpoints:**
- [ ] GET /api/keywords - List all keywords
- [ ] GET /api/keywords/:id - Get keyword details
- [ ] POST /api/keywords - Create new keyword
- [ ] PUT /api/keywords/:id - Update keyword
- [ ] DELETE /api/keywords/:id - Delete keyword
- [ ] GET /api/keywords/:id/performance - Get keyword metrics

**Sync Endpoints:**
- [ ] POST /api/sync/campaigns - Sync from Amazon API
- [ ] POST /api/sync/keywords - Sync from Amazon API
- [ ] POST /api/sync/performance - Sync performance data

---

### Task 4: Redis Caching Implementation ✅
**Priority:** MEDIUM  
**Status:** Todo

**Actions:**
- [ ] Set up Redis connection
- [ ] Create caching middleware
- [ ] Cache campaign list (TTL: 5 minutes)
- [ ] Cache keyword list (TTL: 5 minutes)
- [ ] Cache performance metrics (TTL: 15 minutes)
- [ ] Implement cache invalidation on updates
- [ ] Add Redis error fallback

**Caching Strategy:**
```typescript
// Cache keys format
campaigns:all
campaigns:{id}
keywords:all
keywords:{id}
performance:{entity_type}:{entity_id}:{date}
```

---

### Task 5: Frontend Integration ✅
**Priority:** HIGH  
**Status:** Todo

**Actions:**
- [ ] Update API service to use real endpoints
- [ ] Remove mock data from components
- [ ] Implement React Query for data fetching
- [ ] Add loading states to all pages
- [ ] Add error handling UI
- [ ] Implement optimistic updates
- [ ] Add retry logic for failed requests

**Example:**
```typescript
// frontend/src/services/campaigns.ts
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};
```

---

### Task 6: Error Handling & Loading States ✅
**Priority:** MEDIUM  
**Status:** Todo

**Actions:**
- [ ] Create error boundary component
- [ ] Add error toast notifications
- [ ] Implement loading skeletons for all tables
- [ ] Add retry buttons for failed requests
- [ ] Create fallback UI for offline mode
- [ ] Log errors to backend

---

### Task 7: Testing & Validation ✅
**Priority:** HIGH  
**Status:** Todo

**Actions:**
- [ ] Test campaign CRUD operations
- [ ] Test keyword CRUD operations
- [ ] Test performance data sync
- [ ] Test caching behavior
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Performance testing (load times)

---

### Task 8: Deployment ✅
**Priority:** HIGH  
**Status:** Todo

**Actions:**
- [ ] Update environment variables on server
- [ ] Run database migrations
- [ ] Set up Redis on server
- [ ] Deploy backend updates
- [ ] Deploy frontend updates
- [ ] Verify all endpoints working
- [ ] Monitor logs for errors

---

## 🔑 Amazon Advertising API Integration

### Test Credentials Setup

Since real credentials aren't available, we'll use a test/sandbox approach:

**Option 1: Mock API Server**
- Create a local mock server that mimics Amazon API responses
- Use realistic data structures
- Simulate rate limiting and errors

**Option 2: Test Account**
- Use Amazon Advertising sandbox if available
- Or create minimal test account
- Implement full OAuth flow

**Option 3: Hybrid Approach** (RECOMMENDED)
- Build full API client structure
- Use environment flag to switch between test/production
- Mock responses for testing, ready for real credentials

### API Implementation Strategy

```typescript
// backend/src/services/amazon-api/client.ts
class AmazonAdvertisingApiClient {
  private config: AmazonApiConfig;
  private accessToken: string | null = null;
  
  constructor(config: AmazonApiConfig) {
    this.config = config;
  }
  
  async authenticate(): Promise<void> {
    if (this.config.sandbox) {
      // Mock authentication for testing
      this.accessToken = 'mock_access_token';
    } else {
      // Real OAuth 2.0 flow
      const response = await this.refreshAccessToken();
      this.accessToken = response.access_token;
    }
  }
  
  async getCampaigns(): Promise<Campaign[]> {
    if (this.config.sandbox) {
      // Return mock data
      return this.getMockCampaigns();
    }
    
    // Real API call
    const response = await fetch(
      `${this.config.endpoint}/v2/sp/campaigns`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Amazon-Advertising-API-ClientId': this.config.clientId
        }
      }
    );
    
    return response.json();
  }
  
  private getMockCampaigns(): Campaign[] {
    return [
      {
        campaignId: 'mock_camp_1',
        name: 'Test Campaign 1',
        state: 'enabled',
        dailyBudget: 100.00
      }
    ];
  }
}
```

---

## 📊 Expected Outcomes

### Performance Improvements
- [ ] Database queries cached (5x faster repeated queries)
- [ ] Page load time <1 second for cached data
- [ ] Real-time data updates
- [ ] Optimistic UI updates (instant feedback)

### User Experience Improvements
- [ ] Live data instead of mock data
- [ ] Create/Edit/Delete functionality working
- [ ] Error messages guide users
- [ ] Loading states provide feedback
- [ ] Retry options for failures

### Technical Improvements
- [ ] Scalable architecture
- [ ] Proper error handling
- [ ] Monitoring and logging
- [ ] Cache invalidation strategy
- [ ] API rate limiting handled

---

## 🚧 Potential Challenges

### Challenge 1: Amazon API Rate Limits
**Solution:** 
- Implement request queuing
- Cache aggressively
- Batch operations where possible

### Challenge 2: Data Synchronization
**Solution:**
- Implement sync queue with Bull
- Track last sync timestamp
- Handle partial failures gracefully

### Challenge 3: Database Performance
**Solution:**
- Add proper indexes
- Use connection pooling
- Implement query optimization

### Challenge 4: No Real API Credentials
**Solution:**
- Build complete structure with mocks
- Use environment variables
- Document credential setup process
- Ready to swap in real credentials

---

## 📅 Timeline

### Week 1 (Days 1-3)
- ✅ Database schema design and migrations
- ✅ Basic CRUD endpoints implementation
- ✅ PostgreSQL integration

### Week 1 (Days 4-7)
- ✅ Amazon API client structure (with test mode)
- ✅ Redis caching implementation
- ✅ Frontend integration (remove mock data)

### Week 2 (Days 8-10)
- ✅ Error handling and loading states
- ✅ Testing and bug fixes
- ✅ Performance optimization

### Week 2 (Days 11-14)
- ✅ Documentation
- ✅ Deployment to production
- ✅ Monitoring and validation

---

## 🎯 Phase 3 Deliverables

1. ✅ **Database Schema** - Full schema with migrations
2. ✅ **Backend API** - RESTful API with CRUD operations
3. ✅ **Amazon API Client** - Structure ready for real credentials
4. ✅ **Redis Caching** - Implemented and tested
5. ✅ **Frontend Integration** - Connected to real backend
6. ✅ **Error Handling** - Comprehensive error UI
7. ✅ **Documentation** - API docs and setup guide
8. ✅ **Deployed System** - Live on production server

---

## 🔗 Resources

### Amazon Advertising API
- [Official Documentation](https://advertising.amazon.com/API/docs)
- [OAuth Guide](https://advertising.amazon.com/API/docs/en-us/get-started/oauth)
- [API Reference](https://advertising.amazon.com/API/docs/en-us/reference)

### Tools & Libraries
- **amazon-advertising-api-nodejs** - Node.js client library
- **Bull** - Job queue for background tasks
- **ioredis** - Redis client
- **Knex.js** - SQL query builder

---

**Status:** Ready to begin Phase 3 implementation!  
**Next Step:** Start with Task 1 (Database Schema Design)
