import { Router } from 'express';
import { db } from '../../utils/database';
import bcrypt from 'bcrypt';
import { auditLog } from '../../middleware/admin';

const router = Router();

/**
 * GET /api/admin/users
 * Get all users with pagination and filters
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    let query = db('users').select('*');

    // Apply filters
    if (search) {
      query = query.where((builder) => {
        builder
          .where('email', 'ilike', `%${search}%`)
          .orWhere('first_name', 'ilike', `%${search}%`)
          .orWhere('last_name', 'ilike', `%${search}%`);
      });
    }

    if (role) {
      query = query.where({ role });
    }

    if (status === 'active') {
      query = query.where({ is_active: true });
    } else if (status === 'inactive') {
      query = query.where({ is_active: false });
    }

    // Get total count
    const countQuery = query.clone().clearSelect();
    const countResult = await countQuery.count('* as count').first();
    const totalCount = parseInt((countResult as any)?.count || '0');

    // Get paginated results
    const users = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Remove sensitive data
    const sanitizedUsers = users.map((user) => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: sanitizedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/users/:id
 * Get single user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Remove sensitive data
    const { password_hash, ...userWithoutPassword } = user;

    // Get user's activity count
    const { count: activityCount } = await db('user_activity')
      .where({ user_id: id })
      .count('* as count')
      .first();

    // Get user's accounts
    const accounts = await db('amazon_accounts')
      .where({ user_id: id })
      .select('id', 'account_name', 'marketplace_id', 'status', 'created_at');

    res.json({
      success: true,
      data: {
        ...userWithoutPassword,
        activity_count: parseInt(activityCount as string),
        accounts,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/users
 * Create a new user
 */
router.post('/', auditLog('user.created'), async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, is_active } = req.body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if user exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db('users')
      .insert({
        email,
        password_hash,
        first_name,
        last_name,
        role: role || 'user',
        is_active: is_active !== undefined ? is_active : true,
      })
      .returning('*');

    // Remove sensitive data
    const { password_hash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/users/:id
 * Update user
 */
router.put('/:id', auditLog('user.updated'), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, role, is_active, password } = req.body;

    // Check if user exists
    const user = await db('users').where({ id }).first();
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (email) updateData.email = email;
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (role) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update password if provided
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    updateData.updated_at = new Date();

    // Update user
    const [updatedUser] = await db('users')
      .where({ id })
      .update(updateData)
      .returning('*');

    // Remove sensitive data
    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/:id', auditLog('user.deleted'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await db('users').where({ id }).first();
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Prevent deleting yourself
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account',
      });
    }

    // Delete user (cascade will handle related records)
    await db('users').where({ id }).delete();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/users/bulk-delete
 * Bulk delete users
 */
router.post('/bulk-delete', auditLog('users.bulk_deleted'), async (req, res) => {
  try {
    const { user_ids } = req.body;

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'user_ids must be a non-empty array',
      });
    }

    // Prevent deleting yourself
    if (req.user && user_ids.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account',
      });
    }

    // Delete users
    const deletedCount = await db('users').whereIn('id', user_ids).delete();

    res.json({
      success: true,
      message: `${deletedCount} users deleted successfully`,
      count: deletedCount,
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/users/:id/activity
 * Get user activity logs
 */
router.get('/:id/activity', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const activity = await db('user_activity')
      .where({ user_id: id })
      .orderBy('created_at', 'desc')
      .limit(limit);

    res.json({
      success: true,
      data: activity,
    });
  } catch (error: any) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
