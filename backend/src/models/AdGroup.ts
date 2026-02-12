import { Model } from 'objection';
import { Campaign } from './Campaign';
import { Keyword } from './Keyword';

export class AdGroup extends Model {
  static tableName = 'ad_groups';

  id!: string;
  campaignId!: string;
  adGroupId!: string;
  name!: string;
  defaultBid?: number;
  state!: 'enabled' | 'paused' | 'archived';
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    return {
      campaign: {
        relation: Model.BelongsToOneRelation,
        modelClass: Campaign,
        join: {
          from: 'ad_groups.campaignId',
          to: 'campaigns.id'
        }
      },
      keywords: {
        relation: Model.HasManyRelation,
        modelClass: Keyword,
        join: {
          from: 'ad_groups.id',
          to: 'keywords.adGroupId'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['campaignId', 'adGroupId', 'name', 'state'],
      properties: {
        id: { type: 'string' },
        campaignId: { type: 'string' },
        adGroupId: { type: 'string' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        defaultBid: { type: 'number', minimum: 0 },
        state: { type: 'string', enum: ['enabled', 'paused', 'archived'] }
      }
    };
  }
}