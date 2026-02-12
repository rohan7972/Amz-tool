import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enum('role', ['admin', 'user', 'viewer']).defaultTo('user');
    table.boolean('is_active').defaultTo(true);
    table.boolean('email_verified').defaultTo(false);
    table.timestamp('email_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
    table.jsonb('preferences').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['role']);
    table.index(['is_active']);
  });

  // Amazon accounts table
  await knex.schema.createTable('amazon_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('seller_id').nullable();
    table.string('marketplace_id').notNullable();
    table.string('account_name').notNullable();
    table.string('country_code', 2).notNullable();
    table.string('currency_code', 3).notNullable();
    table.string('timezone').defaultTo('UTC');
    
    // API credentials (encrypted)
    table.text('sp_api_refresh_token').nullable();
    table.text('advertising_api_refresh_token').nullable();
    table.text('sp_api_access_token').nullable();
    table.text('advertising_api_access_token').nullable();
    table.timestamp('sp_api_token_expires_at').nullable();
    table.timestamp('advertising_api_token_expires_at').nullable();
    
    // Account status
    table.enum('status', ['active', 'inactive', 'suspended', 'error']).defaultTo('active');
    table.timestamp('last_sync_at').nullable();
    table.jsonb('sync_status').defaultTo('{}');
    table.text('error_message').nullable();
    
    table.timestamps(true, true);
    
    table.unique(['seller_id', 'marketplace_id']);
    table.index(['user_id']);
    table.index(['status']);
    table.index(['last_sync_at']);
  });

  // Products table
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account_id').references('id').inTable('amazon_accounts').onDelete('CASCADE');
    table.string('asin').notNullable();
    table.string('sku').nullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('brand').nullable();
    table.string('category').nullable();
    table.string('subcategory').nullable();
    table.decimal('price', 10, 2).nullable();
    table.string('currency', 3).nullable();
    table.string('image_url').nullable();
    table.string('product_url').nullable();
    table.integer('rank').nullable();
    table.string('rank_category').nullable();
    table.boolean('is_active').defaultTo(true);
    table.jsonb('attributes').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['account_id', 'asin']);
    table.index(['account_id']);
    table.index(['asin']);
    table.index(['sku']);
    table.index(['brand']);
    table.index(['category']);
    table.index(['is_active']);
  });

  // Campaigns table
  await knex.schema.createTable('campaigns', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account_id').references('id').inTable('amazon_accounts').onDelete('CASCADE');
    table.string('campaign_id').notNullable(); // Amazon campaign ID
    table.string('name').notNullable();
    table.enum('campaign_type', ['SP', 'SB', 'SD']).notNullable(); // Sponsored Products, Brands, Display
    table.enum('targeting_type', ['AUTO', 'MANUAL']).nullable();
    table.enum('state', ['ENABLED', 'PAUSED', 'ARCHIVED']).defaultTo('ENABLED');
    table.decimal('daily_budget', 10, 2).nullable();
    table.date('start_date').nullable();
    table.date('end_date').nullable();
    table.enum('bidding_strategy', ['LEGACY_FOR_SALES', 'AUTO_FOR_SALES', 'MANUAL']).nullable();
    table.decimal('placement_bid_percentage', 5, 2).nullable();
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['account_id', 'campaign_id']);
    table.index(['account_id']);
    table.index(['campaign_type']);
    table.index(['state']);
    table.index(['name']);
  });

  // Ad Groups table
  await knex.schema.createTable('ad_groups', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE');
    table.string('ad_group_id').notNullable(); // Amazon ad group ID
    table.string('name').notNullable();
    table.enum('state', ['ENABLED', 'PAUSED', 'ARCHIVED']).defaultTo('ENABLED');
    table.decimal('default_bid', 10, 2).nullable();
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['campaign_id', 'ad_group_id']);
    table.index(['campaign_id']);
    table.index(['state']);
    table.index(['name']);
  });

  // Keywords table
  await knex.schema.createTable('keywords', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('ad_group_id').references('id').inTable('ad_groups').onDelete('CASCADE');
    table.string('keyword_id').notNullable(); // Amazon keyword ID
    table.string('keyword_text').notNullable();
    table.enum('match_type', ['EXACT', 'PHRASE', 'BROAD']).notNullable();
    table.enum('state', ['ENABLED', 'PAUSED', 'ARCHIVED']).defaultTo('ENABLED');
    table.decimal('bid', 10, 2).nullable();
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['ad_group_id', 'keyword_id']);
    table.index(['ad_group_id']);
    table.index(['keyword_text']);
    table.index(['match_type']);
    table.index(['state']);
  });

  // Product Ads table
  await knex.schema.createTable('product_ads', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('ad_group_id').references('id').inTable('ad_groups').onDelete('CASCADE');
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.string('ad_id').notNullable(); // Amazon ad ID
    table.string('asin').notNullable();
    table.string('sku').nullable();
    table.enum('state', ['ENABLED', 'PAUSED', 'ARCHIVED']).defaultTo('ENABLED');
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['ad_group_id', 'ad_id']);
    table.index(['ad_group_id']);
    table.index(['product_id']);
    table.index(['asin']);
    table.index(['state']);
  });

  // Targets table (for auto campaigns)
  await knex.schema.createTable('targets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('ad_group_id').references('id').inTable('ad_groups').onDelete('CASCADE');
    table.string('target_id').notNullable(); // Amazon target ID
    table.enum('expression_type', ['MANUAL', 'AUTO']).notNullable();
    table.string('expression').nullable();
    table.enum('state', ['ENABLED', 'PAUSED', 'ARCHIVED']).defaultTo('ENABLED');
    table.decimal('bid', 10, 2).nullable();
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['ad_group_id', 'target_id']);
    table.index(['ad_group_id']);
    table.index(['expression_type']);
    table.index(['state']);
  });

  // Campaign Performance table (daily aggregated data)
  await knex.schema.createTable('campaign_performance', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE');
    table.date('date').notNullable();
    
    // Metrics
    table.integer('impressions').defaultTo(0);
    table.integer('clicks').defaultTo(0);
    table.decimal('cost', 10, 2).defaultTo(0);
    table.integer('orders').defaultTo(0);
    table.decimal('sales', 10, 2).defaultTo(0);
    table.integer('units_sold').defaultTo(0);
    
    // Calculated metrics
    table.decimal('ctr', 8, 4).defaultTo(0); // Click-through rate
    table.decimal('cpc', 10, 2).defaultTo(0); // Cost per click
    table.decimal('acos', 8, 4).defaultTo(0); // Advertising cost of sales
    table.decimal('roas', 8, 4).defaultTo(0); // Return on ad spend
    table.decimal('cvr', 8, 4).defaultTo(0); // Conversion rate
    table.decimal('cpo', 10, 2).defaultTo(0); // Cost per order
    
    table.timestamps(true, true);
    
    table.unique(['campaign_id', 'date']);
    table.index(['campaign_id']);
    table.index(['date']);
    table.index(['cost']);
    table.index(['sales']);
  });

  // Keyword Performance table (daily aggregated data)
  await knex.schema.createTable('keyword_performance', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('keyword_id').references('id').inTable('keywords').onDelete('CASCADE');
    table.date('date').notNullable();
    
    // Metrics
    table.integer('impressions').defaultTo(0);
    table.integer('clicks').defaultTo(0);
    table.decimal('cost', 10, 2).defaultTo(0);
    table.integer('orders').defaultTo(0);
    table.decimal('sales', 10, 2).defaultTo(0);
    table.integer('units_sold').defaultTo(0);
    
    // Calculated metrics
    table.decimal('ctr', 8, 4).defaultTo(0);
    table.decimal('cpc', 10, 2).defaultTo(0);
    table.decimal('acos', 8, 4).defaultTo(0);
    table.decimal('roas', 8, 4).defaultTo(0);
    table.decimal('cvr', 8, 4).defaultTo(0);
    table.decimal('cpo', 10, 2).defaultTo(0);
    
    table.timestamps(true, true);
    
    table.unique(['keyword_id', 'date']);
    table.index(['keyword_id']);
    table.index(['date']);
    table.index(['cost']);
    table.index(['sales']);
  });

  // Search Terms table
  await knex.schema.createTable('search_terms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('keyword_id').references('id').inTable('keywords').onDelete('CASCADE').nullable();
    table.uuid('target_id').references('id').inTable('targets').onDelete('CASCADE').nullable();
    table.string('search_term').notNullable();
    table.date('date').notNullable();
    
    // Metrics
    table.integer('impressions').defaultTo(0);
    table.integer('clicks').defaultTo(0);
    table.decimal('cost', 10, 2).defaultTo(0);
    table.integer('orders').defaultTo(0);
    table.decimal('sales', 10, 2).defaultTo(0);
    table.integer('units_sold').defaultTo(0);
    
    // Calculated metrics
    table.decimal('ctr', 8, 4).defaultTo(0);
    table.decimal('cpc', 10, 2).defaultTo(0);
    table.decimal('acos', 8, 4).defaultTo(0);
    table.decimal('roas', 8, 4).defaultTo(0);
    table.decimal('cvr', 8, 4).defaultTo(0);
    table.decimal('cpo', 10, 2).defaultTo(0);
    
    table.timestamps(true, true);
    
    table.index(['keyword_id']);
    table.index(['target_id']);
    table.index(['search_term']);
    table.index(['date']);
    table.index(['cost']);
    table.index(['sales']);
  });

  // Negative Keywords table
  await knex.schema.createTable('negative_keywords', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('campaign_id').references('id').inTable('campaigns').onDelete('CASCADE').nullable();
    table.uuid('ad_group_id').references('id').inTable('ad_groups').onDelete('CASCADE').nullable();
    table.string('keyword_text').notNullable();
    table.enum('match_type', ['EXACT', 'PHRASE', 'BROAD']).notNullable();
    table.enum('state', ['ENABLED', 'PAUSED', 'ARCHIVED']).defaultTo('ENABLED');
    table.timestamps(true, true);
    
    table.index(['campaign_id']);
    table.index(['ad_group_id']);
    table.index(['keyword_text']);
    table.index(['match_type']);
    table.index(['state']);
  });

  // Sync Jobs table
  await knex.schema.createTable('sync_jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account_id').references('id').inTable('amazon_accounts').onDelete('CASCADE');
    table.enum('job_type', ['FULL_SYNC', 'CAMPAIGNS', 'KEYWORDS', 'PERFORMANCE', 'SEARCH_TERMS']).notNullable();
    table.enum('status', ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED']).defaultTo('PENDING');
    table.timestamp('started_at').nullable();
    table.timestamp('completed_at').nullable();
    table.integer('records_processed').defaultTo(0);
    table.integer('records_failed').defaultTo(0);
    table.text('error_message').nullable();
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['account_id']);
    table.index(['job_type']);
    table.index(['status']);
    table.index(['started_at']);
  });

  // Reports table
  await knex.schema.createTable('reports', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('account_id').references('id').inTable('amazon_accounts').onDelete('CASCADE');
    table.string('name').notNullable();
    table.enum('type', ['CAMPAIGN', 'KEYWORD', 'SEARCH_TERM', 'PRODUCT', 'CUSTOM']).notNullable();
    table.jsonb('filters').defaultTo('{}');
    table.jsonb('columns').defaultTo('[]');
    table.enum('schedule', ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']).defaultTo('NONE');
    table.boolean('is_public').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['account_id']);
    table.index(['type']);
    table.index(['schedule']);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order to handle foreign key constraints
  await knex.schema.dropTableIfExists('reports');
  await knex.schema.dropTableIfExists('sync_jobs');
  await knex.schema.dropTableIfExists('negative_keywords');
  await knex.schema.dropTableIfExists('search_terms');
  await knex.schema.dropTableIfExists('keyword_performance');
  await knex.schema.dropTableIfExists('campaign_performance');
  await knex.schema.dropTableIfExists('targets');
  await knex.schema.dropTableIfExists('product_ads');
  await knex.schema.dropTableIfExists('keywords');
  await knex.schema.dropTableIfExists('ad_groups');
  await knex.schema.dropTableIfExists('campaigns');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('amazon_accounts');
  await knex.schema.dropTableIfExists('users');
}