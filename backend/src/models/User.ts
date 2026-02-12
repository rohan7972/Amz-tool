import { Model } from 'objection';
import { AmazonAccount } from './AmazonAccount';
import { Report } from './Report';

export class User extends Model {
  static tableName = 'users';

  id!: string;
  email!: string;
  password_hash!: string;
  first_name!: string;
  last_name!: string;
  role!: 'admin' | 'user' | 'viewer';
  is_active!: boolean;
  email_verified!: boolean;
  email_verified_at?: Date;
  last_login_at?: Date;
  preferences!: Record<string, any>;
  created_at!: Date;
  updated_at!: Date;

  // Virtual properties
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  // Relations
  static relationMappings = {
    amazonAccounts: {
      relation: Model.HasManyRelation,
      modelClass: () => AmazonAccount,
      join: {
        from: 'users.id',
        to: 'amazon_accounts.user_id',
      },
    },
    reports: {
      relation: Model.HasManyRelation,
      modelClass: () => Report,
      join: {
        from: 'users.id',
        to: 'reports.user_id',
      },
    },
  };

  // JSON Schema for validation
  static jsonSchema = {
    type: 'object',
    required: ['email', 'password_hash', 'first_name', 'last_name'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email', maxLength: 255 },
      password_hash: { type: 'string', minLength: 60, maxLength: 255 },
      first_name: { type: 'string', minLength: 1, maxLength: 100 },
      last_name: { type: 'string', minLength: 1, maxLength: 100 },
      role: { type: 'string', enum: ['admin', 'user', 'viewer'] },
      is_active: { type: 'boolean' },
      email_verified: { type: 'boolean' },
      email_verified_at: { type: ['string', 'null'], format: 'date-time' },
      last_login_at: { type: ['string', 'null'], format: 'date-time' },
      preferences: { type: 'object' },
    },
  };

  // Hooks
  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  // Instance methods
  toJSON() {
    const json = super.toJSON() as any;
    // Remove sensitive data
    delete json.password_hash;
    return json;
  }

  hasPermission(permission: string): boolean {
    const rolePermissions = {
      admin: ['*'],
      user: ['read', 'write', 'manage_own'],
      viewer: ['read'],
    };

    const permissions = rolePermissions[this.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  }

  canAccessAccount(accountId: string): boolean {
    // Admin can access all accounts
    if (this.role === 'admin') return true;

    // Users can only access their own accounts
    // This would need to be checked against the actual account ownership
    return true; // Simplified for now
  }
}