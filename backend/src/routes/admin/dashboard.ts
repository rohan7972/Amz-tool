import { Router } from 'express';
import { db } from '../../utils/database';

const router = Router();

/**
 * GET /api/admin/dashboard
 * Get basic dashboard info
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Dashboard API is available',
      endpoints: [
        '/api/admin/dashboard/metrics',
        '/api/admin/dashboard/activity',
        '/api/admin/dashboard/charts',
      ],
    },
  });
});

/**
 * GET /api/admin/dashboard/metrics
 * Get system metrics for dashboard
 */
router.get('/metrics', async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await db('users').count('* as count').first();
    const activeUsers = await db('users')
      .where({ is_active: true })
      .count('* as count')
      .first();
    const newUsersThisMonth = await db('users')
      .where('created_at', '>=', db.raw("DATE_TRUNC('month', NOW())"))
      .count('* as count')
      .first();
    const activeUsersLast7Days = await db('users')
      .where('last_login_at', '>=', db.raw("NOW() - INTERVAL '7 days'"))
      .count('* as count')
      .first();

    // Get API usage statistics
    const apiCallsToday = await db('api_usage')
      .whereRaw("DATE(created_at) = CURRENT_DATE")
      .count('* as count')
      .first();
    const avgResponseTime = await db('api_usage')
      .where('created_at', '>=', db.raw("NOW() - INTERVAL '24 hours'"))
      .avg('response_time_ms as avg')
      .first();

    // Get formula statistics
    const totalFormulas = await db('formulas').count('* as count').first();
    const activeFormulas = await db('formulas')
      .where({ is_active: true })
      .count('* as count')
      .first();

    // Get rule statistics
    const totalRules = await db('rules').count('* as count').first();
    const enabledRules = await db('rules')
      .where({ is_enabled: true })
      .count('* as count')
      .first();

    res.json({
      success: true,
      data: {
        users: {
          total: parseInt(totalUsers?.count || '0'),
          active: parseInt(activeUsers?.count || '0'),
          newThisMonth: parseInt(newUsersThisMonth?.count || '0'),
          activePercentage: totalUsers?.count
            ? Math.round((parseInt(activeUsers?.count || '0') / parseInt(totalUsers?.count)) * 100)
            : 0,
          activeLast7Days: parseInt(activeUsersLast7Days?.count || '0'),
        },
        api: {
          callsToday: parseInt(apiCallsToday?.count || '0'),
          avgResponseTime: Math.round(parseFloat(avgResponseTime?.avg || '0')),
          growth: 5.2, // TODO: Calculate actual growth
        },
        formulas: {
          total: parseInt(totalFormulas?.count || '0'),
          active: parseInt(activeFormulas?.count || '0'),
        },
        rules: {
          total: parseInt(totalRules?.count || '0'),
          enabled: parseInt(enabledRules?.count || '0'),
        },
        system: {
          cpuUsage: 67, // TODO: Get from system metrics
          memoryUsage: 45,
          dbQueries: 1234,
          errorRate: 0.02,
          uptime: 99.9,
        },
      },
    });
  } catch (error: any) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/dashboard/activity
 * Get recent activity feed
 */
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const activity = await db('user_activity')
      .select(
        'user_activity.*',
        'users.first_name',
        'users.last_name',
        'users.email'
      )
      .leftJoin('users', 'user_activity.user_id', 'users.id')
      .orderBy('user_activity.created_at', 'desc')
      .limit(limit);

    // Format activity messages
    const formattedActivity = activity.map((item) => ({
      id: item.id,
      message: formatActivityMessage(item),
      user: {
        id: item.user_id,
        name: `${item.first_name} ${item.last_name}`,
        email: item.email,
      },
      timestamp: item.created_at,
      timeAgo: getTimeAgo(item.created_at),
      action: item.action,
      entityType: item.entity_type,
    }));

    res.json({
      success: true,
      data: formattedActivity,
    });
  } catch (error: any) {
    console.error('Activity feed error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/dashboard/charts
 * Get chart data for dashboard
 */
router.get('/charts', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    // User growth chart
    const userGrowth = await db.raw(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // API usage chart
    const apiUsage = await db.raw(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as requests,
        AVG(response_time_ms) as avg_response_time
      FROM api_usage
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      data: {
        userGrowth: userGrowth.rows,
        apiUsage: apiUsage.rows,
      },
    });
  } catch (error: any) {
    console.error('Charts error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Helper functions
function formatActivityMessage(item: any): string {
  const user = `${item.first_name} ${item.last_name}`;
  
  switch (item.action) {
    case 'user.created':
      return `${user} created a new user`;
    case 'user.updated':
      return `${user} updated a user`;
    case 'user.deleted':
      return `${user} deleted a user`;
    case 'formula.created':
      return `${user} created a new formula`;
    case 'rule.executed':
      return `${user} executed a rule`;
    case 'admin_access':
      return `${user} accessed admin panel`;
    default:
      return `${user} performed ${item.action}`;
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default router;
