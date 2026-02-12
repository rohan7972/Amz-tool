import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Organizations Table
  await knex.schema.createTable('organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.text('logo_url');
    table.jsonb('settings').defaultTo('{}');
    table.uuid('subscription_id').references('id').inTable('subscriptions');
    table.string('status', 50).defaultTo('active');
    table.timestamps(true, true);
    
    table.index('slug');
    table.index('status');
  });

  // 2. Subscription Plans Table
  await knex.schema.createTable('subscription_plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.string('billing_cycle', 20).notNullable(); // monthly, yearly
    table.jsonb('features').defaultTo('[]');
    table.jsonb('limits').defaultTo('{}');
    table.boolean('is_active').defaultTo(true);
    table.integer('trial_days').defaultTo(0);
    table.timestamps(true, true);
    
    table.index('slug');
    table.index('is_active');
  });

  // 3. Subscriptions Table
  await knex.schema.createTable('subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('plan_id').references('id').inTable('subscription_plans');
    table.string('status', 50).defaultTo('active'); // active, cancelled, expired, trial
    table.timestamp('current_period_start');
    table.timestamp('current_period_end');
    table.timestamp('trial_ends_at');
    table.timestamp('cancelled_at');
    table.string('stripe_subscription_id', 255);
    table.string('stripe_customer_id', 255);
    table.timestamps(true, true);
    
    table.index('organization_id');
    table.index('status');
    table.index('stripe_subscription_id');
  });

  // Add foreign key to organizations (circular reference handled)
  await knex.schema.alterTable('organizations', (table) => {
    table.dropColumn('subscription_id');
  });
  
  await knex.schema.alterTable('organizations', (table) => {
    table.uuid('subscription_id').references('id').inTable('subscriptions').onDelete('SET NULL');
  });

  // 4. Permissions Table
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.text('description');
    table.string('resource', 100).notNullable();
    table.string('action', 50).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('slug');
    table.index(['resource', 'action']);
  });

  // 5. Roles Table
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable();
    table.text('description');
    table.jsonb('permissions').defaultTo('[]');
    table.boolean('is_system').defaultTo(false);
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.unique(['slug', 'organization_id']);
    table.index('organization_id');
  });

  // 6. User Roles Table (Many-to-Many)
  await knex.schema.createTable('user_roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('granted_by').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.unique(['user_id', 'role_id', 'organization_id']);
    table.index('user_id');
    table.index('role_id');
    table.index('organization_id');
  });

  // 7. Payment Records Table
  await knex.schema.createTable('payment_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('subscription_id').references('id').inTable('subscriptions').onDelete('SET NULL');
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 3).defaultTo('USD');
    table.string('status', 50).notNullable(); // succeeded, pending, failed
    table.string('stripe_payment_intent_id', 255);
    table.string('stripe_invoice_id', 255);
    table.string('payment_method', 50);
    table.timestamp('paid_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('subscription_id');
    table.index('organization_id');
    table.index('status');
    table.index('created_at');
  });

  // 8. Audit Logs Table
  await knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('action', 100).notNullable();
    table.string('resource_type', 100);
    table.uuid('resource_id');
    table.jsonb('changes');
    table.inet('ip_address');
    table.text('user_agent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('user_id');
    table.index('organization_id');
    table.index('resource_type');
    table.index('created_at');
  });

  // 9. Teams Table
  await knex.schema.createTable('teams', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable().references('id').inTable('organizations').onDelete('CASCADE');
    table.string('name', 255).notNullable();
    table.text('description');
    table.uuid('created_by').references('id').inTable('users');
    table.timestamps(true, true);
    
    table.index('organization_id');
  });

  // 10. Team Members Table
  await knex.schema.createTable('team_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('role', 50).defaultTo('member'); // admin, member, viewer
    table.uuid('added_by').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.unique(['team_id', 'user_id']);
    table.index('team_id');
    table.index('user_id');
  });

  // 11. Notification Preferences Table
  await knex.schema.createTable('notification_preferences', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('channel', 50).notNullable(); // email, sms, slack, in_app
    table.string('event_type', 100).notNullable();
    table.boolean('is_enabled').defaultTo(true);
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    
    table.unique(['user_id', 'channel', 'event_type']);
    table.index('user_id');
  });

  // 12. In-App Notifications Table
  await knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('type', 50).notNullable();
    table.string('title', 255).notNullable();
    table.text('message').notNullable();
    table.jsonb('data').defaultTo('{}');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('read_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('user_id');
    table.index('organization_id');
    table.index(['user_id', 'is_read']);
    table.index('created_at');
  });

  // Add organization_id to existing tables
  await knex.schema.alterTable('users', (table) => {
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('SET NULL');
    table.index('organization_id');
  });

  await knex.schema.alterTable('campaigns', (table) => {
    table.uuid('team_id').references('id').inTable('teams').onDelete('SET NULL');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.index('team_id');
    table.index('created_by');
  });

  await knex.schema.alterTable('keywords', (table) => {
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.index('created_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop in reverse order due to foreign keys
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('notification_preferences');
  await knex.schema.dropTableIfExists('team_members');
  await knex.schema.dropTableIfExists('teams');
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('payment_records');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('subscription_plans');
  await knex.schema.dropTableIfExists('organizations');
  
  // Remove added columns
  await knex.schema.alterTable('keywords', (table) => {
    table.dropColumn('created_by');
  });
  
  await knex.schema.alterTable('campaigns', (table) => {
    table.dropColumn('created_by');
    table.dropColumn('team_id');
  });
  
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('organization_id');
  });
}
