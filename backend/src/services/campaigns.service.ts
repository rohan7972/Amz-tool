/**
 * Campaigns Service
 * Business logic for campaign management
 * Integrates with both database and Amazon API
 */

import { db } from '../database/connection';
import { amazonApiClient } from './amazon-api/client';

export interface Campaign {
  id: string;
  amazonCampaignId?: string;
  name: string;
  status: 'enabled' | 'paused' | 'archived';
  campaignType: 'sponsoredProducts' | 'sponsoredBrands' | 'sponsoredDisplay';
  targetingType?: 'manual' | 'auto';
  dailyBudget?: number;
  lifetimeBudget?: number;
  startDate?: string;
  endDate?: string;
  biddingStrategy?: string;
  defaultBid?: number;
  userId: string;
  accountId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  syncedAt?: Date;
}

export interface CampaignWithMetrics extends Campaign {
  impressions?: number;
  clicks?: number;
  spend?: number;
  sales?: number;
  orders?: number;
  ctr?: number;
  cpc?: number;
  acos?: number;
}

export class CampaignsService {
  /**
   * Get all campaigns for a user
   */
  async getAllCampaigns(userId: string): Promise<CampaignWithMetrics[]> {
    const query = `
      SELECT 
        c.*,
        COALESCE(SUM(pm.impressions), 0) as impressions,
        COALESCE(SUM(pm.clicks), 0) as clicks,
        COALESCE(SUM(pm.spend), 0) as spend,
        COALESCE(SUM(pm.sales), 0) as sales,
        COALESCE(SUM(pm.orders), 0) as orders,
        CASE 
          WHEN SUM(pm.impressions) > 0 
          THEN ROUND((SUM(pm.clicks)::DECIMAL / SUM(pm.impressions) * 100), 2)
          ELSE 0 
        END as ctr,
        CASE 
          WHEN SUM(pm.clicks) > 0 
          THEN ROUND((SUM(pm.spend) / SUM(pm.clicks)), 2)
          ELSE 0 
        END as cpc,
        CASE 
          WHEN SUM(pm.sales) > 0 
          THEN ROUND((SUM(pm.spend) / SUM(pm.sales) * 100), 2)
          ELSE 0 
        END as acos
      FROM campaigns c
      LEFT JOIN performance_metrics pm 
        ON pm.entity_type = 'campaign' 
        AND pm.entity_id = c.id
        AND pm.date >= CURRENT_DATE - INTERVAL '30 days'
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows.map(this.mapCampaignFromDb);
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(campaignId: string, userId: string): Promise<CampaignWithMetrics | null> {
    const query = `
      SELECT 
        c.*,
        COALESCE(SUM(pm.impressions), 0) as impressions,
        COALESCE(SUM(pm.clicks), 0) as clicks,
        COALESCE(SUM(pm.spend), 0) as spend,
        COALESCE(SUM(pm.sales), 0) as sales,
        COALESCE(SUM(pm.orders), 0) as orders,
        CASE 
          WHEN SUM(pm.impressions) > 0 
          THEN ROUND((SUM(pm.clicks)::DECIMAL / SUM(pm.impressions) * 100), 2)
          ELSE 0 
        END as ctr,
        CASE 
          WHEN SUM(pm.clicks) > 0 
          THEN ROUND((SUM(pm.spend) / SUM(pm.clicks)), 2)
          ELSE 0 
        END as cpc,
        CASE 
          WHEN SUM(pm.sales) > 0 
          THEN ROUND((SUM(pm.spend) / SUM(pm.sales) * 100), 2)
          ELSE 0 
        END as acos
      FROM campaigns c
      LEFT JOIN performance_metrics pm 
        ON pm.entity_type = 'campaign' 
        AND pm.entity_id = c.id
        AND pm.date >= CURRENT_DATE - INTERVAL '30 days'
      WHERE c.id = $1 AND c.user_id = $2
      GROUP BY c.id
    `;

    const result = await db.query(query, [campaignId, userId]);
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapCampaignFromDb(result.rows[0]);
  }

  /**
   * Create new campaign
   */
  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    // First create in Amazon API (or mock in sandbox mode)
    const amazonCampaign = await amazonApiClient.createCampaign({
      name: campaign.name,
      state: campaign.status,
      campaignType: campaign.campaignType,
      targetingType: campaign.targetingType,
      dailyBudget: campaign.dailyBudget,
      biddingStrategy: campaign.biddingStrategy,
    });

    // Then save to database
    const query = `
      INSERT INTO campaigns (
        amazon_campaign_id, name, status, campaign_type, targeting_type,
        daily_budget, start_date, bidding_strategy, default_bid, user_id, account_id, synced_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      amazonCampaign.campaignId,
      campaign.name,
      campaign.status || 'paused',
      campaign.campaignType,
      campaign.targetingType,
      campaign.dailyBudget,
      campaign.startDate,
      campaign.biddingStrategy,
      campaign.defaultBid,
      campaign.userId,
      campaign.accountId,
    ]);

