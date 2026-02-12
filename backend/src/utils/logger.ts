import winston from 'winston';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'amazon-fdc-tool' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create a stream object for Morgan HTTP request logging
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Helper functions for structured logging
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error('Error occurred', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    context,
  });
};

export const logInfo = (message: string, meta?: Record<string, any>) => {
  logger.info(message, meta);
};

export const logWarning = (message: string, meta?: Record<string, any>) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, any>) => {
  logger.debug(message, meta);
};

// Performance logging helper
export const logPerformance = (operation: string, startTime: number, meta?: Record<string, any>) => {
  const duration = Date.now() - startTime;
  logger.info(`Performance: ${operation}`, {
    duration: `${duration}ms`,
    ...meta,
  });
};

// API request logging helper
export const logApiRequest = (method: string, url: string, statusCode: number, duration: number, userId?: string) => {
  logger.info('API Request', {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    userId,
  });
};

// Database query logging helper
export const logDbQuery = (query: string, duration: number, params?: any[]) => {
  logger.debug('Database Query', {
    query: query.replace(/\s+/g, ' ').trim(),
    duration: `${duration}ms`,
    params,
  });
};

// Amazon API logging helper
export const logAmazonApiCall = (
  apiType: 'SP-API' | 'Advertising-API',
  endpoint: string,
  method: string,
  statusCode: number,
  duration: number,
  accountId?: string
) => {
  logger.info('Amazon API Call', {
    apiType,
    endpoint,
    method,
    statusCode,
    duration: `${duration}ms`,
    accountId,
  });
};

// Automation logging helper
export const logAutomation = (
  ruleId: string,
  ruleName: string,
  action: string,
  result: 'success' | 'failure' | 'skipped',
  details?: Record<string, any>
) => {
  logger.info('Automation Rule Executed', {
    ruleId,
    ruleName,
    action,
    result,
    details,
  });
};

// Notification logging helper
export const logNotification = (
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'in-app',
  recipient: string,
  subject: string,
  status: 'sent' | 'failed' | 'queued',
  error?: string
) => {
  logger.info('Notification', {
    type,
    recipient,
    subject,
    status,
    error,
  });
};

export default logger;