import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Check if admin user exists
  const existingAdmin = await knex('users')
    .where({ email: 'admin@amazonfdc.com' })
    .first();

  if (!existingAdmin) {
    // Hash password: admin123
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Insert admin user
    await knex('users').insert({
      email: 'admin@amazonfdc.com',
      password_hash: passwordHash,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      email_verified: true,
      email_verified_at: new Date(),
      preferences: JSON.stringify({
        theme: 'light',
        notifications: true,
      }),
    });

    console.log('✅ Admin user created: admin@amazonfdc.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Insert some default system settings
  const defaultSettings = [
    {
      key: 'app_name',
      value: 'Amazon FDC Tool',
      type: 'string',
      category: 'general',
      description: 'Application name',
      is_public: true,
    },
    {
      key: 'max_campaigns_per_user',
      value: '100',
      type: 'number',
      category: 'limits',
      description: 'Maximum campaigns per user',
      is_public: false,
    },
    {
      key: 'enable_email_notifications',
      value: 'true',
      type: 'boolean',
      category: 'notifications',
      description: 'Enable email notifications',
      is_public: false,
    },
  ];

  for (const setting of defaultSettings) {
    const exists = await knex('system_settings')
      .where({ key: setting.key })
      .first();

    if (!exists) {
      await knex('system_settings').insert(setting);
    }
  }

  console.log('✅ Default system settings created');

  // Insert default feature flags
  const defaultFlags = [
    {
      key: 'ai_recommendations',
      name: 'AI Recommendations',
      description: 'Enable AI-powered campaign recommendations',
      is_enabled: false,
      rollout_percentage: 0,
    },
    {
      key: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Enable advanced analytics dashboard',
      is_enabled: true,
      rollout_percentage: 100,
    },
    {
      key: 'bulk_operations',
      name: 'Bulk Operations',
      description: 'Enable bulk edit operations',
      is_enabled: true,
      rollout_percentage: 100,
    },
  ];

  for (const flag of defaultFlags) {
    const exists = await knex('feature_flags')
      .where({ key: flag.key })
      .first();

    if (!exists) {
      await knex('feature_flags').insert(flag);
    }
  }

  console.log('✅ Default feature flags created');
}
