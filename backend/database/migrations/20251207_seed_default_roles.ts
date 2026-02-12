import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Insert default permissions
  const permissions = [
    // Users
    { name: 'View Users', slug: 'users:view', resource: 'users', action: 'view', description: 'View user list and details' },
    { name: 'Create Users', slug: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
    { name: 'Update Users', slug: 'users:update', resource: 'users', action: 'update', description: 'Update user information' },
    { name: 'Delete Users', slug: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
    
    // Campaigns
    { name: 'View Campaigns', slug: 'campaigns:view', resource: 'campaigns', action: 'view', description: 'View campaigns' },
    { name: 'Create Campaigns', slug: 'campaigns:create', resource: 'campaigns', action: 'create', description: 'Create campaigns' },
    { name: 'Update Campaigns', slug: 'campaigns:update', resource: 'campaigns', action: 'update', description: 'Update campaigns' },
    { name: 'Delete Campaigns', slug: 'campaigns:delete', resource: 'campaigns', action: 'delete', description: 'Delete campaigns' },
    
    // Keywords
    { name: 'View Keywords', slug: 'keywords:view', resource: 'keywords', action: 'view', description: 'View keywords' },
    { name: 'Create Keywords', slug: 'keywords:create', resource: 'keywords', action: 'create', description: 'Create keywords' },
    { name: 'Update Keywords', slug: 'keywords:update', resource: 'keywords', action: 'update', description: 'Update keywords' },
    { name: 'Delete Keywords', slug: 'keywords:delete', resource: 'keywords', action: 'delete', description: 'Delete keywords' },
    
    // Admin
    { name: 'Access Admin Panel', slug: 'admin:view', resource: 'admin', action: 'view', description: 'Access admin panel' },
    { name: 'Manage Roles', slug: 'roles:manage', resource: 'roles', action: 'manage', description: 'Create, update, delete roles' },
    { name: 'Manage Organizations', slug: 'organizations:manage', resource: 'organizations', action: 'manage', description: 'Manage organizations' },
    { name: 'Manage Subscriptions', slug: 'subscriptions:manage', resource: 'subscriptions', action: 'manage', description: 'Manage subscriptions' },
    { name: 'View Audit Logs', slug: 'audit:view', resource: 'audit', action: 'view', description: 'View audit logs' },
    
    // Teams
    { name: 'View Teams', slug: 'teams:view', resource: 'teams', action: 'view', description: 'View teams' },
    { name: 'Manage Teams', slug: 'teams:manage', resource: 'teams', action: 'manage', description: 'Create, update, delete teams' },
    { name: 'Invite Team Members', slug: 'teams:invite', resource: 'teams', action: 'invite', description: 'Invite team members' },
    
    // Reports
    { name: 'View Reports', slug: 'reports:view', resource: 'reports', action: 'view', description: 'View reports' },
    { name: 'Create Reports', slug: 'reports:create', resource: 'reports', action: 'create', description: 'Create custom reports' },
    { name: 'Export Data', slug: 'reports:export', resource: 'reports', action: 'export', description: 'Export data' },
  ];

  await knex('permissions').insert(permissions);

  // 2. Insert default system roles
  const roles = [
    {
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Full system access with all permissions',
      permissions: JSON.stringify(['*']), // Wildcard for all permissions
      is_system: true,
      organization_id: null,
    },
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Organization administrator with full access',
      permissions: JSON.stringify([
        'users:*',
        'campaigns:*',
        'keywords:*',
        'teams:*',
        'reports:*',
        'admin:view',
      ]),
      is_system: true,
      organization_id: null,
    },
    {
      name: 'Manager',
      slug: 'manager',
      description: 'Team manager with limited admin access',
      permissions: JSON.stringify([
        'users:view',
        'campaigns:*',
        'keywords:*',
        'teams:view',
        'teams:invite',
        'reports:*',
      ]),
      is_system: true,
      organization_id: null,
    },
    {
      name: 'User',
      slug: 'user',
      description: 'Regular user with campaign management access',
      permissions: JSON.stringify([
        'campaigns:view',
        'campaigns:create',
        'campaigns:update',
        'keywords:view',
        'keywords:create',
        'keywords:update',
        'reports:view',
      ]),
      is_system: true,
      organization_id: null,
    },
    {
      name: 'Viewer',
      slug: 'viewer',
      description: 'Read-only access to campaigns and reports',
      permissions: JSON.stringify([
        'campaigns:view',
        'keywords:view',
        'reports:view',
      ]),
      is_system: true,
      organization_id: null,
    },
  ];

  await knex('roles').insert(roles);

  console.log('✅ Default permissions and roles seeded successfully');
}

export async function down(knex: Knex): Promise<void> {
  await knex('roles').where('is_system', true).del();
  await knex('permissions').del();
}
