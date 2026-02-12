import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const plans = [
    {
      name: 'Free',
      slug: 'free',
      description: 'Perfect for getting started with Amazon advertising',
      price: 0.00,
      billing_cycle: 'monthly',
      features: JSON.stringify([
        'Up to 5 campaigns',
        'Up to 100 keywords',
        'Basic reporting',
        'Email support',
        '1 user account',
        '1,000 API calls/month',
      ]),
      limits: JSON.stringify({
        campaigns: 5,
        keywords: 100,
        users: 1,
        apiCalls: 1000,
        teams: 0,
        customReports: 0,
        dataRetentionDays: 30,
      }),
      is_active: true,
      trial_days: 0,
    },
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Ideal for small businesses and solo entrepreneurs',
      price: 49.00,
      billing_cycle: 'monthly',
      features: JSON.stringify([
        'Up to 25 campaigns',
        'Up to 1,000 keywords',
        'Advanced reporting',
        'Priority email support',
        'API access',
        '3 user accounts',
        '10,000 API calls/month',
        'Data export (CSV, Excel)',
        '90-day data retention',
      ]),
      limits: JSON.stringify({
        campaigns: 25,
        keywords: 1000,
        users: 3,
        apiCalls: 10000,
        teams: 1,
        customReports: 10,
        dataRetentionDays: 90,
      ]),
      is_active: true,
      trial_days: 14,
    },
    {
      name: 'Professional',
      slug: 'professional',
      description: 'Best for growing agencies and businesses',
      price: 149.00,
      billing_cycle: 'monthly',
      features: JSON.stringify([
        'Up to 100 campaigns',
        'Up to 10,000 keywords',
        'Custom reports & dashboards',
        'Priority support (email + chat)',
        'Full API access',
        '10 user accounts',
        '50,000 API calls/month',
        'Team collaboration',
        'Advanced automation rules',
        'Bulk operations',
        'Data export (CSV, Excel, PDF)',
        '1-year data retention',
        'Slack integration',
      ]),
      limits: JSON.stringify({
        campaigns: 100,
        keywords: 10000,
        users: 10,
        apiCalls: 50000,
        teams: 5,
        customReports: 50,
        dataRetentionDays: 365,
      ]),
      is_active: true,
      trial_days: 14,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Complete solution for large agencies and enterprises',
      price: 499.00,
      billing_cycle: 'monthly',
      features: JSON.stringify([
        'Unlimited campaigns',
        'Unlimited keywords',
        'Unlimited custom reports',
        'Dedicated support manager',
        'Full API access',
        'Unlimited user accounts',
        'Unlimited API calls',
        'Advanced team collaboration',
        'Advanced automation & AI features',
        'Bulk operations',
        'All data export formats',
        'Unlimited data retention',
        'White labeling',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated account manager',
        'Training & onboarding',
      ]),
      limits: JSON.stringify({
        campaigns: -1, // -1 means unlimited
        keywords: -1,
        users: -1,
        apiCalls: -1,
        teams: -1,
        customReports: -1,
        dataRetentionDays: -1,
      ]),
      is_active: true,
      trial_days: 30,
    },
  ];

  await knex('subscription_plans').insert(plans);

  console.log('✅ Subscription plans seeded successfully');
  console.log('   - Free: $0/month');
  console.log('   - Starter: $49/month (14-day trial)');
  console.log('   - Professional: $149/month (14-day trial)');
  console.log('   - Enterprise: $499/month (30-day trial)');
}

export async function down(knex: Knex): Promise<void> {
  await knex('subscription_plans').del();
}
