/**
 * Keywords Service
 * Business logic for keyword management
 */

import { db } from '../database/connection';
import { amazonApiClient } from './amazon-api/client';

export interface Keyword {
  id: string;
  amazonKeywordId?: string;
  campaignId: string;
  adGroupId?: string;
  keywordText: string;
  matchType: 'exact' | 'phrase' | 'broad';
  bid?: number;
  status: 'enabled' | 'paused' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
  syncedAt?: Date;
}

export interface KeywordWithMetrics extends Keyword {
  impressions?: number;
  clicks?: number;
  spend?: number;
  sales?: number;
  orders?: number;
  ctr?: number;
  cpc?: number;
  acos?: number;
  campaignName?: string;
}

export class KeywordsService {
  /**
   * Get all keywords (optionally filtered by campaign)
   */
  async getAllKeywords(userId: string, campaignId?: string): Promise<KeywordWithMetrics[]> {
    const query = `
      SELECT 
        k.*,
        c.name as campaign_name,
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
      FROM keywords k
      JOIN campaigns c ON c.id = k.campaign_id
      LEFT JOIN performance_metrics pm 
        ON pm.entity_type = 'keyword' 
        AND pm.entity_id = k.id
        AND pm.date >= CURRENT_DATE - INTERVAL '30 days'
      WHERE c.user_id = $1
        ${campaignId ? 'AND k.campaign_id = $2' : ''}
      GROUP BY k.id, c.name
      ORDER BY k.created_at DESC
    `;

    const params = campaignId ? [userId, campaignId] : [userId];
    const result = await db.query(query, params);
    return result.rows.map(this.mapKeywordFromDb);
  }

  /**
   * Get keyword by ID
   */
  async getKeywordById(keywordId: string, userId: string): Promise<KeywordWithMetrics | null> {
    const query = `
      SELECT 
        k.*,
        c.name as campaign_name,
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
      FROM keywords k
      JOIN campaigns c ON c.id = k.campaign_id
      LEFT JOIN performance_metrics pm 
        ON pm.entity_type = 'keyword' 
        AND pm.entity_id = k.id
        AND pm.date >= CURRENT_DATE - INTERVAL '30 days'
      WHERE k.id = $1 AND c.user_id = $2
      GROUP BY k.id, c.name
    `;

    const result = await db.query(query, [keywordId, userId]);
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapKeywordFromDb(result.rows[0]);
  }

  /**
   * Create new keyword
   */
  async createKeyword(keyword: Partial<Keyword>, userId: string): Promise<Keyword> {
    // Verify campaign belongs to user
    const campaignCheck = await db.query(
      'SELECT id FROM campaigns WHERE id = $1 AND user_id = $2',
      [keyword.campaignId, userId]
    );

    if (campaignCheck.rows.length === 0) {
      throw new Error('Campaign not found or access denied');
    }

    // Create in Amazon API
    const amazonKeyword = await amazonApiClient.createKeyword({
      campaignId: keyword.campaignId,
      adGroupId: keyword.adGroupId,
      keywordText: keyword.keywordText,
      matchType: keyword.matchType,
      bid: keyword.bid,
      state: keyword.status,
    });

    // Save to database
    const query = `
      INSERT INTO keywords (
        amazon_keyword_id, campaign_id, ad_group_id, keyword_text, 
        match_type, bid, status, synced_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      amazonKeyword.keywordId,
      keyword.campaignId,
      keyword.adGroupId,
      keyword.keywordText,
      keyword.matchType,
      keyword.bid,
      keyword.status || 'paused',
    ]);

    return this.mapKeywordFromDb(result.rows[0]);
  }

  /**
   * Update keyword
   */
  async updateKeyword(
    keywordId: string,
    userId: string,
    updates: Partial<Keyword>
  ): Promise<Keyword | null> {
    // Verify keyword belongs to user's campaign
    const current = await this.getKeywordById(keywordId, userId);
    if (!current) {
      return null;
    }

    // Update in Amazon API
    if (current.amazonKeywordId) {
      await amazonApiClient.updateKeyword(current.amazonKeywordId, {
        keywordText: updates.keywordText,
        matchType: updates.matchType,
        bid: updates.bid,
        state: updates.status,
      });
    }

    // Update in database
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.keywordText !== undefined) {
      setClauses.push(`keyword_text = $${paramCount++}`);
      values.push(updates.keywordText);
    }
    if (updates.matchType !== undefined) {
      setClauses.push(`match_type = $${paramCount++}`);
      values.push(updates.matchType);
    }
    if (updates.bid !== undefined) {
      setClauses.push(`bid = $${paramCount++}`);
      values.push(updates.bid);
    }
    if (updates.status !== undefined) {
      setClauses.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }

    if (setClauses.length === 0) {
      return current;
    }

    setClauses.push(`synced_at = NOW()`);
    values.push(keywordId);

    const query = `
      UPDATE keywords 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return this.mapKeywordFromDb(result.rows[0]);
  }

