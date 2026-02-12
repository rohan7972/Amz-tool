import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../utils/database';
import { logger } from '../utils/logger';
import { AuthenticationError, AuthorizationError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
        accountIds: string[];
      };
    }
  }
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// User roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer',
}

// Permissions
export enum Permission {
  // User management
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',

  // Account management
  MANAGE_ACCOUNTS = 'manage_accounts',
  VIEW_ACCOUNTS = 'view_accounts',
  CONNECT_ACCOUNTS = 'connect_accounts',

  // Dashboard and analytics
  VIEW_DASHBOARD = 'view_dashboard',
  EXPORT_DATA = 'export_data',

  // Campaign management
  MANAGE_CAMPAIGNS = 'manage_campaigns',
  VIEW_CAMPAIGNS = 'view_campaigns',

  // Automation
  MANAGE_AUTOMATION = 'manage_automation',
  VIEW_AUTOMATION = 'view_automation',

  // Notifications
  MANAGE_NOTIFICATIONS = 'manage_notifications',
  VIEW_NOTIFICATIONS = 'view_notifications',

  // Admin panel
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  MANAGE_SUBSCRIPTIONS = 'manage_subscriptions',
  VIEW_SYSTEM_LOGS = 'view_system_logs',
}

// Role-based permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_ACCOUNTS,
    Permission.VIEW_ACCOUNTS,
    Permission.CONNECT_ACCOUNTS,
    Permission.VIEW_DASHBOARD,
    Permission.EXPORT_DATA,
    Permission.MANAGE_CAMPAIGNS,
    Permission.VIEW_CAMPAIGNS,
    Permission.MANAGE_AUTOMATION,
    Permission.VIEW_AUTOMATION,
    Permission.MANAGE_NOTIFICATIONS,
    Permission.VIEW_NOTIFICATIONS,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.MANAGE_SUBSCRIPTIONS,
    Permission.VIEW_SYSTEM_LOGS,
  ],
  [UserRole.USER]: [
    Permission.VIEW_ACCOUNTS,
    Permission.CONNECT_ACCOUNTS,
    Permission.VIEW_DASHBOARD,
    Permission.EXPORT_DATA,
    Permission.MANAGE_CAMPAIGNS,
    Permission.VIEW_CAMPAIGNS,
    Permission.MANAGE_AUTOMATION,
    Permission.VIEW_AUTOMATION,
    Permission.VIEW_NOTIFICATIONS,
  ],
  [UserRole.VIEWER]: [
    Permission.VIEW_ACCOUNTS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_CAMPAIGNS,
    Permission.VIEW_AUTOMATION,
    Permission.VIEW_NOTIFICATIONS,
  ],
};

// Generate JWT token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_prod';
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload as any, secret as any, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  } as any);
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_do_not_use_in_prod';
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  return jwt.sign({ userId }, secret as any, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  } as any);
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_prod';
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    logger.info(`[Auth] Verifying token with secret: ${secret.substring(0, 10)}...`);
    logger.info(`[Auth] Token length: ${token.length}, First 20 chars: ${token.substring(0, 20)}...`);
    const decoded = jwt.verify(token, secret) as JWTPayload;
    logger.info(`[Auth] Token verified successfully for user: ${decoded.userId}`);
    return decoded;
  } catch (error) {
    logger.error(`[Auth] Token verification failed:`, error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error(`[Auth] JsonWebTokenError details:`, { message: (error as any).message, name: (error as any).name });
      throw new AuthenticationError('Invalid token');
    }
    throw new AuthenticationError('Token verification failed');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } => {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_do_not_use_in_prod';
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  try {
    return jwt.verify(token, secret) as { userId: string };
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
};

// Get user permissions based on role
export const getUserPermissions = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = verifyToken(token);

    const sanitizedUserId = String(payload.userId).trim();
    logger.info(`[Auth] Verifying token for User ID: "${sanitizedUserId}" (Length: ${sanitizedUserId.length})`);

    let user;
    let accountIds: string[] = [];

    // Fetch user details from database
    user = await db('users')
      .select('id', 'email', 'role', 'is_active', 'email_verified')
      .where('id', sanitizedUserId)
      .first();

    if (user && user.is_active) {
      // Get user's account IDs
      const userAccounts = await db('amazon_accounts')
        .select('id')
        .where('user_id', user.id)
        .where('status', 'active');
      accountIds = userAccounts.map(ua => ua.id);
    }

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.is_active) {
      throw new AuthenticationError('Account is deactivated');
    }

    if (!user.email_verified) {
      throw new AuthenticationError('Email not verified');
    }

    // Set user in request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: getUserPermissions(user.role as UserRole),
      accountIds,
    };

    // Log authentication
    logger.info('User authenticated', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    next();
  } catch (error) {
    next(error);
  }
};

// Authorization middleware factory
export const authorize = (requiredPermissions: Permission | Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      const hasPermission = permissions.some(permission =>
        req.user!.permissions.includes(permission)
      );

      if (!hasPermission) {
        logger.warn('Authorization failed', {
          userId: req.user.id,
          requiredPermissions: permissions,
          userPermissions: req.user.permissions,
          path: req.path,
        });
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Role-based authorization middleware
export const requireRole = (roles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      if (!allowedRoles.includes(req.user.role as UserRole)) {
        logger.warn('Role authorization failed', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          path: req.path,
        });
        throw new AuthorizationError('Insufficient role privileges');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Account access middleware
export const requireAccountAccess = (accountIdParam: string = 'accountId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const accountId = req.params[accountIdParam] || req.body.accountId || req.query.accountId;

      if (!accountId) {
        throw new AuthorizationError('Account ID is required');
      }

      // Admin users have access to all accounts
      if (req.user.role === UserRole.ADMIN) {
        next();
        return;
      }

      // Check if user has access to the account
      if (!req.user.accountIds.includes(accountId)) {
        logger.warn('Account access denied', {
          userId: req.user.id,
          requestedAccountId: accountId,
          userAccountIds: req.user.accountIds,
          path: req.path,
        });
        throw new AuthorizationError('Access to this account is not allowed');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Optional authentication middleware (for public endpoints that can benefit from user context)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      const user = await db('users')
        .select('id', 'email', 'role', 'is_active')
        .where('id', payload.userId)
        .first();

      if (user && user.is_active) {
        const userAccounts = await db('amazon_accounts')
          .select('id')
          .where('user_id', user.id)
          .where('status', 'active');

        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          permissions: getUserPermissions(user.role as UserRole),
          accountIds: userAccounts.map(ua => ua.id),
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};

// Rate limiting by user
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.user?.id || req.ip || 'anonymous';
    const now = Date.now();
    const userLimit = userRequests.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      userRequests.set(userId, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (userLimit.count >= maxRequests) {
      throw new AuthorizationError('Rate limit exceeded for user');
    }

    userLimit.count++;
    next();
  };
};

export default {
  authenticate,
  authorize,
  requireRole,
  requireAccountAccess,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  getUserPermissions,
  userRateLimit,
};