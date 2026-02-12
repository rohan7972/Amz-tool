import { apiClient } from './api';

// Types
export interface Campaign {
  id: string;
  user_id: string;
  account_id: string;
  name: string;
  targeting_type: 'MANUAL' | 'AUTO';
  daily_budget: number;
  start_date: string;
  end_date?: string | null;
  status: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  amazon_campaign_id?: string | null;
  amazon_profile_id?: string | null;
  portfolio_id?: string | null;
  premium_bid_adjustment?: number | null;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignPerformance {
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  conversion_rate: number;
  acos: number;
  roas: number;
}

export interface CreateCampaignRequest {
  account_id: string;
  name: string;
  targeting_type: 'MANUAL' | 'AUTO';
  daily_budget: number;
  start_date: string;
  end_date?: string;
  status?: 'ENABLED' | 'PAUSED';
  portfolio_id?: string;
  premium_bid_adjustment?: number;
}

export interface UpdateCampaignRequest {
  name?: string;
  daily_budget?: number;
  start_date?: string;
  end_date?: string;
  status?: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  portfolio_id?: string;
  premium_bid_adjustment?: number;
}

export interface CampaignFilters {
  status?: string;
  targeting_type?: string;
  account_id?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SyncResponse {
  success: boolean;
  synced_count: number;
  created_count: number;
  updated_count: number;
  failed_count: number;
  message: string;
}

// Campaigns Service
export const campaignsService = {
  // List all campaigns with filters
  async list(filters?: CampaignFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<Campaign[]>(`/campaigns?${params.toString()}`);
    return response.data;
  },

  // Get campaign by ID
  async getById(id: string) {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },

  // Create new campaign
  async create(data: CreateCampaignRequest) {
    const response = await apiClient.post<Campaign>('/campaigns', data);
    return response.data;
  },

  // Update campaign
  async update(id: string, data: UpdateCampaignRequest) {
    const response = await apiClient.put<Campaign>(`/campaigns/${id}`, data);
    return response.data;
  },

  // Delete campaign
  async delete(id: string) {
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
  },

  // Get campaign performance metrics
  async getPerformance(id: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await apiClient.get<CampaignPerformance[]>(
      `/campaigns/${id}/performance?${params.toString()}`
    );
    return response.data;
  },

  // Sync campaigns from Amazon
  async sync(accountId: string) {
    const response = await apiClient.post<SyncResponse>('/campaigns/sync', { account_id: accountId });
    return response.data;
  },
};

export default campaignsService;
