import { Model } from 'objection';
import { AmazonAccount } from './AmazonAccount';

export class SyncJob extends Model {
  static tableName = 'sync_jobs';

  id!: string;
  account_id!: string;
  job_type!: 'FULL_SYNC' | 'CAMPAIGNS' | 'KEYWORDS' | 'PERFORMANCE' | 'SEARCH_TERMS';
  status!: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  started_at?: Date;
  completed_at?: Date;
  records_processed?: number;
  records_failed?: number;
  error_message?: string;
  metadata?: any;
  created_at!: Date;
  updated_at!: Date;

  static get relationMappings() {
    return {
      amazonAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: AmazonAccount,
        join: {
          from: 'sync_jobs.account_id',
          to: 'amazon_accounts.id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['account_id', 'job_type', 'status'],
      properties: {
        id: { type: 'string' },
        account_id: { type: 'string' },
        job_type: { type: 'string', enum: ['FULL_SYNC', 'CAMPAIGNS', 'KEYWORDS', 'PERFORMANCE', 'SEARCH_TERMS'] },
        status: { type: 'string', enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'] },
        started_at: { type: 'string', format: 'date-time' },
        completed_at: { type: 'string', format: 'date-time' },
        error_message: { type: 'string' },
        metadata: { type: 'object' }
      }
    };
  }
}