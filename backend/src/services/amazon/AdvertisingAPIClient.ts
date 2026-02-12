import axios, { AxiosInstance } from 'axios';
import { AmazonAccount } from '../../models/AmazonAccount';
import { logger } from '../../utils/logger';

interface AdvertisingAPICredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface LWATokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

interface Profile {
  profileId: string;
  countryCode: string;
  currencyCode: string;
  dailyBudget?: number;
  timezone: string;
  accountInfo: {
    marketplaceStringId: string;
    id: string;
    type: string;
    name: string;
    subType?: string;
    validPaymentMethod: boolean;
  };
}

export class AdvertisingAPIClient {
  private credentials: AdvertisingAPICredentials;
  private endpoint: string;
  private accessToken?: string;
  private tokenExpiresAt?: Date;
  private axiosInstance: AxiosInstance;
  private profileId?: string;

  constructor(account: AmazonAccount, credentials: AdvertisingAPICredentials) {
    this.credentials = credentials;
    
    // Determine endpoint based on marketplace
    const marketplaceInfo = account.getMarketplaceInfo();
    this.endpoint = this.getAdvertisingEndpoint(marketplaceInfo.region);
    
    this.axiosInstance = axios.create({
      baseURL: this.endpoint,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Amazon-FDC-Tool/1.0.0',
      },
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        await this.ensureValidToken();
        config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        
        // Add profile ID if available and not already set
        if (this.profileId && !config.headers['Amazon-Advertising-API-Scope']) {
          config.headers['Amazon-Advertising-API-Scope'] = this.profileId;
        }
        
        return config;
      },
      (error) => {
        logger.error('Advertising API request interceptor error', { error: error.message });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Advertising API response error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  private getAdvertisingEndpoint(region: string): string {
    const endpoints: Record<string, string> = {
      'us-east-1': 'https://advertising-api.amazon.com',
      'us-west-2': 'https://advertising-api-fe.amazon.com',
      'eu-west-1': 'https://advertising-api-eu.amazon.com',
    };
    return endpoints[region] || endpoints['us-east-1'];
  }

  private async ensureValidToken(): Promise<void> {
    if (this.accessToken && this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return; // Token is still valid
    }

    await this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await axios.post<LWATokenResponse>(
        'https://api.amazon.com/auth/o2/token',
        {
          grant_type: 'refresh_token',
          refresh_token: this.credentials.refreshToken,
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = new Date(Date.now() + (response.data.expires_in - 60) * 1000); // Refresh 1 minute early

      logger.info('Advertising API access token refreshed successfully');
    } catch (error: any) {
      logger.error('Failed to refresh Advertising API access token', { error: error.message });
      throw new Error('Failed to authenticate with Amazon Advertising API');
    }
  }

  setProfileId(profileId: string): void {
    this.profileId = profileId;
  }

  // Profile Management
  async getProfiles(): Promise<Profile[]> {
    try {
      const response = await this.axiosInstance.get('/v2/profiles');
      return response.data;
    } catch (error) {
      logger.error('Failed to get profiles from Advertising API', { error });
      throw error;
    }
  }

  async getProfile(profileId: string): Promise<Profile> {
    try {
      const response = await this.axiosInstance.get(`/v2/profiles/${profileId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get profile from Advertising API', { error, profileId });
      throw error;
    }
  }

  // Campaign Management
  async getCampaigns(params?: {
    startIndex?: number;
    count?: number;
    stateFilter?: string;
    campaignTypeFilter?: string;
    nameFilter?: string;
  }) {
    try {
      const response = await this.axiosInstance.get('/v2/sp/campaigns', { params });
      return response.data;
    } catch (error) {
      logger.error('Failed to get campaigns from Advertising API', { error });
      throw error;
    }
  }

  async getCampaign(campaignId: string) {
    try {
      const response = await this.axiosInstance.get(`/v2/sp/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get campaign from Advertising API', { error, campaignId });
      throw error;
    }
  }

  async createCampaign(campaign: {
    name: string;
    campaignType: 'sponsoredProducts' | 'sponsoredBrands' | 'sponsoredDisplay';
    targetingType: 'manual' | 'auto';
    state: 'enabled' | 'paused' | 'archived';
    dailyBudget: number;
    startDate: string;
    endDate?: string;
    premiumBidAdjustment?: boolean;
    bidding?: {
      strategy: 'legacyForSales' | 'autoForSales' | 'manual';
      adjustments?: Array<{
        predicate: string;
        percentage: number;
      }>;
    };
  }) {
    try {
      const response = await this.axiosInstance.post('/v2/sp/campaigns', campaign);
      return response.data;
    } catch (error) {
      logger.error('Failed to create campaign in Advertising API', { error });
      throw error;
    }
  }

  async updateCampaign(campaignId: string, updates: Partial<{
    name: string;
    state: 'enabled' | 'paused' | 'archived';
    dailyBudget: number;
    startDate: string;
    endDate: string;
    premiumBidAdjustment: boolean;
    bidding: {
      strategy: 'legacyForSales' | 'autoForSales' | 'manual';
      adjustments?: Array<{
        predicate: string;
        percentage: number;
      }>;
    };
  }>) {
    try {
      const response = await this.axiosInstance.put(`/v2/sp/campaigns/${campaignId}`, updates);
      return response.data;
    } catch (error) {
      logger.error('Failed to update campaign in Advertising API', { error, campaignId });
      throw error;
    }
  }

  // Ad Group Management
  async getAdGroups(params?: {
    startIndex?: number;
    count?: number;
    stateFilter?: string;
    campaignIdFilter?: string;
    adGroupIdFilter?: string;
    nameFilter?: string;
  }) {
    try {
      const response = await this.axiosInstance.get('/v2/sp/adGroups', { params });
      return response.data;
    } catch (error) {
      logger.error('Failed to get ad groups from Advertising API', { error });
      throw error;
    }
  }

  async createAdGroup(adGroup: {
    name: string;
    campaignId: string;
    defaultBid: number;
    state: 'enabled' | 'paused' | 'archived';
  }) {
    try {
      const response = await this.axiosInstance.post('/v2/sp/adGroups', adGroup);
      return response.data;
    } catch (error) {
      logger.error('Failed to create ad group in Advertising API', { error });
      throw error;
    }
  }

  // Keyword Management
  async getKeywords(params?: {
    startIndex?: number;
    count?: number;
    stateFilter?: string;
    campaignIdFilter?: string;
    adGroupIdFilter?: string;
    keywordIdFilter?: string;
    matchTypeFilter?: string;
    keywordText?: string;
  }) {
    try {
      const response = await this.axiosInstance.get('/v2/sp/keywords', { params });
      return response.data;
    } catch (error) {
      logger.error('Failed to get keywords from Advertising API', { error });
      throw error;
    }
  }

  async createKeywords(keywords: Array<{
    campaignId: string;
    adGroupId: string;
    keywordText: string;
    matchType: 'exact' | 'phrase' | 'broad';
    state: 'enabled' | 'paused' | 'archived';
    bid?: number;
  }>) {
    try {
      const response = await this.axiosInstance.post('/v2/sp/keywords', keywords);
      return response.data;
    } catch (error) {
      logger.error('Failed to create keywords in Advertising API', { error });
      throw error;
    }
  }

  async updateKeywords(keywords: Array<{
    keywordId: string;
    state?: 'enabled' | 'paused' | 'archived';
    bid?: number;
  }>) {
    try {
      const response = await this.axiosInstance.put('/v2/sp/keywords', keywords);
      return response.data;
    } catch (error) {
      logger.error('Failed to update keywords in Advertising API', { error });
      throw error;
    }
  }

  // Product Ads Management
  async getProductAds(params?: {
    startIndex?: number;
    count?: number;
    stateFilter?: string;
    campaignIdFilter?: string;
    adGroupIdFilter?: string;
    adIdFilter?: string;
    skuFilter?: string;
    asinFilter?: string;
  }) {
    try {
      const response = await this.axiosInstance.get('/v2/sp/productAds', { params });
      return response.data;
    } catch (error) {
      logger.error('Failed to get product ads from Advertising API', { error });
      throw error;
    }
  }

  async createProductAds(productAds: Array<{
    campaignId: string;
    adGroupId: string;
    sku?: string;
    asin?: string;
    state: 'enabled' | 'paused' | 'archived';
  }>) {
    try {
      const response = await this.axiosInstance.post('/v2/sp/productAds', productAds);
      return response.data;
    } catch (error) {
      logger.error('Failed to create product ads in Advertising API', { error });
      throw error;
    }
  }

  // Reporting
  async requestReport(reportType: string, params: {
    reportDate?: string;
    campaignType: 'sponsoredProducts' | 'sponsoredBrands' | 'sponsoredDisplay';
    segment?: string;
    metrics: string[];
    filters?: Record<string, any>;
  }) {
    try {
      const reportData = {
        reportDate: params.reportDate || new Date().toISOString().split('T')[0],
        metrics: params.metrics.join(','),
        ...params.filters,
      };

      const response = await this.axiosInstance.post(`/v2/reports`, {
        reportType,
        ...reportData,
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to request report from Advertising API', { error, reportType });
      throw error;
    }
  }

  async getReport(reportId: string) {
    try {
      const response = await this.axiosInstance.get(`/v2/reports/${reportId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get report from Advertising API', { error, reportId });
      throw error;
    }
  }

  async downloadReport(url: string) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Amazon-FDC-Tool/1.0.0',
        },
        responseType: 'stream',
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to download report', { error, url });
      throw error;
    }
  }

  // Negative Keywords
  async getNegativeKeywords(params?: {
    startIndex?: number;
    count?: number;
    stateFilter?: string;
    campaignIdFilter?: string;
    adGroupIdFilter?: string;
    keywordText?: string;
    matchTypeFilter?: string;
  }) {
    try {
      const response = await this.axiosInstance.get('/v2/sp/negativeKeywords', { params });
      return response.data;
    } catch (error) {
      logger.error('Failed to get negative keywords from Advertising API', { error });
      throw error;
    }
  }

  async createNegativeKeywords(negativeKeywords: Array<{
    campaignId?: string;
    adGroupId?: string;
    keywordText: string;
    matchType: 'negativeExact' | 'negativePhrase' | 'negativeBroad';
    state: 'enabled' | 'paused' | 'archived';
  }>) {
    try {
      const response = await this.axiosInstance.post('/v2/sp/negativeKeywords', negativeKeywords);
      return response.data;
    } catch (error) {
      logger.error('Failed to create negative keywords in Advertising API', { error });
      throw error;
    }
  }
}