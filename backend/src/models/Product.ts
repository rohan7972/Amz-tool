import { Model } from 'objection';
import { AmazonAccount } from './AmazonAccount';

export class Product extends Model {
  static tableName = 'products';

  id!: string;
  amazonAccountId!: string;
  asin!: string;
  sku!: string;
  title!: string;
  brand?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    return {
      amazonAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: AmazonAccount,
        join: {
          from: 'products.amazonAccountId',
          to: 'amazon_accounts.id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['amazonAccountId', 'asin', 'sku', 'title', 'isActive'],
      properties: {
        id: { type: 'string' },
        amazonAccountId: { type: 'string' },
        asin: { type: 'string', minLength: 10, maxLength: 10 },
        sku: { type: 'string', minLength: 1, maxLength: 255 },
        title: { type: 'string', minLength: 1, maxLength: 500 },
        brand: { type: 'string', maxLength: 255 },
        category: { type: 'string', maxLength: 255 },
        price: { type: 'number', minimum: 0 },
        imageUrl: { type: 'string', maxLength: 1000 },
        isActive: { type: 'boolean' }
      }
    };
  }
}