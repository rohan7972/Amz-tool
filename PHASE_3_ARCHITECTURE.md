# Phase 3 - Backend Architecture Diagram

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                     (React + Material-UI)                       │
│                         ✅ PHASE 2                              │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard  │  Campaigns  │  Keywords  │  Automation  │ Reports │
│     Page    │     Page    │    Page    │     Page     │   Page  │
└──────┬──────┴──────┬──────┴─────┬──────┴──────┬───────┴────┬────┘
       │             │            │             │            │
       └─────────────┴────────────┴─────────────┴────────────┘
                              │
                    HTTP REST API Calls
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│                    (Express.js + TypeScript)                    │
│                         ✅ PHASE 3                              │
├─────────────────────────────────────────────────────────────────┤
│                   JWT Authentication Middleware                 │
│                   Error Handling Middleware                     │
│                   CORS & Security Middleware                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌────────────────┐
│  /api/auth    │    │/api/campaigns │    │ /api/keywords  │
│               │    │               │    │                │
│ • login       │    │ • GET /       │    │ • GET /        │
│ • register    │    │ • GET /:id    │    │ • GET /:id     │
│ • logout      │    │ • POST /      │    │ • POST /       │
│               │    │ • PUT /:id    │    │ • PUT /:id     │
│               │    │ • DELETE /:id │    │ • DELETE /:id  │
│               │    │ • GET /:id/   │    │ • POST /bulk-  │
│               │    │   performance │    │   update-bids  │
│               │    │ • POST /sync  │    │ • GET /:id/    │
│               │    │               │    │   performance  │
│               │    │               │    │ • POST /sync   │
└───────────────┘    └───────┬───────┘    └────────┬───────┘
                             │                     │
                             ▼                     ▼
                    ┌─────────────────────────────────┐
                    │      SERVICE LAYER              │
                    │   (Business Logic)              │
                    │      ✅ PHASE 3                 │
                    ├─────────────────────────────────┤
                    │                                 │
                    │  ┌──────────────────────────┐  │
                    │  │  campaigns.service.ts    │  │
                    │  │                          │  │
                    │  │ • getAllCampaigns()      │  │
                    │  │ • getCampaignById()      │  │
                    │  │ • createCampaign()       │  │
                    │  │ • updateCampaign()       │  │
                    │  │ • deleteCampaign()       │  │
                    │  │ • getCampaignPerformance()│ │
                    │  │ • syncCampaignsFromAmazon()││
                    │  └──────────────────────────┘  │
                    │                                 │
                    │  ┌──────────────────────────┐  │
                    │  │  keywords.service.ts     │  │
                    │  │                          │  │
                    │  │ • getAllKeywords()       │  │
                    │  │ • getKeywordById()       │  │
                    │  │ • createKeyword()        │  │
                    │  │ • updateKeyword()        │  │
                    │  │ • deleteKeyword()        │  │
                    │  │ • bulkUpdateBids()       │  │
                    │  │ • getKeywordPerformance()│  │
                    │  │ • syncKeywordsFromAmazon()│ │
                    │  └──────────────────────────┘  │
                    │                                 │
                    └─────────┬─────────────┬─────────┘
                              │             │
                    ┌─────────┘             └─────────┐
                    │                                 │
                    ▼                                 ▼
        ┌───────────────────────┐      ┌──────────────────────┐
        │  AMAZON API CLIENT    │      │   DATABASE LAYER     │
        │    ✅ PHASE 3         │      │    ✅ PHASE 3        │
        ├───────────────────────┤      ├──────────────────────┤
        │                       │      │   PostgreSQL Pool    │
        │  AmazonAPIClient      │      │                      │
        │                       │      │  ┌────────────────┐  │
        │ • authenticate()      │      │  │   campaigns    │  │
        │ • getCampaigns()      │      │  │   ad_groups    │  │
        │ • getKeywords()       │      │  │   keywords     │  │
        │ • createCampaign()    │      │  │   product_ads  │  │
        │ • updateCampaign()    │      │  │   performance_ │  │
        │ • updateKeyword()     │      │  │     metrics    │  │
        │ • updateBid()         │      │  │   negative_    │  │
        │                       │      │  │     keywords   │  │
        │  MockDataGenerator    │      │  │   search_terms │  │
        │                       │      │  │   sync_logs    │  │
        │ • generateMockCampaigns│     │  └────────────────┘  │
        │ • generateMockKeywords│      │                      │
        │ • generateMockMetrics │      │  Indexes, Triggers,  │
        │                       │      │  Foreign Keys        │
        └───────┬───────────────┘      └──────────────────────┘
                │                                 
                │ (Sandbox Mode = true)           
                ▼                                 
        ┌───────────────────────┐                
        │  Amazon Advertising   │                
        │        API            │                
        │   (Test Credentials)  │                
        └───────────────────────┘                
