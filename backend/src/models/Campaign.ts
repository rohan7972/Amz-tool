import { Model } from 'objection';
import { AmazonAccount } from './AmazonAccount';
import { AdGroup } from './AdGroup';

export class Campaign extends Model {
  static tableName = 'campaigns';

  id!: string;
  amazonAccountId!: string;
  campaignId!: string;
  name!: string;
  campaignType!: 'sponsoredProducts' | 'sponsoredBrands' | 'sponsoredDisplay';
  targetingType!: 'manual' | 'auto';
  state!: 'enabled' | 'paused' | 'archived';
  dailyBudget?: number;
  startDate?: string;
  endDate?: string;
  premiumBidAdjustment?: boolean;
  bidding?: any;
  tags?: any;
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    return {
      amazonAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: AmazonAccount,
        join: {
          from: 'campaigns.amazonAccountId',
          to: 'amazon_accounts.id'
        }
      },
      adGroups: {
        relation: Model.HasManyRelation,
        modelClass: AdGroup,
        join: {
          from: 'campaigns.id',
          to: 'ad_groups.campaignId'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['amazonAccountId', 'campaignId', 'name', 'campaignType', 'targetingType', 'state'],
      properties: {
        id: { type: 'string' },
        amazonAccountId: { type: 'string' },
        campaignId: { type: 'string' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        campaignType: { type: 'string', enum: ['sponsoredProducts', 'sponsoredBrands', 'sponsoredDisplay'] },
        targetingType: { type: 'string', enum: ['manual', 'auto'] },
        state: { type: 'string', enum: ['enabled', 'paused', 'archived'] },
        dailyBudget: { type: 'number', minimum: 0 },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        premiumBidAdjustment: { type: 'boolean' },
        bidding: { type: 'object' },
        tags: { type: 'object' }
      }
    };
  }
}