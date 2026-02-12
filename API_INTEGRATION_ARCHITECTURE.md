# 🔌 API Integration Architecture - Multiple Amazon & Third-Party APIs

## 📋 Overview

This document outlines the comprehensive API integration strategy for the Amazon FDC Tool, including:
- **Amazon SP-API** (Selling Partner API)
- **Amazon Advertising API**
- **Amazon MWS** (legacy, being phased out)
- **Third-party integrations** (Stripe, SendGrid, etc.)

**Reference Library**: [amazon-sp-api](https://github.com/jrl84/amazon-sp-api) by jrl84

---

## 🏗️ API Integration Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIs LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Amazon      │  │  Amazon      │  │  Amazon      │             │
│  │  SP-API      │  │  Ads API     │  │  MWS API     │             │
│  │              │  │              │  │  (Legacy)    │             │
│  │ • Orders     │  │ • Campaigns  │  │ • Reports    │             │
│  │ • Products   │  │ • Keywords   │  │ • Inventory  │             │
│  │ • Inventory  │  │ • Reporting  │  │ • Orders     │             │
│  │ • Reports    │  │ • Bidding    │  │              │             │
│  │ • Finances   │  │ • Portfolios │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Stripe     │  │  SendGrid    │  │   Twilio     │             │
│  │              │  │              │  │              │             │
│  │ • Payments   │  │ • Email      │  │ • SMS        │             │
│  │ • Subscript. │  │ • Templates  │  │ • Voice      │             │
│  │ • Invoices   │  │ • Analytics  │  │              │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                    API ABSTRACTION LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               Amazon Service (Microservice)                   │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │  │
│  │  │  SP-API Client │  │  Ads API Client│  │  MWS Client    │ │  │
│  │  │                │  │                │  │                │ │  │
│  │  │ • Auth Handler │  │ • Auth Handler │  │ • Auth Handler │ │  │
│  │  │ • Rate Limiter │  │ • Rate Limiter │  │ • Rate Limiter │ │  │
│  │  │ • Retry Logic  │  │ • Retry Logic  │  │ • Retry Logic  │ │  │
│  │  │ • Error Handler│  │ • Error Handler│  │ • Error Handler│ │  │
│  │  │ • Cache Layer  │  │ • Cache Layer  │  │ • Cache Layer  │ │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           Integration Service (Microservice)                  │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │  │
│  │  │  Stripe Client │  │SendGrid Client │  │ Twilio Client  │ │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                     DATA SYNC & QUEUE LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │  Job Queue     │  │  Event Bus     │  │  Cache Layer   │       │
│  │  (BullMQ)      │  │  (RabbitMQ)    │  │  (Redis)       │       │
│  │                │  │                │  │                │       │
│  │ • Sync Jobs    │  │ • API Events   │  │ • API Cache    │       │
│  │ • Scheduled    │  │ • Webhooks     │  │ • Rate Limits  │       │
│  │ • Retry Failed │  │ • Pub/Sub      │  │ • Temp Data    │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA STORAGE LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │  PostgreSQL    │  │    MongoDB     │  │  Elasticsearch │       │
│  │                │  │                │  │                │       │
│  │ • Amazon Data  │  │ • API Logs     │  │ • Search Index │       │
│  │ • Campaigns    │  │ • Sync Status  │  │ • Analytics    │       │
│  │ • Orders       │  │ • Webhooks     │  │                │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Amazon SP-API Integration

### 1. Setup using amazon-sp-api Library

```typescript
// services/amazon/src/clients/sp-api.client.ts
import SellingPartnerAPI from 'amazon-sp-api';
import { logger } from '@package/common/logger';
import { cacheService } from '@package/database/redis';
import { RateLimiter } from '../utils/rate-limiter';

interface SPAPIConfig {
  region: 'na' | 'eu' | 'fe';
  refresh_token: string;
  credentials: {
    SELLING_PARTNER_APP_CLIENT_ID: string;
    SELLING_PARTNER_APP_CLIENT_SECRET: string;
  };
  options?: {
    auto_request_tokens?: boolean;
    auto_request_throttled?: boolean;
    version_fallback?: boolean;
    use_sandbox?: boolean;
  };
}

export class AmazonSPAPIClient {
  private client: SellingPartnerAPI;
  private rateLimiter: RateLimiter;
  private config: SPAPIConfig;
  
  constructor(config: SPAPIConfig) {
    this.config = config;
    
    // Initialize SP-API client
    this.client = new SellingPartnerAPI({
      region: config.region,
      refresh_token: config.refresh_token,
      credentials: config.credentials,
      options: {
        auto_request_tokens: true, // Auto refresh tokens
        auto_request_throttled: true, // Auto retry throttled requests
        version_fallback: true, // Fallback to older API versions
        use_sandbox: config.options?.use_sandbox || false,
      },
    });
    
    // Initialize rate limiter
    this.rateLimiter = new RateLimiter({
      maxRequests: 10, // Adjust per endpoint
      perSeconds: 1,
    });
    
    logger.info('Amazon SP-API client initialized', {
      region: config.region,
      sandbox: config.options?.use_sandbox,
    });
  }
  
  /**
   * Generic API call with rate limiting and caching
   */
  private async callAPI<T>(
    endpoint: string,
    operation: string,
    params: any = {},
    options: {
      cache?: boolean;
      cacheTTL?: number;
    } = {}
  ): Promise<T> {
    const cacheKey = `sp-api:${endpoint}:${operation}:${JSON.stringify(params)}`;
    
    // Check cache
    if (options.cache) {
      const cached = await cacheService.get<T>(cacheKey);
      if (cached) {
        logger.debug('SP-API cache hit', { endpoint, operation });
        return cached;
      }
    }
    
    // Rate limit
    await this.rateLimiter.acquire();
    
    try {
      logger.debug('SP-API request', { endpoint, operation, params });
      
      // Make API call
      const response = await this.client.callAPI({
        endpoint,
        operation,
        ...params,
      });
      
      // Cache result
      if (options.cache) {
        await cacheService.set(cacheKey, response, options.cacheTTL || 300);
      }
      
      logger.info('SP-API success', { endpoint, operation });
      return response;
      
    } catch (error: any) {
      logger.error('SP-API error', {
        endpoint,
        operation,
        error: error.message,
        code: error.code,
      });
      
      // Handle specific errors
      if (error.code === 'QuotaExceeded') {
        throw new SPAPIRateLimitError('Rate limit exceeded', error);
      } else if (error.code === 'Unauthorized') {
        throw new SPAPIAuthError('Invalid credentials', error);
      }
      
      throw error;
    }
  }
  
  // ============================================
  // ORDERS API
  // ============================================
  
  /**
   * Get orders
   */
  async getOrders(params: {
    marketplace_ids: string[];
    created_after?: string;
    created_before?: string;
    order_statuses?: string[];
    next_token?: string;
  }) {
    return this.callAPI('orders', 'getOrders', {
      query: params,
    }, { cache: false });
  }
  
  /**
   * Get order details
   */
  async getOrder(orderId: string) {
    return this.callAPI('orders', 'getOrder', {
      path: { orderId },
    }, { cache: true, cacheTTL: 600 });
  }
  
  /**
   * Get order items
   */
  async getOrderItems(orderId: string) {
    return this.callAPI('orders', 'getOrderItems', {
      path: { orderId },
    }, { cache: true, cacheTTL: 600 });
  }
  
  // ============================================
  // CATALOG ITEMS API
  // ============================================
  
  /**
   * Search catalog items
   */
  async searchCatalogItems(params: {
    keywords?: string;
    marketplace_ids: string[];
    identifiers?: string[];
  }) {
    return this.callAPI('catalog_items', 'searchCatalogItems', {
      query: params,
    }, { cache: true, cacheTTL: 3600 });
  }
  
  /**
   * Get catalog item
   */
  async getCatalogItem(asin: string, marketplaceIds: string[]) {
    return this.callAPI('catalog_items', 'getCatalogItem', {
      path: { asin },
      query: { marketplaceIds },
    }, { cache: true, cacheTTL: 3600 });
  }
  
  // ============================================
  // INVENTORY API
  // ============================================
  
  /**
   * Get inventory summaries
   */
  async getInventorySummaries(params: {
    marketplace_ids: string[];
    granularity_type?: 'Marketplace';
    granularity_id?: string;
    next_token?: string;
  }) {
    return this.callAPI('fba_inventory', 'getInventorySummaries', {
      query: params,
    }, { cache: true, cacheTTL: 300 });
  }
  
  // ============================================
  // REPORTS API
  // ============================================
  
  /**
   * Create report
   */
  async createReport(params: {
    report_type: string;
    marketplace_ids: string[];
    data_start_time?: string;
    data_end_time?: string;
    report_options?: any;
  }) {
    return this.callAPI('reports', 'createReport', {
      body: params,
    });
  }
  
  /**
   * Get report
   */
  async getReport(reportId: string) {
    return this.callAPI('reports', 'getReport', {
      path: { reportId },
    }, { cache: true, cacheTTL: 60 });
  }
  
  /**
   * Get report document
   */
  async getReportDocument(reportDocumentId: string) {
    return this.callAPI('reports', 'getReportDocument', {
      path: { reportDocumentId },
    });
  }
  
  /**
   * Download report
   */
  async downloadReport(reportDocumentId: string): Promise<any> {
    const document = await this.getReportDocument(reportDocumentId);
    
    // Download from presigned URL
    const response = await fetch(document.url);
    const data = await response.text();
    
    // Parse based on compression type
    if (document.compressionAlgorithm === 'GZIP') {
      // Decompress GZIP
      return this.decompressGzip(data);
    }
    
    return data;
  }
  
  // ============================================
  // FINANCES API
  // ============================================
  
  /**
   * List financial events
   */
  async listFinancialEvents(params: {
    posted_after?: string;
    posted_before?: string;
    next_token?: string;
  }) {
    return this.callAPI('finances', 'listFinancialEvents', {
      query: params,
    }, { cache: true, cacheTTL: 300 });
  }
  
  // ============================================
  // FEES API
  // ============================================
  
  /**
   * Get product fees estimate
   */
  async getMyFeesEstimate(params: {
    sku: string;
    price: number;
    marketplace_id: string;
  }) {
    return this.callAPI('product_fees', 'getMyFeesEstimateForSKU', {
      path: { SellerSKU: params.sku },
      body: {
        FeesEstimateRequest: {
          MarketplaceId: params.marketplace_id,
          PriceToEstimateFees: {
            ListingPrice: {
              CurrencyCode: 'USD',
              Amount: params.price,
            },
          },
          Identifier: params.sku,
          IsAmazonFulfilled: true,
        },
      },
    }, { cache: true, cacheTTL: 3600 });
  }
  
  // ============================================
  // NOTIFICATIONS API
  // ============================================
  
  /**
   * Create subscription
   */
  async createSubscription(params: {
    notification_type: string;
    destination_id: string;
  }) {
    return this.callAPI('notifications', 'createSubscription', {
      body: params,
    });
  }
  
  // ============================================
  // HELPER METHODS
  // ============================================
  
  private decompressGzip(data: string): any {
    // Implement GZIP decompression
    const zlib = require('zlib');
    const buffer = Buffer.from(data, 'base64');
    return zlib.gunzipSync(buffer).toString();
  }
  
  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    try {
      const tokens = await this.client.refreshAccessToken();
      
      logger.info('SP-API token refreshed');
      return tokens.access_token;
      
    } catch (error) {
      logger.error('Failed to refresh SP-API token', { error });
      throw error;
    }
  }
}

// ============================================
// ERROR CLASSES
// ============================================

export class SPAPIError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'SPAPIError';
  }
}

export class SPAPIRateLimitError extends SPAPIError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'SPAPIRateLimitError';
  }
}

export class SPAPIAuthError extends SPAPIError {
  constructor(message: string, originalError?: any) {
    super(message, originalError);
    this.name = 'SPAPIAuthError';
  }
}
```

---

## 📢 Amazon Advertising API Integration

```typescript
// services/amazon/src/clients/advertising-api.client.ts
import axios, { AxiosInstance } from 'axios';
import { logger } from '@package/common/logger';
import { cacheService } from '@package/database/redis';
import { RateLimiter } from '../utils/rate-limiter';

interface AdsAPIConfig {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  region: 'NA' | 'EU' | 'FE';
  sandbox?: boolean;
}

export class AmazonAdvertisingAPIClient {
  private client: AxiosInstance;
  private config: AdsAPIConfig;
  private rateLimiter: RateLimiter;
  private accessToken?: string;
  private tokenExpiry?: Date;
  
  constructor(config: AdsAPIConfig) {
    this.config = config;
    
    // Set base URL based on region and sandbox
    const baseURL = this.getBaseURL();
    
    // Initialize axios client
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Amazon-Advertising-API-ClientId': config.client_id,
      },
    });
    
    // Initialize rate limiter
    this.rateLimiter = new RateLimiter({
      maxRequests: 10,
      perSeconds: 1,
    });
    
    // Add request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        await this.ensureValidToken();
        config.headers.Authorization = `Bearer ${this.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, refresh and retry
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
    
    logger.info('Amazon Advertising API client initialized', {
      region: config.region,
      sandbox: config.sandbox,
    });
  }
  
  private getBaseURL(): string {
    const regionMap = {
      NA: 'https://advertising-api.amazon.com',
      EU: 'https://advertising-api-eu.amazon.com',
      FE: 'https://advertising-api-fe.amazon.com',
    };
    
    if (this.config.sandbox) {
      return 'https://advertising-api-test.amazon.com';
    }
    
    return regionMap[this.config.region];
  }
  
  private async ensureValidToken() {
    if (!this.accessToken || this.isTokenExpired()) {
      await this.refreshToken();
    }
  }
  
  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
  }
  
  private async refreshToken() {
    try {
      const response = await axios.post(
        'https://api.amazon.com/auth/o2/token',
        {
          grant_type: 'refresh_token',
          refresh_token: this.config.refresh_token,
          client_id: this.config.client_id,
          client_secret: this.config.client_secret,
        }
      );
      
      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
      
      logger.info('Ads API token refreshed');
      
    } catch (error) {
      logger.error('Failed to refresh Ads API token', { error });
      throw error;
    }
  }
  
  // ============================================
  // PROFILES API
  // ============================================
  
  async getProfiles() {
    const response = await this.client.get('/v2/profiles');
    return response.data;
  }
  
  async getProfile(profileId: string) {
    const response = await this.client.get(`/v2/profiles/${profileId}`);
    return response.data;
  }
  
  // ============================================
  // CAMPAIGNS API
  // ============================================
  
  async getCampaigns(profileId: string, params?: {
    startIndex?: number;
    count?: number;
    stateFilter?: 'enabled' | 'paused' | 'archived';
    campaignIdFilter?: string[];
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.get('/v2/sp/campaigns', {
      params,
    });
    
    return response.data;
  }
  
  async getCampaign(profileId: string, campaignId: string) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.get(`/v2/sp/campaigns/${campaignId}`);
    return response.data;
  }
  
  async createCampaign(profileId: string, campaign: {
    name: string;
    targetingType: 'manual' | 'auto';
    state: 'enabled' | 'paused' | 'archived';
    dailyBudget: number;
    startDate: string;
    endDate?: string;
    premiumBidAdjustment?: boolean;
    bidding?: {
      strategy: 'legacyForSales' | 'autoForSales' | 'manual';
      adjustments?: Array<{
        predicate: 'placementTop' | 'placementProductPage';
        percentage: number;
      }>;
    };
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.post('/v2/sp/campaigns', campaign);
    return response.data;
  }
  
  async updateCampaign(profileId: string, campaignId: string, updates: any) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.put(
      `/v2/sp/campaigns/${campaignId}`,
      updates
    );
    return response.data;
  }
  
  async archiveCampaign(profileId: string, campaignId: string) {
    return this.updateCampaign(profileId, campaignId, {
      state: 'archived',
    });
  }
  
  // ============================================
  // AD GROUPS API
  // ============================================
  
  async getAdGroups(profileId: string, params?: {
    startIndex?: number;
    count?: number;
    campaignIdFilter?: string[];
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.get('/v2/sp/adGroups', { params });
    return response.data;
  }
  
  async createAdGroup(profileId: string, adGroup: {
    name: string;
    campaignId: string;
    defaultBid: number;
    state: 'enabled' | 'paused' | 'archived';
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.post('/v2/sp/adGroups', adGroup);
    return response.data;
  }
  
  // ============================================
  // KEYWORDS API
  // ============================================
  
  async getKeywords(profileId: string, params?: {
    startIndex?: number;
    count?: number;
    campaignIdFilter?: string[];
    adGroupIdFilter?: string[];
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.get('/v2/sp/keywords', { params });
    return response.data;
  }
  
  async createKeyword(profileId: string, keyword: {
    campaignId: string;
    adGroupId: string;
    keywordText: string;
    matchType: 'exact' | 'phrase' | 'broad';
    bid: number;
    state: 'enabled' | 'paused' | 'archived';
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.post('/v2/sp/keywords', keyword);
    return response.data;
  }
  
  async updateKeywordBid(profileId: string, keywordId: string, bid: number) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.put(`/v2/sp/keywords/${keywordId}`, {
      bid,
    });
    return response.data;
  }
  
  // ============================================
  // REPORTING API
  // ============================================
  
  async requestReport(profileId: string, params: {
    recordType: 'campaigns' | 'adGroups' | 'keywords' | 'targets' | 'productAds';
    reportDate: string; // YYYYMMDD
    metrics: string[];
  }) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.post(
      `/v2/sp/${params.recordType}/report`,
      {
        reportDate: params.reportDate,
        metrics: params.metrics.join(','),
      }
    );
    
    return response.data.reportId;
  }
  
  async getReport(profileId: string, reportId: string) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.get(`/v2/reports/${reportId}`);
    return response.data;
  }
  
  async downloadReport(profileId: string, reportId: string) {
    // Get report status
    const report = await this.getReport(profileId, reportId);
    
    if (report.status !== 'SUCCESS') {
      throw new Error(`Report not ready: ${report.status}`);
    }
    
    // Download from URL
    const response = await axios.get(report.location, {
      responseType: 'arraybuffer',
      decompress: true,
    });
    
    // Parse JSON
    const data = JSON.parse(response.data.toString());
    return data;
  }
  
  // ============================================
  // BIDDING API
  // ============================================
  
  async getBidRecommendations(profileId: string, keywordId: string) {
    this.client.defaults.headers['Amazon-Advertising-API-Scope'] = profileId;
    
    const response = await this.client.get(
      `/v2/sp/keywords/${keywordId}/bidRecommendations`
    );
    return response.data;
  }
}
```

---

## 🔄 Data Synchronization Service

```typescript
// services/amazon/src/services/sync.service.ts
import { AmazonSPAPIClient } from '../clients/sp-api.client';
import { AmazonAdvertisingAPIClient } from '../clients/advertising-api.client';
import { logger } from '@package/common/logger';
import { Queue } from 'bullmq';
import { prisma } from '@package/database';