```

---

## 📊 Data Flow Diagrams

### 1. Read Operation (GET Campaign)

```
User Browser
    │
    │ 1. GET /api/campaigns/:id
    │    Authorization: Bearer <JWT>
    ▼
┌─────────────────┐
│  API Gateway    │
│  (Express.js)   │
└────────┬────────┘
         │ 2. Verify JWT
         │ 3. Extract userId
         ▼
┌─────────────────┐
│ campaigns.      │
│   service       │
│                 │
│ getCampaignById()│
└────────┬────────┘
         │ 4. SQL Query:
         │    SELECT * FROM campaigns
         │    WHERE id = $1 AND user_id = $2
         ▼
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
└────────┬────────┘
         │ 5. Return row
         ▼
┌─────────────────┐
│  API Gateway    │
│  (Response)     │
└────────┬────────┘
         │ 6. JSON Response:
         │    { success: true, data: {...} }
         ▼
    User Browser
```

---

### 2. Create Operation (POST Campaign)

```
User Browser
    │
    │ 1. POST /api/campaigns
    │    Body: { name, dailyBudget, ... }
    │    Authorization: Bearer <JWT>
    ▼
┌─────────────────┐
│  API Gateway    │
└────────┬────────┘
         │ 2. Validate auth
         │ 3. Extract userId
         ▼
┌─────────────────┐
│ campaigns.      │
│   service       │
│                 │
│ createCampaign()│
└────────┬────────┘
         │ 4. SQL Insert
         ▼
┌─────────────────┐     5. Also create on Amazon API
│   PostgreSQL    │◄────┐
└────────┬────────┘     │
         │              │
         │ 6. Return    │
         │    new row   │
         ▼              │
┌─────────────────┐     │
│ Amazon API      │─────┘
│   Client        │
│                 │
│ createCampaign()│
└────────┬────────┘
         │ 7. POST to Amazon Advertising API
         ▼
┌─────────────────┐
│   Amazon API    │
│  (or Mock Data) │
└────────┬────────┘
         │ 8. Return Amazon campaign ID
         ▼
┌─────────────────┐
│  API Gateway    │
└────────┬────────┘
         │ 9. JSON Response
         ▼
    User Browser
```

---

### 3. Sync Operation (POST /sync)

```
User Browser
    │
    │ 1. POST /api/campaigns/sync
    │    Authorization: Bearer <JWT>
    ▼
┌─────────────────┐
│  API Gateway    │
└────────┬────────┘
         │ 2. Authenticate
         ▼
┌─────────────────┐
│ campaigns.      │
│   service       │
│                 │
│ syncCampaigns   │
│   FromAmazon()  │
└────────┬────────┘
         │
         │ 3. Request campaigns
         ▼
┌─────────────────┐
│ Amazon API      │
│   Client        │
│                 │
│ authenticate()  │
│ getCampaigns()  │
└────────┬────────┘
         │ 4. OAuth flow
         ▼
┌─────────────────┐
│   Amazon API    │
│  (or Mock Data) │
└────────┬────────┘
         │ 5. Return campaigns array
         ▼
┌─────────────────┐
│ campaigns.      │
│   service       │
└────────┬────────┘
         │ 6. For each campaign:
         │    INSERT ... ON CONFLICT UPDATE
         ▼
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
│                 │
│  campaigns      │
│  sync_logs      │
└────────┬────────┘
         │ 7. Return sync count
         ▼
┌─────────────────┐
│  API Gateway    │
└────────┬────────┘
         │ 8. JSON Response:
         │    { success: true, syncedCount: 5 }
         ▼
    User Browser
```

---

## 🔐 Authentication Flow

```
┌─────────────────┐
│   User Login    │
│                 │
│ POST /api/auth/ │
│      login      │
│                 │
│ Body:           │
│  { email,       │
│    password }   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Service   │
│                 │
│ 1. Verify creds │
│ 2. Generate JWT │
└────────┬────────┘
         │
         │ JWT Token: eyJhbGc...
         ▼