  /**
   * Delete (archive) keyword
   */
  async deleteKeyword(keywordId: string, userId: string): Promise<boolean> {
    const keyword = await this.getKeywordById(keywordId, userId);
    if (!keyword) {
      return false;
    }

    // Delete in Amazon API
    if (keyword.amazonKeywordId) {
      await amazonApiClient.deleteKeyword(keyword.amazonKeywordId);
    }

    // Update status in database
    const query = `
      UPDATE keywords k
      SET status = 'archived', synced_at = NOW()
      FROM campaigns c
      WHERE k.campaign_id = c.id 
        AND k.id = $1 
        AND c.user_id = $2
    `;

    await db.query(query, [keywordId, userId]);
    return true;
  }

  /**
   * Bulk update keyword bids
   */
  async bulkUpdateBids(
    updates: Array<{ id: string; bid: number }>,
    userId: string
  ): Promise<number> {
    let updateCount = 0;

    for (const update of updates) {
      const result = await this.updateKeyword(update.id, userId, { bid: update.bid });
      if (result) {
        updateCount++;
      }
    }

    return updateCount;
  }

  /**
   * Sync keywords from Amazon API
   */
  async syncKeywordsFromAmazon(userId: string, campaignId?: string): Promise<number> {
    const amazonKeywords = await amazonApiClient.getKeywords(campaignId);
    let syncedCount = 0;

    for (const amazonKeyword of amazonKeywords) {
      // Verify campaign exists and belongs to user
      const campaignCheck = await db.query(
        'SELECT id FROM campaigns WHERE amazon_campaign_id = $1 AND user_id = $2',
        [amazonKeyword.campaignId, userId]
      );

      if (campaignCheck.rows.length === 0) {
        continue; // Skip if campaign not found
      }

      const campaignIdDb = campaignCheck.rows[0].id;

      const query = `
        INSERT INTO keywords (
          amazon_keyword_id, campaign_id, ad_group_id, keyword_text,
          match_type, bid, status, synced_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (amazon_keyword_id) 
        DO UPDATE SET 
          keyword_text = EXCLUDED.keyword_text,
          match_type = EXCLUDED.match_type,
          bid = EXCLUDED.bid,
          status = EXCLUDED.status,
          synced_at = NOW()
      `;

      await db.query(query, [
        amazonKeyword.keywordId,
        campaignIdDb,
        amazonKeyword.adGroupId,
        amazonKeyword.keywordText,
        amazonKeyword.matchType,
        amazonKeyword.bid,
        amazonKeyword.state,
      ]);

      syncedCount++;
    }

    return syncedCount;
  }

  /**
   * Get keyword performance over time
   */
  async getKeywordPerformance(
    keywordId: string,
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
      JOIN keywords k ON k.id = pm.entity_id
      JOIN campaigns c ON c.id = k.campaign_id
      WHERE k.id = $1 
        AND c.user_id = $2
        AND pm.entity_type = 'keyword'
        AND pm.date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY pm.date DESC
    `;

    const result = await db.query(query, [keywordId, userId]);
    return result.rows;
  }

  /**
   * Map database row to Keyword object
   */
  private mapKeywordFromDb(row: any): KeywordWithMetrics {
    return {
      id: row.id,
      amazonKeywordId: row.amazon_keyword_id,
      campaignId: row.campaign_id,
      adGroupId: row.ad_group_id,
      keywordText: row.keyword_text,
      matchType: row.match_type,
      bid: parseFloat(row.bid) || undefined,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
      campaignName: row.campaign_name,
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

export const keywordsService = new KeywordsService();
