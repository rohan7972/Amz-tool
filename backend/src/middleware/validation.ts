import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Validation middleware factory
 * Creates middleware that validates request data against Zod schemas
 */
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the request data
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        logger.warn('Request validation failed', {
          path: req.path,
          method: req.method,
          errors: validationErrors,
          body: req.body,
          query: req.query,
          params: req.params
        });

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationErrors
        });
        return;
      }

      // Handle unexpected validation errors
      logger.error('Unexpected validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        path: req.path,
        method: req.method
      });

      res.status(500).json({
        success: false,
        error: 'Internal validation error'
      });
    }
  };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        res.status(400).json({
          success: false,
          error: 'Query validation failed',
          details: validationErrors
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal validation error'
      });
    }
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        res.status(400).json({
          success: false,
          error: 'Body validation failed',
          details: validationErrors
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal validation error'
      });
    }
  };
};

/**
 * Validate route parameters
 */
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        res.status(400).json({
          success: false,
          error: 'Parameter validation failed',
          details: validationErrors
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal validation error'
      });
    }
  };
};

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // UUID parameter validation
  uuidParam: z.object({
    id: z.string().uuid('Invalid UUID format')
  }),

  // Pagination query validation
  pagination: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  }),

  // Date range validation
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  }).refine(data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, {
    message: 'Start date must be before end date'
  }),

  // Search query validation
  search: z.object({
    q: z.string().min(1).max(100).optional(),
    filters: z.record(z.string(), z.string()).optional()
  })
};

/**
 * Sanitize input data
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, '')
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
};

/**
 * Middleware to sanitize all request data
 */
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);
  next();
};