import { apiClient } from './api';

// Types
export interface Keyword {
  id: string;
  user_id: string;
  campaign_id: string;
  ad_group_id?: string | null;
  keyword_text: string;
  match_type: 'BROAD' | 'PHRASE' | 'EXACT';
  bid: number;
  status: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  amazon_keyword_id?: string | null;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KeywordPerformance {
  keyword_id: string;
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

export interface CreateKeywordRequest {
  campaign_id: string;
  ad_group_id?: string;
  keyword_text: string;
  match_type: 'BROAD' | 'PHRASE' | 'EXACT';
  bid: number;
  status?: 'ENABLED' | 'PAUSED';
}

export interface UpdateKeywordRequest {
  keyword_text?: string;
  match_type?: 'BROAD' | 'PHRASE' | 'EXACT';
  bid?: number;
  status?: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  ad_group_id?: string;
}

export interface BulkUpdateKeywordRequest {
  keyword_ids: string[];
  updates: {
    bid?: number;
    status?: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  };
}

export interface KeywordFilters {
  status?: string;
  match_type?: string;
  campaign_id?: string;
  ad_group_id?: string;
  search?: string;
  min_bid?: number;
  max_bid?: number;
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

// Keywords Service
export const keywordsService = {
  // List all keywords with filters
  async list(filters?: KeywordFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<Keyword[]>(`/keywords?${params.toString()}`);
    return response.data;
  },

  // Get keyword by ID
  async getById(id: string) {
    const response = await apiClient.get<Keyword>(`/keywords/${id}`);
    return response.data;
  },

  // Create new keyword
  async create(data: CreateKeywordRequest) {
    const response = await apiClient.post<Keyword>('/keywords', data);
    return response.data;
  },

  // Update keyword
  async update(id: string, data: UpdateKeywordRequest) {
    const response = await apiClient.put<Keyword>(`/keywords/${id}`, data);
    return response.data;
  },

  // Delete keyword
  async delete(id: string) {
    const response = await apiClient.delete(`/keywords/${id}`);
    return response.data;
  },

  // Bulk update keywords
  async bulkUpdate(data: BulkUpdateKeywordRequest) {
    const response = await apiClient.post<{ updated_count: number }>('/keywords/bulk', data);
    return response.data;
  },

  // Get keyword performance metrics
  async getPerformance(id: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const response = await apiClient.get<KeywordPerformance[]>(
      `/keywords/${id}/performance?${params.toString()}`
    );
    return response.data;
  },

  // Sync keywords from Amazon
  async sync(campaignId: string) {
    const response = await apiClient.post<SyncResponse>('/keywords/sync', { campaign_id: campaignId });
    return response.data;
  },
};

export default keywordsService;