┌─────────────────┐
│   User Browser  │
│                 │
│ Store in:       │
│ localStorage or │
│ httpOnly cookie │
└────────┬────────┘
         │
         │ Subsequent requests
         │ Authorization: Bearer <JWT>
         ▼
┌─────────────────┐
│    API Route    │
│                 │
│ authenticate    │
│  middleware     │
└────────┬────────┘
         │
         │ 1. Extract token
         │ 2. Verify signature
         │ 3. Check expiry
         │ 4. Extract userId
         ▼
┌─────────────────┐
│  req.user = {   │
│    id: '...',   │
│    email: '...', │
│    role: '...'  │
│  }              │
└────────┬────────┘
         │
         ▼
    Service Layer
   (userId validated)
```

---

## 🗄️ Database Schema Diagram

```
┌──────────────────────┐
│      campaigns       │
│──────────────────────│
│ id (PK)              │
│ user_id              │
│ amazon_campaign_id   │
│ name                 │
│ state                │
│ daily_budget         │
│ targeting_type       │
│ start_date           │
│ end_date             │
│ created_at           │
│ updated_at           │
│ archived_at          │
└──────────┬───────────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│      ad_groups       │
│──────────────────────│
│ id (PK)              │
│ campaign_id (FK)     │
│ amazon_ad_group_id   │
│ name                 │
│ default_bid          │
│ state                │
│ created_at           │
│ updated_at           │
│ archived_at          │
└──────────┬───────────┘
           │
           │ 1:N
           ├─────────────────────┬─────────────────┐
           ▼                     ▼                 ▼
┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│    keywords      │  │  product_ads     │  │ negative_       │
│──────────────────│  │──────────────────│  │   keywords      │
│ id (PK)          │  │ id (PK)          │  │─────────────────│
│ campaign_id (FK) │  │ campaign_id (FK) │  │ id (PK)         │
│ ad_group_id (FK) │  │ ad_group_id (FK) │  │ campaign_id(FK) │
│ amazon_keyword_id│  │ amazon_ad_id     │  │ ad_group_id(FK) │
│ keyword_text     │  │ sku              │  │ keyword_text    │
│ match_type       │  │ asin             │  │ match_type      │
│ bid              │  │ state            │  │ state           │
│ state            │  │ created_at       │  │ created_at      │
│ created_at       │  │ updated_at       │  │ updated_at      │
│ updated_at       │  │ archived_at      │  │ archived_at     │
│ archived_at      │  └──────────────────┘  └─────────────────┘
└──────────┬───────┘
           │
           │ 1:N
           ▼
┌──────────────────────┐
│ performance_metrics  │
│──────────────────────│
│ id (PK)              │
│ campaign_id (FK)     │
│ ad_group_id (FK)     │
│ keyword_id (FK)      │
│ date                 │
│ impressions          │
│ clicks               │
│ spend                │
│ sales                │
│ orders               │
│ ctr                  │
│ cpc                  │
│ acos                 │
│ roas                 │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│    search_terms      │
│──────────────────────│
│ id (PK)              │
│ keyword_id (FK)      │
│ campaign_id (FK)     │
│ search_term          │
│ impressions          │
│ clicks               │
│ spend                │
│ sales                │
│ orders               │
│ date                 │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│      sync_logs       │
│──────────────────────│
│ id (PK)              │
│ user_id              │
│ entity_type          │
│ operation            │
│ status               │
│ records_synced       │
│ error_message        │
│ created_at           │
└──────────────────────┘
```

**Relationships:**
- 1 Campaign → N Ad Groups
- 1 Ad Group → N Keywords
- 1 Ad Group → N Product Ads
- 1 Ad Group → N Negative Keywords
- 1 Keyword → N Performance Metrics (daily)
- 1 Keyword → N Search Terms

**Indexes:**
- `campaigns`: (user_id, amazon_campaign_id)
- `ad_groups`: (campaign_id, amazon_ad_group_id)
- `keywords`: (campaign_id, ad_group_id, amazon_keyword_id)
- `performance_metrics`: (campaign_id, date), (keyword_id, date)
- `search_terms`: (keyword_id, date)

---

## 🔌 API Endpoint Details

### Campaign Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/campaigns` | GET | ✅ | List all user campaigns | Query: none | Array of campaigns |
| `/api/campaigns/:id` | GET | ✅ | Get single campaign | Param: id | Campaign object |
| `/api/campaigns` | POST | ✅ | Create new campaign | Body: campaign data | New campaign |
| `/api/campaigns/:id` | PUT | ✅ | Update campaign | Param: id, Body: updates | Updated campaign |
| `/api/campaigns/:id` | DELETE | ✅ | Archive campaign | Param: id | Success message |
| `/api/campaigns/:id/performance` | GET | ✅ | Get metrics | Param: id, Query: days | Metrics array |
| `/api/campaigns/sync` | POST | ✅ | Sync from Amazon | Body: none | Sync count |