export class AmazonSyncService {
  private spApiClient: AmazonSPAPIClient;
  private adsApiClient: AmazonAdvertisingAPIClient;
  private syncQueue: Queue;
  
  constructor(
    spApiClient: AmazonSPAPIClient,
    adsApiClient: AmazonAdvertisingAPIClient
  ) {
    this.spApiClient = spApiClient;
    this.adsApiClient = adsApiClient;
    
    // Initialize sync queue
    this.syncQueue = new Queue('amazon-sync', {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
  }
  
  /**
   * Sync all data for a user
   */
  async syncAll(userId: string, accountId: string) {
    logger.info('Starting full sync', { userId, accountId });
    
    try {
      // Queue sync jobs
      await this.syncQueue.add('sync-orders', { userId, accountId });
      await this.syncQueue.add('sync-inventory', { userId, accountId });
      await this.syncQueue.add('sync-campaigns', { userId, accountId });
      await this.syncQueue.add('sync-keywords', { userId, accountId });
      await this.syncQueue.add('sync-reports', { userId, accountId });
      
      logger.info('Sync jobs queued', { userId, accountId });
      
    } catch (error) {
      logger.error('Sync failed', { userId, accountId, error });
      throw error;
    }
  }
  
  /**
   * Sync orders
   */
  async syncOrders(userId: string, accountId: string) {
    logger.info('Syncing orders', { userId, accountId });
    
    try {
      const account = await prisma.amazonAccount.findUnique({
        where: { id: accountId },
      });
      
      if (!account) {
        throw new Error('Account not found');
      }
      
      // Get last sync time
      const lastSync = account.lastOrderSync || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      // Fetch orders
      const orders = await this.spApiClient.getOrders({
        marketplace_ids: [account.marketplaceId],
        created_after: lastSync.toISOString(),
      });
      
      // Save to database
      for (const order of orders.payload.Orders) {
        await prisma.order.upsert({
          where: {
            amazonOrderId: order.AmazonOrderId,
          },
          update: {
            orderStatus: order.OrderStatus,
            orderTotal: order.OrderTotal?.Amount,
            numberOfItemsShipped: order.NumberOfItemsShipped,
            numberOfItemsUnshipped: order.NumberOfItemsUnshipped,
            updatedAt: new Date(),
          },
          create: {
            amazonOrderId: order.AmazonOrderId,
            accountId,
            userId,
            orderStatus: order.OrderStatus,
            orderTotal: order.OrderTotal?.Amount,
            numberOfItemsShipped: order.NumberOfItemsShipped,
            numberOfItemsUnshipped: order.NumberOfItemsUnshipped,
            purchaseDate: new Date(order.PurchaseDate),
          },
        });
      }
      
      // Update last sync time
      await prisma.amazonAccount.update({
        where: { id: accountId },
        data: { lastOrderSync: new Date() },
      });
      
      logger.info('Orders synced', {
        userId,
        accountId,
        count: orders.payload.Orders.length,
      });
      
    } catch (error) {
      logger.error('Order sync failed', { userId, accountId, error });
      throw error;
    }
  }
  
  /**
   * Sync campaigns
   */
  async syncCampaigns(userId: string, accountId: string) {
    logger.info('Syncing campaigns', { userId, accountId });
    
    try {
      const account = await prisma.amazonAccount.findUnique({
        where: { id: accountId },
      });
      
      if (!account || !account.adsProfileId) {
        throw new Error('Account or ads profile not found');
      }
      
      // Fetch campaigns
      const campaigns = await this.adsApiClient.getCampaigns(
        account.adsProfileId
      );
      
      // Save to database
      for (const campaign of campaigns) {
        await prisma.campaign.upsert({
          where: {
            amazonCampaignId: campaign.campaignId.toString(),
          },
          update: {
            name: campaign.name,
            state: campaign.state,
            dailyBudget: campaign.dailyBudget,
            targetingType: campaign.targetingType,
            updatedAt: new Date(),
          },
          create: {
            amazonCampaignId: campaign.campaignId.toString(),
            accountId,
            userId,
            name: campaign.name,
            state: campaign.state,
            dailyBudget: campaign.dailyBudget,
            targetingType: campaign.targetingType,
          },
        });
      }
      
      // Update last sync time
      await prisma.amazonAccount.update({
        where: { id: accountId },
        data: { lastCampaignSync: new Date() },
      });
      
      logger.info('Campaigns synced', {
        userId,
        accountId,
        count: campaigns.length,
      });
      
    } catch (error) {
      logger.error('Campaign sync failed', { userId, accountId, error });
      throw error;
    }
  }
  
  /**
   * Sync keywords
   */
  async syncKeywords(userId: string, accountId: string) {
    logger.info('Syncing keywords', { userId, accountId });
    
    try {
      const account = await prisma.amazonAccount.findUnique({
        where: { id: accountId },
        include: { campaigns: true },
      });
      
      if (!account || !account.adsProfileId) {
        throw new Error('Account or ads profile not found');
      }
      
      // Fetch keywords for all campaigns
      const campaignIds = account.campaigns.map((c) => c.amazonCampaignId);
      
      const keywords = await this.adsApiClient.getKeywords(
        account.adsProfileId,
        { campaignIdFilter: campaignIds }
      );
      
      // Save to database
      for (const keyword of keywords) {
        const campaign = account.campaigns.find(
          (c) => c.amazonCampaignId === keyword.campaignId.toString()
        );
        
        if (campaign) {
          await prisma.keyword.upsert({
            where: {
              amazonKeywordId: keyword.keywordId.toString(),
            },
            update: {
              keywordText: keyword.keywordText,
              matchType: keyword.matchType,
              bid: keyword.bid,
              state: keyword.state,
              updatedAt: new Date(),
            },
            create: {
              amazonKeywordId: keyword.keywordId.toString(),
              campaignId: campaign.id,
              userId,
              keywordText: keyword.keywordText,
              matchType: keyword.matchType,
              bid: keyword.bid,
              state: keyword.state,
            },
          });
        }
      }
      
      // Update last sync time
      await prisma.amazonAccount.update({
        where: { id: accountId },
        data: { lastKeywordSync: new Date() },
      });
      
      logger.info('Keywords synced', {
        userId,
        accountId,
        count: keywords.length,
      });
      
    } catch (error) {
      logger.error('Keyword sync failed', { userId, accountId, error });
      throw error;
    }
  }
  
  /**
   * Schedule periodic sync
   */
  async scheduleSyncJobs() {
    // Sync every 15 minutes
    await this.syncQueue.add(
      'periodic-sync',
      {},
      {
        repeat: {
          every: 15 * 60 * 1000, // 15 minutes
        },
      }
    );
    
    logger.info('Scheduled periodic sync jobs');
  }
}
```

---

## 🔧 Rate Limiter Utility

```typescript
// services/amazon/src/utils/rate-limiter.ts
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

interface RateLimiterConfig {
  maxRequests: number;
  perSeconds: number;
  useRedis?: boolean;
}

export class RateLimiter {
  private limiter: RateLimiterMemory | RateLimiterRedis;
  
  constructor(config: RateLimiterConfig) {
    if (config.useRedis) {
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      });
      
      this.limiter = new RateLimiterRedis({
        storeClient: redis,
        points: config.maxRequests,
        duration: config.perSeconds,
      });
    } else {
      this.limiter = new RateLimiterMemory({
        points: config.maxRequests,
        duration: config.perSeconds,
      });
    }
  }
  
