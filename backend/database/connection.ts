import knex from 'knex';
import { Model } from 'objection';
import config from './knexfile';
import logger from '../utils/logger';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

// Initialize Knex instance
const db = knex(knexConfig);

// Give the knex instance to objection
Model.knex(db);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    return false;
  }
};

// Run migrations
export const runMigrations = async (): Promise<void> => {
  try {
    await db.migrate.latest();
    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Failed to run migrations:', error);
    throw error;
  }
};

// Close database connection
export const closeConnection = async (): Promise<void> => {
  try {
    await db.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

export default db;