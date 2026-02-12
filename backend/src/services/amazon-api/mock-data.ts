/**
 * Mock data generator for Amazon Advertising API
 * Used in sandbox mode for testing without real API credentials
 */

import { AmazonCampaign, AmazonKeyword, AmazonPerformanceMetrics } from './client';

/**
 * Generate mock campaigns
 */
export function generateMockCampaigns(): AmazonCampaign[] {
  return [
    {
      campaignId: 'mock_camp_001',
      name: 'Premium Headphones - Brand Campaign',
      state: 'enabled',
      campaignType: 'sponsoredProducts',
      targetingType: 'manual',
      dailyBudget: 150.00,
      startDate: '2024-01-01',
      biddingStrategy: 'legacyForSales',
    },
    {
      campaignId: 'mock_camp_002',
      name: 'Holiday Sale - Wireless Earbuds',
      state: 'enabled',
      campaignType: 'sponsoredProducts',
      targetingType: 'manual',
      dailyBudget: 200.00,
      startDate: '2024-11-01',
      biddingStrategy: 'autoForSales',
    },
    {
      campaignId: 'mock_camp_003',
      name: 'Budget Speakers - Auto Targeting',
      state: 'paused',
      campaignType: 'sponsoredProducts',
      targetingType: 'auto',
      dailyBudget: 75.00,
      startDate: '2024-06-01',
      biddingStrategy: 'autoForSales',
    },
    {
      campaignId: 'mock_camp_004',
      name: 'AudioTech Brand Store',
      state: 'enabled',
      campaignType: 'sponsoredBrands',
      targetingType: 'manual',
      dailyBudget: 300.00,
      startDate: '2024-03-01',
      biddingStrategy: 'manual',
    },
    {
      campaignId: 'mock_camp_005',
      name: 'Retargeting - Previous Customers',
      state: 'enabled',
      campaignType: 'sponsoredDisplay',
      targetingType: 'auto',
      dailyBudget: 100.00,
      startDate: '2024-02-15',
      biddingStrategy: 'autoForSales',
    },
  ];
}

/**
 * Generate mock keywords
 */
export function generateMockKeywords(campaignId?: string): AmazonKeyword[] {
  const allKeywords: AmazonKeyword[] = [
    {
      keywordId: 'mock_kw_001',
      campaignId: 'mock_camp_001',
      adGroupId: 'mock_ag_001',
      keywordText: 'noise cancelling headphones',
      matchType: 'exact',
      bid: 1.75,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_002',
      campaignId: 'mock_camp_001',
      adGroupId: 'mock_ag_001',
      keywordText: 'best noise cancelling headphones',
      matchType: 'phrase',
      bid: 1.50,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_003',
      campaignId: 'mock_camp_001',
      adGroupId: 'mock_ag_002',
      keywordText: 'wireless headphones',
      matchType: 'broad',
      bid: 0.85,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_004',
      campaignId: 'mock_camp_001',
      adGroupId: 'mock_ag_002',
      keywordText: 'bluetooth headphones',
      matchType: 'phrase',
      bid: 1.10,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_005',
      campaignId: 'mock_camp_002',
      adGroupId: 'mock_ag_003',
      keywordText: 'wireless earbuds',
      matchType: 'exact',
      bid: 1.20,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_006',
      campaignId: 'mock_camp_002',
      adGroupId: 'mock_ag_003',
      keywordText: 'true wireless earbuds',
      matchType: 'phrase',
      bid: 0.95,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_007',
      campaignId: 'mock_camp_002',
      adGroupId: 'mock_ag_003',
      keywordText: 'bluetooth earbuds waterproof',
      matchType: 'phrase',
      bid: 0.80,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_008',
      campaignId: 'mock_camp_004',
      adGroupId: 'mock_ag_004',
      keywordText: 'audiotech headphones',
      matchType: 'exact',
      bid: 3.50,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_009',
      campaignId: 'mock_camp_004',
      adGroupId: 'mock_ag_004',
      keywordText: 'audiotech brand',
      matchType: 'phrase',
      bid: 2.75,
      state: 'enabled',
    },
    {
      keywordId: 'mock_kw_010',
      campaignId: 'mock_camp_001',
      adGroupId: 'mock_ag_001',
      keywordText: 'active noise cancellation',
      matchType: 'phrase',
      bid: 1.40,
      state: 'enabled',
    },
  ];

  if (campaignId) {
    return allKeywords.filter(k => k.campaignId === campaignId);
  }

  return allKeywords;
}

/**
 * Generate mock performance data
 */
export function generateMockPerformanceData(
  startDate: string,
  endDate: string
): AmazonPerformanceMetrics[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: AmazonPerformanceMetrics[] = [];

  // Generate daily performance data
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    // Generate realistic-looking performance data with some randomness
    const baseImpressions = 800 + Math.floor(Math.random() * 1200);
    const clicks = Math.floor(baseImpressions * (0.015 + Math.random() * 0.035)); // 1.5-5% CTR
    const cost = clicks * (0.50 + Math.random() * 1.50); // $0.50-$2.00 CPC
    const orders = Math.floor(clicks * (0.05 + Math.random() * 0.15)); // 5-20% CVR
    const sales = cost * (1.5 + Math.random() * 3.5); // 150-500% ROAS

    data.push({
      date: dateStr,
      impressions: baseImpressions,
      clicks,
      cost: parseFloat(cost.toFixed(2)),
      sales: parseFloat(sales.toFixed(2)),
      orders,
    });
  }

  return data;
}

/**
 * Generate random performance metrics for a single entity
 */
export function generateRandomMetrics() {
  const impressions = 500 + Math.floor(Math.random() * 1500);
  const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.04));
  const spend = clicks * (0.50 + Math.random() * 2.00);
  const sales = spend * (1.5 + Math.random() * 4.0);
  const orders = Math.floor(clicks * (0.05 + Math.random() * 0.15));

  return {
    impressions,
    clicks,
    spend: parseFloat(spend.toFixed(2)),
    sales: parseFloat(sales.toFixed(2)),
    orders,
    ctr: parseFloat((clicks / impressions * 100).toFixed(2)),
    cpc: parseFloat((spend / clicks).toFixed(2)),
    acos: parseFloat((spend / sales * 100).toFixed(2)),
  };
}
