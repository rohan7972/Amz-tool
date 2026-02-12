import { Model } from 'objection';
import { AmazonAccount } from './AmazonAccount';
import { User } from './User';

export class Report extends Model {
  static tableName = 'reports';

  id!: string;
  amazonAccountId!: string;
  userId!: string;
  reportType!: 'campaign' | 'keyword' | 'product' | 'search_term' | 'custom';
  name!: string;
  description?: string;
  filters?: any;
  columns?: string[];
  isScheduled!: boolean;
  scheduleConfig?: any;
  lastRunAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    return {
      amazonAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: AmazonAccount,
        join: {
          from: 'reports.amazonAccountId',
          to: 'amazon_accounts.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reports.userId',
          to: 'users.id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['amazonAccountId', 'userId', 'reportType', 'name', 'isScheduled'],
      properties: {
        id: { type: 'string' },
        amazonAccountId: { type: 'string' },
        userId: { type: 'string' },
        reportType: { type: 'string', enum: ['campaign', 'keyword', 'product', 'search_term', 'custom'] },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', maxLength: 1000 },
        filters: { type: 'object' },
        columns: { type: 'array', items: { type: 'string' } },
        isScheduled: { type: 'boolean' },
        scheduleConfig: { type: 'object' },
        lastRunAt: { type: 'string', format: 'date-time' }
      }
    };
  }
}