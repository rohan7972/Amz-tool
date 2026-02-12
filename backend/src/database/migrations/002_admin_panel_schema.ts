import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ============================================
  // FORMULAS
  // ============================================
  await knex.schema.createTable('formulas', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description');
    table.string('category'); // pricing, bidding, inventory, analytics, custom
    table.text('expression').notNullable();
    table.jsonb('variables').defaultTo('[]');
    table.boolean('is_active').defaultTo(true);
    table.integer('version').defaultTo(1);
    table.uuid('created_by').references('id').inTable('users');
    table.uuid('updated_by').references('id').inTable('users');
    table.integer('usage_count').defaultTo(0);
    table.timestamp('last_executed_at');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['category']);
    table.index(['is_active']);
    table.index(['created_by']);
  });

  await knex.schema.createTable('formula_executions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('formula_id').references('id').inTable('formulas').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users');
    table.jsonb('input_variables');
    table.decimal('result', 15, 2);
    table.integer('execution_time_ms');
    table.string('status'); // success, error
    table.text('error_message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['formula_id']);
    table.index(['created_at']);
  });

  // ============================================
  // RULES ENGINE
  // ============================================
  await knex.schema.createTable('rules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description');
    table.integer('priority').defaultTo(0);
    table.boolean('is_enabled').defaultTo(true);
    table.string('trigger_type').notNullable(); // schedule, event, webhook, manual
    table.jsonb('trigger_config').defaultTo('{}');
    table.jsonb('conditions').defaultTo('[]');
    table.jsonb('actions').defaultTo('[]');
    table.integer('throttle_max_executions');
    table.string('throttle_per'); // minute, hour, day
    table.timestamp('last_executed_at');
    table.integer('execution_count').defaultTo(0);
    table.integer('success_count').defaultTo(0);
    table.integer('failure_count').defaultTo(0);
    table.uuid('created_by').references('id').inTable('users');
    table.uuid('updated_by').references('id').inTable('users');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['is_enabled']);
    table.index(['trigger_type']);
    table.index(['priority']);
  });

  await knex.schema.createTable('rule_executions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('rule_id').references('id').inTable('rules').onDelete('CASCADE');
    table.string('status').notNullable(); // success, failure, partial
    table.boolean('conditions_met');
    table.integer('actions_executed').defaultTo(0);
    table.integer('actions_failed').defaultTo(0);
    table.integer('execution_time_ms');
    table.text('error_message');
    table.jsonb('result');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['rule_id']);
    table.index(['created_at']);
  });

  // ============================================
  // SYSTEM CONFIGURATION
  // ============================================
  await knex.schema.createTable('system_settings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').unique().notNullable();
    table.text('value');
    table.string('type'); // string, number, boolean, json
    table.string('category');
    table.text('description');
    table.boolean('is_public').defaultTo(false);
    table.boolean('is_encrypted').defaultTo(false);
    table.uuid('updated_by').references('id').inTable('users');
    table.timestamps(true, true);
    
    table.index(['key']);
    table.index(['category']);
  });

  await knex.schema.createTable('feature_flags', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').unique().notNullable();
    table.string('name').notNullable();
    table.text('description');
    table.boolean('is_enabled').defaultTo(false);
    table.integer('rollout_percentage').defaultTo(0);
    table.jsonb('user_ids').defaultTo('[]');
    table.jsonb('metadata').defaultTo('{}');
    table.uuid('created_by').references('id').inTable('users');
    table.uuid('updated_by').references('id').inTable('users');
    table.timestamps(true, true);
    
    table.index(['key']);
    table.index(['is_enabled']);
  });

  // ============================================
  // API MANAGEMENT
  // ============================================
  await knex.schema.createTable('api_keys', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('key_hash').unique().notNullable();
    table.string('key_prefix').notNullable();
    table.jsonb('scopes').defaultTo('[]');
    table.integer('rate_limit').defaultTo(1000);
    table.jsonb('ip_whitelist').defaultTo('[]');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_used_at');
    table.integer('usage_count').defaultTo(0);
    table.timestamp('expires_at');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['key_hash']);
    table.index(['is_active']);
  });

  await knex.schema.createTable('api_usage', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('api_key_id').references('id').inTable('api_keys').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users');
    table.string('endpoint');
    table.string('method');
    table.integer('status_code');
    table.integer('response_time_ms');
    table.string('ip_address');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['api_key_id']);
    table.index(['created_at']);
  });

  await knex.schema.createTable('webhooks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('url').notNullable();
    table.jsonb('events').defaultTo('[]');
    table.string('secret');
    table.boolean('is_active').defaultTo(true);
    table.integer('retry_count').defaultTo(3);
    table.integer('timeout_seconds').defaultTo(30);
    table.timestamp('last_triggered_at');
    table.integer('success_count').defaultTo(0);
    table.integer('failure_count').defaultTo(0);
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['is_active']);
  });

  // ============================================
  // MONITORING & LOGS
  // ============================================
  await knex.schema.createTable('system_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('level').notNullable(); // debug, info, warn, error, fatal
    table.text('message').notNullable();
    table.string('service');
    table.jsonb('context').defaultTo('{}');
    table.text('stack_trace');
    table.uuid('user_id').references('id').inTable('users');
    table.string('ip_address');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['level']);
    table.index(['service']);
    table.index(['created_at']);
  });

  await knex.schema.createTable('system_metrics', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('metric_name').notNullable();
    table.decimal('value', 15, 2).notNullable();
    table.string('unit');
    table.jsonb('tags').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['metric_name']);
    table.index(['created_at']);
  });

  // ============================================
  // SECURITY
  // ============================================
  await knex.schema.createTable('user_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('refresh_token').notNullable();
    table.string('ip_address');
    table.text('user_agent');
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['user_id']);
    table.index(['expires_at']);
  });

  await knex.schema.createTable('user_activity', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('action').notNullable();
    table.string('entity_type');
    table.string('entity_id');
    table.jsonb('metadata').defaultTo('{}');
    table.string('ip_address');
    table.text('user_agent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['user_id']);
    table.index(['created_at']);
  });

  await knex.schema.createTable('security_audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('action').notNullable();
    table.string('resource_type');
    table.string('resource_id');
    table.string('status'); // success, failure
    table.string('ip_address');
    table.text('user_agent');
    table.jsonb('changes');
    table.string('risk_level'); // low, medium, high, critical
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['user_id']);
    table.index(['action']);
    table.index(['created_at']);
  });

  await knex.schema.createTable('login_attempts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable();
    table.string('ip_address');
    table.text('user_agent');
    table.boolean('success').notNullable();
    table.string('failure_reason');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['email']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('login_attempts');
  await knex.schema.dropTableIfExists('security_audit_logs');
  await knex.schema.dropTableIfExists('user_activity');
  await knex.schema.dropTableIfExists('user_sessions');
  await knex.schema.dropTableIfExists('system_metrics');
  await knex.schema.dropTableIfExists('system_logs');
  await knex.schema.dropTableIfExists('webhooks');
  await knex.schema.dropTableIfExists('api_usage');
  await knex.schema.dropTableIfExists('api_keys');
  await knex.schema.dropTableIfExists('feature_flags');
  await knex.schema.dropTableIfExists('system_settings');
  await knex.schema.dropTableIfExists('rule_executions');
  await knex.schema.dropTableIfExists('rules');
  await knex.schema.dropTableIfExists('formula_executions');
  await knex.schema.dropTableIfExists('formulas');
}