### Keyword Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/keywords` | GET | ✅ | List keywords | Query: campaignId? | Array of keywords |
| `/api/keywords/:id` | GET | ✅ | Get single keyword | Param: id | Keyword object |
| `/api/keywords` | POST | ✅ | Create keyword | Body: keyword data | New keyword |
| `/api/keywords/:id` | PUT | ✅ | Update keyword | Param: id, Body: updates | Updated keyword |
| `/api/keywords/:id` | DELETE | ✅ | Archive keyword | Param: id | Success message |
| `/api/keywords/bulk-update-bids` | POST | ✅ | Bulk update bids | Body: updates[] | Update count |
| `/api/keywords/:id/performance` | GET | ✅ | Get metrics | Param: id, Query: days | Metrics array |
| `/api/keywords/sync` | POST | ✅ | Sync from Amazon | Body: campaignId? | Sync count |

---

## 🎯 Service Layer Methods

### CampaignsService

```typescript
class CampaignsService {
  // READ operations
  async getAllCampaigns(userId: string): Promise<Campaign[]>
  async getCampaignById(id: string, userId: string): Promise<Campaign | null>
  async getCampaignPerformance(id: string, userId: string, days: number): Promise<PerformanceMetric[]>
  
  // WRITE operations
  async createCampaign(data: CampaignInput): Promise<Campaign>
  async updateCampaign(id: string, userId: string, data: Partial<CampaignInput>): Promise<Campaign | null>
  async deleteCampaign(id: string, userId: string): Promise<boolean>
  
  // SYNC operations
  async syncCampaignsFromAmazon(userId: string): Promise<number>
}
```

### KeywordsService

```typescript
class KeywordsService {
  // READ operations
  async getAllKeywords(userId: string, campaignId?: string): Promise<Keyword[]>
  async getKeywordById(id: string, userId: string): Promise<Keyword | null>
  async getKeywordPerformance(id: string, userId: string, days: number): Promise<PerformanceMetric[]>
  
  // WRITE operations
  async createKeyword(data: KeywordInput, userId: string): Promise<Keyword>
  async updateKeyword(id: string, userId: string, data: Partial<KeywordInput>): Promise<Keyword | null>
  async deleteKeyword(id: string, userId: string): Promise<boolean>
  async bulkUpdateBids(updates: BidUpdate[], userId: string): Promise<number>
  
  // SYNC operations
  async syncKeywordsFromAmazon(userId: string, campaignId?: string): Promise<number>
}
```

---

## 🧪 Testing Strategy

### 1. Unit Tests (Future)
- Service layer methods
- Mock database queries
- Mock Amazon API client

### 2. Integration Tests (Future)
- API endpoint tests
- Database operations
- Authentication flow

### 3. Manual Testing (Current)
```bash
# Test campaign list
curl -H "Authorization: Bearer <JWT>" \
  http://35.200.168.177:3001/api/campaigns

# Test campaign create
curl -X POST \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","dailyBudget":100}' \
  http://35.200.168.177:3001/api/campaigns

# Test sync
curl -X POST \
  -H "Authorization: Bearer <JWT>" \
  http://35.200.168.177:3001/api/campaigns/sync
```

---

## 📦 Deployment Checklist

### Pre-deployment:
- [x] TypeScript compilation successful
- [x] All service methods implemented
- [x] All API routes created
- [x] Authentication integrated
- [x] Error handling in place
- [ ] Environment variables configured
- [ ] Database migrations ready

### Deployment Steps:
1. [ ] Run database migrations
2. [ ] Deploy backend code
3. [ ] Restart PM2 service
4. [ ] Test API endpoints
5. [ ] Update frontend
6. [ ] Verify end-to-end

---

_Generated: December 7, 2025_
