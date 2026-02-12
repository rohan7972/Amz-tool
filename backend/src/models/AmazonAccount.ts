import { Model } from 'objection';
import { Campaign } from './Campaign';
import { Product } from './Product';
import { SyncJob } from './SyncJob';
import { User } from './User';

export class AmazonAccount extends Model {
  static tableName = 'amazon_accounts';

  id!: string;
  user_id!: string;
  seller_id?: string;
  marketplace_id!: string;
  account_name!: string;
  country_code!: string;
  currency_code!: string;
  timezone!: string;

  // Account type and profile
  account_type!: 'sp-api' | 'advertising-api';
  profile_id?: string;

  // API credentials (encrypted)
  sp_api_refresh_token?: string;
  advertising_api_refresh_token?: string;
  sp_api_access_token?: string;
  advertising_api_access_token?: string;
  sp_api_token_expires_at?: Date;
  advertising_api_token_expires_at?: Date;

  // Unified token fields for OAuth service
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: Date;

  // Account status
  status!: 'active' | 'inactive' | 'suspended' | 'error';

  last_sync_at?: Date;
  sync_status!: Record<string, any>;
  error_message?: string;

  created_at!: Date;
  updated_at!: Date;

  // Relations
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'amazon_accounts.user_id',
        to: 'users.id',
      },
    },
    campaigns: {
      relation: Model.HasManyRelation,
      modelClass: () => Campaign,
      join: {
        from: 'amazon_accounts.id',
        to: 'campaigns.account_id',
      },
    },
    products: {
      relation: Model.HasManyRelation,
      modelClass: () => Product,
      join: {
        from: 'amazon_accounts.id',
        to: 'products.account_id',
      },
    },
    syncJobs: {
      relation: Model.HasManyRelation,
      modelClass: () => SyncJob,
      join: {
        from: 'amazon_accounts.id',
        to: 'sync_jobs.account_id',
      },
    },
  };

  // JSON Schema for validation
  static jsonSchema = {
    type: 'object',
    required: ['user_id', 'marketplace_id', 'account_name', 'country_code', 'currency_code'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      user_id: { type: 'string', format: 'uuid' },
      seller_id: { type: 'string', minLength: 1, maxLength: 50 },
      marketplace_id: { type: 'string', minLength: 1, maxLength: 50 },
      account_name: { type: 'string', minLength: 1, maxLength: 255 },
      country_code: { type: 'string', minLength: 2, maxLength: 2 },
      currency_code: { type: 'string', minLength: 3, maxLength: 3 },
      timezone: { type: 'string', maxLength: 50 },
      status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'error'] },
      sync_status: { type: 'object' },
      error_message: { type: ['string', 'null'] },
    },
  };

  // Hooks
  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
    this.timezone = this.timezone || 'UTC';
    this.sync_status = this.sync_status || {};
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  // Instance methods
  toJSON() {
    const json = super.toJSON() as any;
    // Remove sensitive API tokens from JSON output
    delete json.sp_api_refresh_token;
    delete json.advertising_api_refresh_token;
    delete json.sp_api_access_token;
    delete json.advertising_api_access_token;
    return json;
  }

  isTokenExpired(tokenType: 'sp_api' | 'advertising_api'): boolean {
    const expiresAt = tokenType === 'sp_api'
      ? this.sp_api_token_expires_at
      : this.advertising_api_token_expires_at;

    if (!expiresAt) return true;
    return new Date() >= new Date(expiresAt);
  }

  needsSync(): boolean {
    if (!this.last_sync_at) return true;

    // Sync if last sync was more than 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(this.last_sync_at) < oneHourAgo;
  }

  getMarketplaceInfo() {
    const marketplaces: Record<string, { name: string; endpoint: string; region: string }> = {
      'ATVPDKIKX0DER': { name: 'US', endpoint: 'sellingpartnerapi-na.amazon.com', region: 'us-east-1' },
      'A2EUQ1WTGCTBG2': { name: 'CA', endpoint: 'sellingpartnerapi-na.amazon.com', region: 'us-east-1' },
      'A1AM78C64UM0Y8': { name: 'MX', endpoint: 'sellingpartnerapi-na.amazon.com', region: 'us-east-1' },
      'A1PA6795UKMFR9': { name: 'DE', endpoint: 'sellingpartnerapi-eu.amazon.com', region: 'eu-west-1' },
      'A1RKKUPIHCS9HS': { name: 'ES', endpoint: 'sellingpartnerapi-eu.amazon.com', region: 'eu-west-1' },
      'A13V1IB3VIYZZH': { name: 'FR', endpoint: 'sellingpartnerapi-eu.amazon.com', region: 'eu-west-1' },
      'A21TJRUUN4KGV': { name: 'IN', endpoint: 'sellingpartnerapi-eu.amazon.com', region: 'eu-west-1' },
      'APJ6JRA9NG5V4': { name: 'IT', endpoint: 'sellingpartnerapi-eu.amazon.com', region: 'eu-west-1' },
      'A1F83G8C2ARO7P': { name: 'UK', endpoint: 'sellingpartnerapi-eu.amazon.com', region: 'eu-west-1' },
      'A39IBJ37TRP1C6': { name: 'AU', endpoint: 'sellingpartnerapi-fe.amazon.com', region: 'us-west-2' },
      'A1VC38T7YXB528': { name: 'JP', endpoint: 'sellingpartnerapi-fe.amazon.com', region: 'us-west-2' },
    };

    return marketplaces[this.marketplace_id] || {
      name: 'Unknown',
      endpoint: 'sellingpartnerapi-na.amazon.com',
      region: 'us-east-1'
    };
  }
}