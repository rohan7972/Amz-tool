import knex, { Knex } from 'knex';
import { logger, logDbQuery, logError } from './logger';

// Database configuration
const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'amazon_fdc_tool',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Create database instance
export const db = knex(config);

// Query logging middleware
if (process.env.NODE_ENV === 'development') {
  db.on('query', (query) => {
    const startTime = Date.now();
    query.response = query.response || Promise.resolve();
    
    query.response
      .then(() => {
        const duration = Date.now() - startTime;
        logDbQuery(query.sql, duration, query.bindings);
      })
      .catch((error: Error) => {
        const duration = Date.now() - startTime;
        logError(error, {
          query: query.sql,
          bindings: query.bindings,
          duration: `${duration}ms`,
        });
      });
  });
}

// Connection health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await db.raw('SELECT 1');
    logger.info('✅ Database connection established successfully');
    return true;
  } catch (error) {
    logError(error as Error, { context: 'Database connection check' });
    return false;
  }
};

// Transaction helper
export const withTransaction = async <T>(
  callback: (trx: Knex.Transaction) => Promise<T>
): Promise<T> => {
  const trx = await db.transaction();
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

// Pagination helper
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const paginate = async <T>(
  query: Knex.QueryBuilder,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  // Clone query for count
  const countQuery = query.clone().clearSelect().clearOrder().count('* as total').first();
  
  // Apply sorting
  if (options.sortBy) {
    query.orderBy(options.sortBy, options.sortOrder || 'asc');
  }

  // Apply pagination
  query.limit(limit).offset(offset);

  // Execute queries
  const [data, countResult] = await Promise.all([
    query,
    countQuery,
  ]);

  const total = parseInt((countResult as any)?.total || '0');
  const totalPages = Math.ceil(total / limit);

  return {
    data: data as T[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Date range filter helper
export const applyDateRangeFilter = (
  query: Knex.QueryBuilder,
  column: string,
  startDate?: string | Date,
  endDate?: string | Date
): Knex.QueryBuilder => {
  if (startDate) {
    query.where(column, '>=', startDate);
  }
  if (endDate) {
    query.where(column, '<=', endDate);
  }
  return query;
};

// Search filter helper
export const applySearchFilter = (
  query: Knex.QueryBuilder,
  columns: string[],
  searchTerm?: string
): Knex.QueryBuilder => {
  if (searchTerm && columns.length > 0) {
    query.where((builder) => {
      columns.forEach((column, index) => {
        if (index === 0) {
          builder.whereILike(column, `%${searchTerm}%`);
        } else {
          builder.orWhereILike(column, `%${searchTerm}%`);
        }
      });
    });
  }
  return query;
};

// Bulk insert helper
export const bulkInsert = async <T>(
  tableName: string,
  data: T[],
  chunkSize: number = 1000
): Promise<void> => {
  if (data.length === 0) return;

  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    await db(tableName).insert(chunk);
  }
};

// Upsert helper (insert or update)
export const upsert = async <T extends Record<string, any>>(
  tableName: string,
  data: T,
  conflictColumns: string[]
): Promise<T> => {
  const query = db(tableName).insert(data);
  
  if (conflictColumns.length > 0) {
    const updateData = { ...data };
    conflictColumns.forEach(col => delete updateData[col]);
    
    query.onConflict(conflictColumns).merge(updateData);
  }

  const result = await query.returning('*');
  return result[0] as T;
};

// Soft delete helper
export const softDelete = async (
  tableName: string,
  id: string | number,
  deletedAtColumn: string = 'deleted_at'
): Promise<void> => {
  await db(tableName)
    .where('id', id)
    .update({
      [deletedAtColumn]: new Date(),
    });
};

// Restore soft deleted record
export const restore = async (
  tableName: string,
  id: string | number,
  deletedAtColumn: string = 'deleted_at'
): Promise<void> => {
  await db(tableName)
    .where('id', id)
    .update({
      [deletedAtColumn]: null,
    });
};

// Database cleanup on app shutdown
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await db.destroy();
    logger.info('🔌 Database connection closed');
  } catch (error) {
    logError(error as Error, { context: 'Database connection cleanup' });
  }
};

// Graceful shutdown handlers
process.on('SIGTERM', closeDatabaseConnection);
process.on('SIGINT', closeDatabaseConnection);

export default db;