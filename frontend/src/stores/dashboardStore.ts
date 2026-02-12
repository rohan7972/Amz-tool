import { create } from 'zustand';

export interface KPIData {
  totalSales: number;
  orders: number;
  unitsSold: number;
  aov: number;
  adSpend: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cvr: number;
  cpc: number;
}

export interface PerformanceData {
  date: string;
  sales: number;
  adSpend: number;
  orders: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface ProductData {
  id: string;
  asin: string;
  title: string;
  sales: number;
  orders: number;
  units: number;
  adSpend: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cvr: number;
}

export interface CampaignData {
  id: string;
  name: string;
  type: 'SP' | 'SB' | 'SD';
  status: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  budget: number;
  sales: number;
  adSpend: number;
  acos: number;
  roas: number;
  impressions: number;
  clicks: number;
  orders: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DashboardState {
  // Data
  kpiData: KPIData | null;
  performanceData: PerformanceData[];
  productData: ProductData[];
  campaignData: CampaignData[];
  
  // UI State
  dateRange: DateRange;
  selectedMetric: string;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  selectedAccount: string | null;
  selectedCampaignType: string | null;
  searchQuery: string;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

interface DashboardActions {
  // Data actions
  setKPIData: (data: KPIData) => void;
  setPerformanceData: (data: PerformanceData[]) => void;
  setProductData: (data: ProductData[]) => void;
  setCampaignData: (data: CampaignData[]) => void;
  
  // UI actions
  setDateRange: (range: DateRange) => void;
  setSelectedMetric: (metric: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter actions
  setSelectedAccount: (account: string | null) => void;
  setSelectedCampaignType: (type: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  
  // Utility actions
  clearError: () => void;
  resetFilters: () => void;
  refreshData: () => void;
}

export type DashboardStore = DashboardState & DashboardActions;

// Default date range (last 30 days)
const getDefaultDateRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  return { startDate, endDate };
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  // Initial state
  kpiData: null,
  performanceData: [],
  productData: [],
  campaignData: [],
  
  dateRange: getDefaultDateRange(),
  selectedMetric: 'sales',
  isLoading: false,
  error: null,
  
  selectedAccount: null,
  selectedCampaignType: null,
  searchQuery: '',
  
  currentPage: 1,
  pageSize: 25,
  totalItems: 0,

  // Data actions
  setKPIData: (kpiData: KPIData) => {
    set({ kpiData });
  },

  setPerformanceData: (performanceData: PerformanceData[]) => {
    set({ performanceData });
  },

  setProductData: (productData: ProductData[]) => {
    set({ productData });
  },

  setCampaignData: (campaignData: CampaignData[]) => {
    set({ campaignData });
  },

  // UI actions
  setDateRange: (dateRange: DateRange) => {
    set({ dateRange, currentPage: 1 }); // Reset pagination when date changes
  },

  setSelectedMetric: (selectedMetric: string) => {
    set({ selectedMetric });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  // Filter actions
  setSelectedAccount: (selectedAccount: string | null) => {
    set({ selectedAccount, currentPage: 1 }); // Reset pagination when filter changes
  },

  setSelectedCampaignType: (selectedCampaignType: string | null) => {
    set({ selectedCampaignType, currentPage: 1 });
  },

  setSearchQuery: (searchQuery: string) => {
    set({ searchQuery, currentPage: 1 });
  },

  // Pagination actions
  setCurrentPage: (currentPage: number) => {
    set({ currentPage });
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, currentPage: 1 }); // Reset to first page when page size changes
  },

  setTotalItems: (totalItems: number) => {
    set({ totalItems });
  },

  // Utility actions
  clearError: () => {
    set({ error: null });
  },

  resetFilters: () => {
    set({
      selectedAccount: null,
      selectedCampaignType: null,
      searchQuery: '',
      currentPage: 1,
      dateRange: getDefaultDateRange(),
    });
  },

  refreshData: () => {
    // This will be implemented to trigger data refresh
    set({ isLoading: true, error: null });
  },
}));

// Helper hooks for specific dashboard sections
export const useDashboardKPI = () => {
  const store = useDashboardStore();
  return {
    data: store.kpiData,
    isLoading: store.isLoading,
    error: store.error,
    setData: store.setKPIData,
  };
};

export const useDashboardPerformance = () => {
  const store = useDashboardStore();
  return {
    data: store.performanceData,
    selectedMetric: store.selectedMetric,
    dateRange: store.dateRange,
    isLoading: store.isLoading,
    setData: store.setPerformanceData,
    setMetric: store.setSelectedMetric,
    setDateRange: store.setDateRange,
  };
};

export const useDashboardProducts = () => {
  const store = useDashboardStore();
  return {
    data: store.productData,
    searchQuery: store.searchQuery,
    currentPage: store.currentPage,
    pageSize: store.pageSize,
    totalItems: store.totalItems,
    isLoading: store.isLoading,
    setData: store.setProductData,
    setSearchQuery: store.setSearchQuery,
    setCurrentPage: store.setCurrentPage,
    setPageSize: store.setPageSize,
    setTotalItems: store.setTotalItems,
  };
};

export const useDashboardFilters = () => {
  const store = useDashboardStore();
  return {
    selectedAccount: store.selectedAccount,
    selectedCampaignType: store.selectedCampaignType,
    searchQuery: store.searchQuery,
    dateRange: store.dateRange,
    setSelectedAccount: store.setSelectedAccount,
    setSelectedCampaignType: store.setSelectedCampaignType,
    setSearchQuery: store.setSearchQuery,
    setDateRange: store.setDateRange,
    resetFilters: store.resetFilters,
  };
};