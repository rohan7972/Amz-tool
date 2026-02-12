/**
 * Amazon Advertising API Client
 * Handles authentication and API requests to Amazon Advertising API
 * Supports both sandbox (test) mode with mock data and production mode
 */

import { amazonApiConfig, getApiEndpoint, amazonApiEndpoints } from '../../config/amazon-api';
import { generateMockCampaigns, generateMockKeywords, generateMockPerformanceData } from './mock-data';

export interface AmazonCampaign {
  campaignId: string;
  name: string;
  state: 'enabled' | 'paused' | 'archived';
  campaignType: 'sponsoredProducts' | 'sponsoredBrands' | 'sponsoredDisplay';
  targetingType: 'manual' | 'auto';
  dailyBudget?: number;
  startDate?: string;
  endDate?: string;
  biddingStrategy?: string;
}

export interface AmazonKeyword {
  keywordId: string;
  campaignId: string;
  adGroupId: string;
  keywordText: string;
  matchType: 'exact' | 'phrase' | 'broad';
  bid: number;
  state: 'enabled' | 'paused' | 'archived';
}

export interface AmazonPerformanceMetrics {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  sales: number;
  orders: number;
}

interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export class AmazonAdvertisingApiClient {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private config = amazonApiConfig;
  private endpoint: string;

  constructor() {
    this.endpoint = getApiEndpoint(this.config);
    console.log(`[Amazon API] Initialized in ${this.config.sandbox ? 'SANDBOX' : 'PRODUCTION'} mode`);
    console.log(`[Amazon API] Endpoint: ${this.endpoint}`);
  }

  /**
   * Authenticate with Amazon Advertising API
   * In sandbox mode, returns mock token
   */
  async authenticate(): Promise<void> {
    if (this.config.sandbox) {
      // Mock authentication for testing
      this.accessToken = 'mock_access_token_' + Date.now();
      this.tokenExpiry = Date.now() + 3600 * 1000; // 1 hour
      console.log('[Amazon API] Mock authentication successful (sandbox mode)');
      return;
    }

    try {
      const response = await fetch(amazonApiEndpoints.auth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json() as AccessTokenResponse;
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      console.log('[Amazon API] Authentication successful');
    } catch (error) {
      console.error('[Amazon API] Authentication error:', error);
      throw error;
    }
  }

  /**
   * Check if access token is valid
   */
  private isTokenValid(): boolean {
    return this.accessToken !== null && 
           this.tokenExpiry !== null && 
           Date.now() < this.tokenExpiry;
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }
  }

  /**
   * Make authenticated request to Amazon Advertising API
   */
  private async makeRequest<T>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    await this.ensureAuthenticated();

    const url = `${this.endpoint}${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Amazon-Advertising-API-ClientId': this.config.clientId,
      'Content-Type': 'application/json',
    };

    if (this.config.profileId) {
      headers['Amazon-Advertising-API-Scope'] = this.config.profileId;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get all campaigns
   */
  async getCampaigns(): Promise<AmazonCampaign[]> {
    if (this.config.sandbox) {
      console.log('[Amazon API] Returning mock campaigns (sandbox mode)');
      return generateMockCampaigns();
    }

    try {
      return await this.makeRequest<AmazonCampaign[]>('/v2/sp/campaigns');
    } catch (error) {
      console.error('[Amazon API] Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaign(campaignId: string): Promise<AmazonCampaign> {
    if (this.config.sandbox) {
      const campaigns = generateMockCampaigns();
      const campaign = campaigns.find(c => c.campaignId === campaignId);
      if (!campaign) {
        throw new Error(`Campaign not found: ${campaignId}`);
      }
      return campaign;
    }

    return await this.makeRequest<AmazonCampaign>(`/v2/sp/campaigns/${campaignId}`);
  }

  /**
   * Create campaign
   */
  async createCampaign(campaign: Partial<AmazonCampaign>): Promise<AmazonCampaign> {
    if (this.config.sandbox) {
      console.log('[Amazon API] Mock campaign creation (sandbox mode)');
      return {
        campaignId: 'mock_camp_' + Date.now(),
        name: campaign.name || 'New Campaign',
        state: campaign.state || 'paused',
        campaignType: campaign.campaignType || 'sponsoredProducts',
        targetingType: campaign.targetingType || 'manual',
        dailyBudget: campaign.dailyBudget,
        biddingStrategy: campaign.biddingStrategy || 'legacyForSales',
      };
    }

    return await this.makeRequest<AmazonCampaign>('/v2/sp/campaigns', 'POST', campaign);
  }

  /**
   * Update campaign
   */
  async updateCampaign(campaignId: string, updates: Partial<AmazonCampaign>): Promise<AmazonCampaign> {
    if (this.config.sandbox) {
      console.log(`[Amazon API] Mock campaign update: ${campaignId} (sandbox mode)`);
      const campaign = await this.getCampaign(campaignId);
      return { ...campaign, ...updates };
    }

    return await this.makeRequest<AmazonCampaign>(
      `/v2/sp/campaigns/${campaignId}`,
      'PUT',
      updates
    );
  }

  /**
   * Get keywords
   */
  async getKeywords(campaignId?: string): Promise<AmazonKeyword[]> {
    if (this.config.sandbox) {
      console.log('[Amazon API] Returning mock keywords (sandbox mode)');
      return generateMockKeywords(campaignId);
    }

    const path = campaignId 
      ? `/v2/sp/keywords?campaignIdFilter=${campaignId}`
      : '/v2/sp/keywords';
    
    return await this.makeRequest<AmazonKeyword[]>(path);
  }

  /**
   * Get keyword by ID
   */
  async getKeyword(keywordId: string): Promise<AmazonKeyword> {
    if (this.config.sandbox) {
      const keywords = generateMockKeywords();
      const keyword = keywords.find(k => k.keywordId === keywordId);
      if (!keyword) {
        throw new Error(`Keyword not found: ${keywordId}`);
      }
      return keyword;
    }

    return await this.makeRequest<AmazonKeyword>(`/v2/sp/keywords/${keywordId}`);
  }

  /**
   * Create keyword
   */
  async createKeyword(keyword: Partial<AmazonKeyword>): Promise<AmazonKeyword> {
    if (this.config.sandbox) {
      console.log('[Amazon API] Mock keyword creation (sandbox mode)');
      return {
        keywordId: 'mock_kw_' + Date.now(),
        campaignId: keyword.campaignId || 'mock_camp_001',
        adGroupId: keyword.adGroupId || 'mock_ag_001',
        keywordText: keyword.keywordText || 'new keyword',
        matchType: keyword.matchType || 'phrase',
        bid: keyword.bid || 1.0,
        state: keyword.state || 'paused',
      };
    }

    return await this.makeRequest<AmazonKeyword>('/v2/sp/keywords', 'POST', keyword);
  }

  /**
   * Update keyword
   */
  async updateKeyword(keywordId: string, updates: Partial<AmazonKeyword>): Promise<AmazonKeyword> {
    if (this.config.sandbox) {
      console.log(`[Amazon API] Mock keyword update: ${keywordId} (sandbox mode)`);
      const keyword = await this.getKeyword(keywordId);
      return { ...keyword, ...updates };
    }

    return await this.makeRequest<AmazonKeyword>(
      `/v2/sp/keywords/${keywordId}`,
      'PUT',
      updates
    );
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(
    entityType: 'campaigns' | 'keywords',
    startDate: string,
    endDate: string
  ): Promise<AmazonPerformanceMetrics[]> {
    if (this.config.sandbox) {
      console.log('[Amazon API] Returning mock performance data (sandbox mode)');
      return generateMockPerformanceData(startDate, endDate);
    }

    // In production, this would use the Reporting API
    // which involves creating a report, waiting for it to complete, then downloading
    const reportType = entityType === 'campaigns' ? 'spCampaigns' : 'spKeywords';
    
    // This is a simplified version - real implementation would be more complex
    return await this.makeRequest<AmazonPerformanceMetrics[]>(
      `/v2/reports/${reportType}`,
      'POST',
      {
        startDate,
        endDate,
        metrics: 'impressions,clicks,cost,sales,orders',
      }
    );
  }

  /**
   * Delete keyword (archive)
   */
  async deleteKeyword(keywordId: string): Promise<void> {
    if (this.config.sandbox) {
      console.log(`[Amazon API] Mock keyword deletion: ${keywordId} (sandbox mode)`);
      return;
    }

    await this.updateKeyword(keywordId, { state: 'archived' });
  }

  /**
   * Archive campaign
   */
  async archiveCampaign(campaignId: string): Promise<void> {
    if (this.config.sandbox) {
      console.log(`[Amazon API] Mock campaign archival: ${campaignId} (sandbox mode)`);
      return;
    }

    await this.updateCampaign(campaignId, { state: 'archived' });
  }
}

// Singleton instance
export const amazonApiClient = new AmazonAdvertisingApiClient();
