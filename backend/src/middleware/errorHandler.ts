import { Request, Response, NextFunction } from 'express';
import { logger, logError } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends CustomError {
  constructor(message: string, field?: string) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Access denied') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, true, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class AmazonApiError extends CustomError {
  constructor(message: string, apiType: 'SP-API' | 'Advertising-API', statusCode: number = 500) {
    super(`${apiType} Error: ${message}`, statusCode, true, 'AMAZON_API_ERROR');
    this.name = 'AmazonApiError';
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string, originalError?: Error) {
    super(`Database Error: ${message}`, 500, true, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    details?: any;
    requestId?: string;
  };
}

// Generate unique request ID
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format error response
const formatErrorResponse = (
  error: AppError,
  req: Request,
  requestId: string,
  includeStack: boolean = false
): ErrorResponse => {
  const response: ErrorResponse = {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      requestId,
    },
  };

  // Include stack trace in development
  if (includeStack && error.stack) {
    response.error.details = {
      stack: error.stack,
    };
  }

  return response;
};

// Handle specific error types
const handleDatabaseError = (error: any): AppError => {
  if (error.code === '23505') {
    // Unique constraint violation
    return new ConflictError('Resource already exists');
  }
  if (error.code === '23503') {
    // Foreign key constraint violation
    return new ValidationError('Referenced resource does not exist');
  }
  if (error.code === '23502') {
    // Not null constraint violation
    return new ValidationError('Required field is missing');
  }
  return new DatabaseError(error.message, error);
};

const handleJWTError = (error: any): AppError => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  return new AuthenticationError('Authentication failed');
};

const handleValidationError = (error: any): AppError => {
  if (error.isJoi) {
    const message = error.details.map((detail: any) => detail.message).join(', ');
    return new ValidationError(message);
  }
  return new ValidationError(error.message);
};

// Main error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = generateRequestId();
  let appError: AppError;

  // Handle known error types
  if (error instanceof CustomError) {
    appError = error;
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    appError = handleJWTError(error);
  } else if (error.isJoi || error.name === 'ValidationError') {
    appError = handleValidationError(error);
  } else if (error.code && typeof error.code === 'string') {
    appError = handleDatabaseError(error);
  } else {
    // Unknown error
    appError = new CustomError(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      500,
      false
    );
  }

  // Log error
  logError(appError, {
    requestId,
    url: req.originalUrl,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: (req as any).user?.id,
  });

  // Send error response
  const includeStack = process.env.NODE_ENV === 'development';
  const errorResponse = formatErrorResponse(appError, req, requestId, includeStack);

  res.status(appError.statusCode || 500).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    promise,
  });
  
  // Graceful shutdown
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
  });
  
  // Graceful shutdown
  process.exit(1);
});

export default errorHandler;