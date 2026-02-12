import { Router } from 'express';
import { db } from '../../utils/database';
import { auditLog } from '../../middleware/admin';

const router = Router();

/**
 * GET /api/admin/settings
 * Get all system settings
 */
router.get('/', async (req, res) => {
  try {
    const category = req.query.category as string;

    let query = db('system_settings').select('*');

    if (category) {
      query = query.where({ category });
    }

    const settings = await query.orderBy('category').orderBy('key');

    res.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/settings/:key
 * Get single setting by key
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await db('system_settings').where({ key }).first();

    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found',
      });
    }

    res.json({
      success: true,
      data: setting,
    });
  } catch (error: any) {
    console.error('Get setting error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/settings
 * Create new setting
 */
router.post('/', auditLog('setting.created'), async (req, res) => {
  try {
    const { key, value, type, category, description, is_public, is_encrypted } = req.body;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required',
      });
    }

    // Check if setting exists
    const existing = await db('system_settings').where({ key }).first();
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Setting with this key already exists',
      });
    }

    const [newSetting] = await db('system_settings')
      .insert({
        key,
        value,
        type: type || 'string',
        category,
        description,
        is_public: is_public || false,
        is_encrypted: is_encrypted || false,
        updated_by: req.user?.id,
      })
      .returning('*');

    res.status(201).json({
      success: true,
      data: newSetting,
      message: 'Setting created successfully',
    });
  } catch (error: any) {
    console.error('Create setting error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/settings/:key
 * Update setting
 */
router.put('/:key', auditLog('setting.updated'), async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description, is_public } = req.body;

    const setting = await db('system_settings').where({ key }).first();

    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found',
      });
    }

    const updateData: any = { updated_at: new Date() };

    if (value !== undefined) updateData.value = value;
    if (description !== undefined) updateData.description = description;
    if (is_public !== undefined) updateData.is_public = is_public;
    if (req.user) updateData.updated_by = req.user.id;

    const [updatedSetting] = await db('system_settings')
      .where({ key })
      .update(updateData)
      .returning('*');

    res.json({
      success: true,
      data: updatedSetting,
      message: 'Setting updated successfully',
    });
  } catch (error: any) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/admin/settings/:key
 * Delete setting
 */
router.delete('/:key', auditLog('setting.deleted'), async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await db('system_settings').where({ key }).first();

    if (!setting) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found',
      });
    }

    await db('system_settings').where({ key }).delete();

    res.json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/feature-flags
 * Get all feature flags
 */
router.get('/flags/all', async (req, res) => {
  try {
    const flags = await db('feature_flags')
      .select('*')
      .orderBy('created_at', 'desc');

    res.json({
      success: true,
      data: flags,
    });
  } catch (error: any) {
    console.error('Get feature flags error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/feature-flags/:id
 * Update feature flag
 */
router.put('/flags/:id', auditLog('feature_flag.updated'), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_enabled, rollout_percentage } = req.body;

    const flag = await db('feature_flags').where({ id }).first();

    if (!flag) {
      return res.status(404).json({
        success: false,
        error: 'Feature flag not found',
      });
    }

    const updateData: any = { updated_at: new Date() };

    if (is_enabled !== undefined) updateData.is_enabled = is_enabled;
    if (rollout_percentage !== undefined) {
      updateData.rollout_percentage = Math.max(0, Math.min(100, rollout_percentage));
    }
    if (req.user) updateData.updated_by = req.user.id;

    const [updatedFlag] = await db('feature_flags')
      .where({ id })
      .update(updateData)
      .returning('*');

    res.json({
      success: true,
      data: updatedFlag,
      message: 'Feature flag updated successfully',
    });
  } catch (error: any) {
    console.error('Update feature flag error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