    return this.mapCampaignFromDb(result.rows[0]);
  }

  /**
   * Update campaign
   */
  async updateCampaign(
    campaignId: string,
    userId: string,
    updates: Partial<Campaign>
  ): Promise<Campaign | null> {
    // Get current campaign
    const current = await this.getCampaignById(campaignId, userId);
    if (!current) {
      return null;
    }

    // Update in Amazon API if it has amazon_campaign_id
    if (current.amazonCampaignId) {
      await amazonApiClient.updateCampaign(current.amazonCampaignId, {
        name: updates.name,
        state: updates.status,
        dailyBudget: updates.dailyBudget,
      });
    }

    // Update in database
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      setClauses.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.status !== undefined) {
      setClauses.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }
    if (updates.dailyBudget !== undefined) {
      setClauses.push(`daily_budget = $${paramCount++}`);
      values.push(updates.dailyBudget);
    }
    if (updates.biddingStrategy !== undefined) {
      setClauses.push(`bidding_strategy = $${paramCount++}`);
      values.push(updates.biddingStrategy);
    }
    if (updates.defaultBid !== undefined) {
      setClauses.push(`default_bid = $${paramCount++}`);
      values.push(updates.defaultBid);
    }

    if (setClauses.length === 0) {
      return current;
    }

    setClauses.push(`synced_at = NOW()`);
    values.push(campaignId, userId);

    const query = `
      UPDATE campaigns 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return this.mapCampaignFromDb(result.rows[0]);
  }

  /**
   * Delete (archive) campaign
   */
  async deleteCampaign(campaignId: string, userId: string): Promise<boolean> {
    const campaign = await this.getCampaignById(campaignId, userId);
    if (!campaign) {
      return false;
    }

    // Archive in Amazon API
    if (campaign.amazonCampaignId) {
      await amazonApiClient.archiveCampaign(campaign.amazonCampaignId);
    }

    // Update status in database
    const query = `
      UPDATE campaigns 
      SET status = 'archived', synced_at = NOW()
      WHERE id = $1 AND user_id = $2
    `;

    await db.query(query, [campaignId, userId]);
    return true;
  }

  /**
   * Sync campaigns from Amazon API
   */
  async syncCampaignsFromAmazon(userId: string): Promise<number> {
    const amazonCampaigns = await amazonApiClient.getCampaigns();
    let syncedCount = 0;

    for (const amazonCampaign of amazonCampaigns) {
      const query = `
        INSERT INTO campaigns (
          amazon_campaign_id, name, status, campaign_type, targeting_type,
          daily_budget, start_date, bidding_strategy, user_id, synced_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (amazon_campaign_id) 
        DO UPDATE SET 
          name = EXCLUDED.name,
          status = EXCLUDED.status,
          daily_budget = EXCLUDED.daily_budget,
          synced_at = NOW()
      `;

      await db.query(query, [
        amazonCampaign.campaignId,
        amazonCampaign.name,
        amazonCampaign.state,
        amazonCampaign.campaignType,
        amazonCampaign.targetingType,
        amazonCampaign.dailyBudget,
        amazonCampaign.startDate,
        amazonCampaign.biddingStrategy,
        userId,
      ]);

      syncedCount++;
    }

    return syncedCount;
  }

  /**
   * Get campaign performance over time
   */
  async getCampaignPerformance(
    campaignId: string,
    userId: string,
    days: number = 30
  ): Promise<any[]> {
    const query = `
      SELECT 
        pm.date,
        pm.impressions,
        pm.clicks,
        pm.spend,
        pm.sales,
        pm.orders,
        pm.ctr,
        pm.cpc,
        pm.acos
      FROM performance_metrics pm
      JOIN campaigns c ON c.id = pm.entity_id
      WHERE c.id = $1 
        AND c.user_id = $2
        AND pm.entity_type = 'campaign'
        AND pm.date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY pm.date DESC
    `;

    const result = await db.query(query, [campaignId, userId]);
    return result.rows;
  }

  /**
   * Map database row to Campaign object
   */
  private mapCampaignFromDb(row: any): CampaignWithMetrics {
    return {
      id: row.id,
      amazonCampaignId: row.amazon_campaign_id,
      name: row.name,
      status: row.status,
      campaignType: row.campaign_type,
      targetingType: row.targeting_type,
      dailyBudget: parseFloat(row.daily_budget) || undefined,
      lifetimeBudget: parseFloat(row.lifetime_budget) || undefined,
      startDate: row.start_date,
      endDate: row.end_date,
      biddingStrategy: row.bidding_strategy,
      defaultBid: parseFloat(row.default_bid) || undefined,
      userId: row.user_id,
      accountId: row.account_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
      impressions: parseInt(row.impressions) || 0,
      clicks: parseInt(row.clicks) || 0,
      spend: parseFloat(row.spend) || 0,
      sales: parseFloat(row.sales) || 0,
      orders: parseInt(row.orders) || 0,
      ctr: parseFloat(row.ctr) || 0,
      cpc: parseFloat(row.cpc) || 0,
      acos: parseFloat(row.acos) || 0,
    };
  }
}

export const campaignsService = new CampaignsService();
