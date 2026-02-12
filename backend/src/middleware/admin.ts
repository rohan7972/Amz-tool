import { Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to require admin role
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (req.user.role !== 'admin') {
      // Log unauthorized access attempt
      await db('security_audit_logs').insert({
        user_id: req.user.id,
        action: 'admin_access_denied',
        status: 'failure',
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        risk_level: 'medium',
        metadata: JSON.stringify({
          attempted_path: req.path,
          user_role: req.user.role,
        }),
      });

      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }

    // Log successful admin access
    await db('user_activity').insert({
      user_id: req.user.id,
      action: 'admin_access',
      entity_type: 'admin_panel',
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      metadata: JSON.stringify({
        path: req.path,
        method: req.method,
      }),
    });

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization check failed',
    });
  }
};

/**
 * Middleware to log all admin actions
 */
export const auditLog = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store original send function
    const originalSend = res.send;

    // Override send function to log after response
    res.send = function (data: any) {
      // Log the action
      db('security_audit_logs')
        .insert({
          user_id: req.user?.id,
          action,
          resource_type: req.baseUrl.split('/').pop(),
          resource_id: req.params.id,
          status: res.statusCode < 400 ? 'success' : 'failure',
          ip_address: req.ip,
          user_agent: req.get('user-agent'),
          changes: JSON.stringify(req.body),
          risk_level: determineRiskLevel(action),
        })
        .catch((err) => console.error('Audit log error:', err));

      // Call original send
      return originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Determine risk level based on action
 */
function determineRiskLevel(action: string): string {
  const highRiskActions = ['user.deleted', 'system_settings.updated', 'feature_flags.updated'];
  const mediumRiskActions = ['user.updated', 'formula.deleted', 'rule.deleted'];

  if (highRiskActions.includes(action)) return 'high';
  if (mediumRiskActions.includes(action)) return 'medium';
  return 'low';
}
