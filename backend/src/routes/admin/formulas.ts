import { Router } from 'express';
import { db } from '../../utils/database';
import { auditLog } from '../../middleware/admin';
import { evaluate } from 'mathjs';

const router = Router();

/**
 * GET /api/admin/formulas
 * Get all formulas
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const offset = (page - 1) * limit;

    let query = db('formulas').select('*');

    if (category) {
      query = query.where({ category });
    }

    const countResult = await query.clone().clearSelect().count('* as count').first();
    const totalCount = parseInt((countResult as any)?.count || '0');

    const formulas = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      data: formulas,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Get formulas error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/formulas/:id
 * Get single formula
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const formula = await db('formulas').where({ id }).first();

    if (!formula) {
      return res.status(404).json({
        success: false,
        error: 'Formula not found',
      });
    }

    // Get execution history
    const executions = await db('formula_executions')
      .where({ formula_id: id })
      .orderBy('created_at', 'desc')
      .limit(10);

    res.json({
      success: true,
      data: {
        ...formula,
        recent_executions: executions,
      },
    });
  } catch (error: any) {
    console.error('Get formula error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/formulas
 * Create new formula
 */
router.post('/', auditLog('formula.created'), async (req, res) => {
  try {
    const { name, description, category, expression, variables } = req.body;

    if (!name || !expression) {
      return res.status(400).json({
        success: false,
        error: 'Name and expression are required',
      });
    }

    // Validate expression by trying to parse it
    try {
      evaluate(expression.replace(/[a-zA-Z_]+/g, '1')); // Test with dummy values
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid formula expression',
      });
    }

    const [newFormula] = await db('formulas')
      .insert({
        name,
        description,
        category: category || 'custom',
        expression,
        variables: JSON.stringify(variables || []),
        is_active: true,
        version: 1,
        created_by: req.user?.id,
        updated_by: req.user?.id,
      })
      .returning('*');

    res.status(201).json({
      success: true,
      data: newFormula,
      message: 'Formula created successfully',
    });
  } catch (error: any) {
    console.error('Create formula error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/admin/formulas/:id
 * Update formula
 */
router.put('/:id', auditLog('formula.updated'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, expression, variables, is_active } = req.body;

    const formula = await db('formulas').where({ id }).first();

    if (!formula) {
      return res.status(404).json({
        success: false,
        error: 'Formula not found',
      });
    }

    // Validate expression if changed
    if (expression) {
      try {
        evaluate(expression.replace(/[a-zA-Z_]+/g, '1'));
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid formula expression',
        });
      }
    }

    const updateData: any = {
      updated_at: new Date(),
      updated_by: req.user?.id,
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (expression) {
      updateData.expression = expression;
      updateData.version = formula.version + 1;
    }
    if (variables) updateData.variables = JSON.stringify(variables);
    if (is_active !== undefined) updateData.is_active = is_active;

    const [updatedFormula] = await db('formulas')
      .where({ id })
      .update(updateData)
      .returning('*');

    res.json({
      success: true,
      data: updatedFormula,
      message: 'Formula updated successfully',
    });
  } catch (error: any) {
    console.error('Update formula error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/admin/formulas/:id
 * Delete formula
 */
router.delete('/:id', auditLog('formula.deleted'), async (req, res) => {
  try {
    const { id } = req.params;

    const formula = await db('formulas').where({ id }).first();

    if (!formula) {
      return res.status(404).json({
        success: false,
        error: 'Formula not found',
      });
    }

    await db('formulas').where({ id }).delete();

    res.json({
      success: true,
      message: 'Formula deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete formula error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/formulas/:id/test
 * Test formula execution
 */
router.post('/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    const { input_variables } = req.body;

    const formula = await db('formulas').where({ id }).first();

    if (!formula) {
      return res.status(404).json({
        success: false,
        error: 'Formula not found',
      });
    }

    const startTime = Date.now();

    try {
      // Replace variables in expression
      let expression = formula.expression;
      if (input_variables) {
        Object.keys(input_variables).forEach((key) => {
          expression = expression.replace(new RegExp(key, 'g'), input_variables[key]);
        });
      }

      // Evaluate
      const result = evaluate(expression);
      const executionTime = Date.now() - startTime;

      // Log execution
      await db('formula_executions').insert({
        formula_id: id,
        user_id: req.user?.id,
        input_variables: JSON.stringify(input_variables || {}),
        result,
        execution_time_ms: executionTime,
        status: 'success',
      });

      // Update usage count
      await db('formulas')
        .where({ id })
        .update({
          usage_count: db.raw('usage_count + 1'),
          last_executed_at: new Date(),
        });

      res.json({
        success: true,
        data: {
          result,
          execution_time_ms: executionTime,
        },
        message: 'Formula executed successfully',
      });
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      // Log failed execution
      await db('formula_executions').insert({
        formula_id: id,
        user_id: req.user?.id,
        input_variables: JSON.stringify(input_variables || {}),
        result: null,
        execution_time_ms: executionTime,
        status: 'error',
        error_message: error.message,
      });

      return res.status(400).json({
        success: false,
        error: `Formula execution failed: ${error.message}`,
      });
    }
  } catch (error: any) {
    console.error('Test formula error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/formulas/:id/executions
 * Get formula execution history
 */
router.get('/:id/executions', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const executions = await db('formula_executions')
      .where({ formula_id: id })
      .orderBy('created_at', 'desc')
      .limit(limit);

    res.json({
      success: true,
      data: executions,
    });
  } catch (error: any) {
    console.error('Get executions error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