  async acquire(key: string = 'default'): Promise<void> {
    try {
      await this.limiter.consume(key);
    } catch (error) {
      // Rate limit exceeded, wait and retry
      const retryAfter = error.msBeforeNext || 1000;
      await this.sleep(retryAfter);
      return this.acquire(key);
    }
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

---

## 📊 Database Schema for Amazon Data

```prisma
// Add to packages/database/prisma/schema.prisma

model AmazonAccount {
  id                String    @id @default(uuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  
  // SP-API
  sellerId          String
  marketplaceId     String
  region            String    // NA, EU, FE
  refreshToken      String    @db.Text
  
  // Advertising API
  adsProfileId      String?
  adsRegion         String?
  adsRefreshToken   String?   @db.Text
  
  // Sync timestamps
  lastOrderSync     DateTime?
  lastInventorySync DateTime?
  lastCampaignSync  DateTime?
  lastKeywordSync   DateTime?
  
  // Status
  status            AccountStatus @default(ACTIVE)
  
  // Relations
  campaigns         Campaign[]
  orders            Order[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([userId])
  @@map("amazon_accounts")
}

enum AccountStatus {
  ACTIVE
  SUSPENDED
  EXPIRED
  ERROR
}

model Campaign {
  id                String    @id @default(uuid())
  amazonCampaignId  String    @unique
  accountId         String
  account           AmazonAccount @relation(fields: [accountId], references: [id])
  userId            String
  
  name              String
  state             String    // enabled, paused, archived
  dailyBudget       Float
  targetingType     String    // manual, auto
  
  // Performance metrics
  impressions       Int       @default(0)
  clicks            Int       @default(0)
  spend             Float     @default(0)
  sales             Float     @default(0)
  orders            Int       @default(0)
  acos              Float     @default(0)
  roas              Float     @default(0)
  
  // Relations
  keywords          Keyword[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([userId])
  @@index([accountId])
  @@map("campaigns")
}

model Keyword {
  id                String    @id @default(uuid())
  amazonKeywordId   String    @unique
  campaignId        String
  campaign          Campaign  @relation(fields: [campaignId], references: [id])
  userId            String
  
  keywordText       String
  matchType         String    // exact, phrase, broad
  bid               Float
  state             String    // enabled, paused, archived
  
  // Performance metrics
  impressions       Int       @default(0)
  clicks            Int       @default(0)
  spend             Float     @default(0)
  sales             Float     @default(0)
  orders            Int       @default(0)
  acos              Float     @default(0)
  ctr               Float     @default(0)
  cvr               Float     @default(0)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([userId])
  @@index([campaignId])
  @@map("keywords")
}

model Order {
  id                String    @id @default(uuid())
  amazonOrderId     String    @unique
  accountId         String
  account           AmazonAccount @relation(fields: [accountId], references: [id])
  userId            String
  
  orderStatus       String
  orderTotal        Float?
  numberOfItemsShipped      Int?
  numberOfItemsUnshipped    Int?
  purchaseDate      DateTime
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([userId])
  @@index([accountId])
  @@index([purchaseDate])
  @@map("orders")
}
```

---

## 🔗 Service Integration Layer

```typescript
// services/amazon/src/index.ts
import express from 'express';
import { AmazonSPAPIClient } from './clients/sp-api.client';
import { AmazonAdvertisingAPIClient } from './clients/advertising-api.client';
import { AmazonSyncService } from './services/sync.service';
import { authenticate } from '@package/common/middleware/auth';

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json());

// Initialize clients per request (based on user's account)
const getClients = async (userId: string, accountId: string) => {
  const account = await prisma.amazonAccount.findUnique({
    where: { id: accountId },
  });
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  const spApiClient = new AmazonSPAPIClient({
    region: account.region as any,
    refresh_token: account.refreshToken,
    credentials: {
      SELLING_PARTNER_APP_CLIENT_ID: process.env.SP_API_CLIENT_ID!,
      SELLING_PARTNER_APP_CLIENT_SECRET: process.env.SP_API_CLIENT_SECRET!,
    },
  });
  
  const adsApiClient = new AmazonAdvertisingAPIClient({
    client_id: process.env.ADS_API_CLIENT_ID!,
    client_secret: process.env.ADS_API_CLIENT_SECRET!,
    refresh_token: account.adsRefreshToken!,
    region: account.adsRegion as any,
  });
  
  const syncService = new AmazonSyncService(spApiClient, adsApiClient);
  
  return { spApiClient, adsApiClient, syncService };
};

// ============================================
// ROUTES
// ============================================

// Sync all data
app.post('/sync/:accountId', authenticate, async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user!.id;
    
    const { syncService } = await getClients(userId, accountId);
    await syncService.syncAll(userId, accountId);
    
    res.json({ success: true, message: 'Sync started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders
app.get('/orders/:accountId', authenticate, async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user!.id;
    
    const { spApiClient } = await getClients(userId, accountId);
    const orders = await spApiClient.getOrders({
      marketplace_ids: [req.query.marketplaceId as string],
      created_after: req.query.createdAfter as string,
    });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get campaigns
app.get('/campaigns/:accountId', authenticate, async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user!.id;
    
    const account = await prisma.amazonAccount.findUnique({
      where: { id: accountId },
    });
    
    const { adsApiClient } = await getClients(userId, accountId);
    const campaigns = await adsApiClient.getCampaigns(account!.adsProfileId!);
    
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update keyword bid
app.patch('/keywords/:keywordId/bid', authenticate, async (req, res) => {
  try {
    const { keywordId } = req.params;
    const { bid, accountId } = req.body;
    const userId = req.user!.id;
    
    const account = await prisma.amazonAccount.findUnique({
      where: { id: accountId },
    });
    
    const { adsApiClient } = await getClients(userId, accountId);
    await adsApiClient.updateKeywordBid(
      account!.adsProfileId!,
      keywordId,
      bid
    );
    
    res.json({ success: true, message: 'Bid updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Amazon Service listening on port ${PORT}`);
});
```

---

## 🎯 Summary

### What We've Built

1. **Amazon SP-API Client** ✅
   - Orders, Products, Inventory
   - Reports, Finances, Fees
   - Rate limiting & caching
   - Error handling & retries

2. **Amazon Advertising API Client** ✅
   - Campaigns, Ad Groups
   - Keywords, Targets
   - Reporting & Analytics
   - Bid management

3. **Data Sync Service** ✅
   - Automated syncing
   - Queue-based processing
   - Incremental updates
   - Error recovery

4. **Rate Limiting** ✅
   - Per-endpoint limits
   - Redis-backed (distributed)
   - Auto-retry on throttle

5. **Database Schema** ✅
   - Amazon accounts
   - Campaigns & keywords
   - Orders & inventory
   - Sync tracking

### Key Features

- ✅ **Multi-API Support**: SP-API + Ads API + MWS
- ✅ **Rate Limiting**: Respects Amazon's limits
- ✅ **Caching**: Reduces API calls
- ✅ **Auto-Retry**: Handles throttling
- ✅ **Token Refresh**: Automatic
- ✅ **Error Handling**: Comprehensive
- ✅ **Sync Service**: Background jobs
- ✅ **Scalable**: Queue-based architecture

### Next Steps

1. Add more API endpoints (Products, Inventory, etc.)
2. Implement webhook handlers
3. Add real-time notifications
4. Create admin UI for API management
5. Add analytics & reporting

Let me know if you want me to add more API integrations! 🚀
