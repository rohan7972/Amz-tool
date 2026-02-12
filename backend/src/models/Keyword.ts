import { Model } from 'objection';
import { AdGroup } from './AdGroup';

export class Keyword extends Model {
  static tableName = 'keywords';

  id!: string;
  adGroupId!: string;
  keywordId!: string;
  keywordText!: string;
  matchType!: 'exact' | 'phrase' | 'broad';
  state!: 'enabled' | 'paused' | 'archived';
  bid?: number;
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    return {
      adGroup: {
        relation: Model.BelongsToOneRelation,
        modelClass: AdGroup,
        join: {
          from: 'keywords.adGroupId',
          to: 'ad_groups.id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['adGroupId', 'keywordId', 'keywordText', 'matchType', 'state'],
      properties: {
        id: { type: 'string' },
        adGroupId: { type: 'string' },
        keywordId: { type: 'string' },
        keywordText: { type: 'string', minLength: 1, maxLength: 255 },
        matchType: { type: 'string', enum: ['exact', 'phrase', 'broad'] },
        state: { type: 'string', enum: ['enabled', 'paused', 'archived'] },
        bid: { type: 'number', minimum: 0 }
      }
    };
  }
}