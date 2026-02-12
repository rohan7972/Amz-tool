/**
 * Keywords API Routes
 * RESTful endpoints for keyword management
 */

import { Router, Request, Response } from 'express';
import { keywordsService } from '../services/keywords.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/keywords
 * Get all keywords (optionally filtered by campaign)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaignId = req.query.campaignId as string | undefined;
    const keywords = await keywordsService.getAllKeywords(userId, campaignId);
    
    return res.json({ success: true, data: keywords });
  } catch (error) {
    console.error('[Keywords API] Error fetching keywords:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch keywords',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/keywords/:id
 * Get single keyword by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const keyword = await keywordsService.getKeywordById(req.params.id, userId);
    
    if (!keyword) {
      return res.status(404).json({ 
        success: false, 
        error: 'Keyword not found' 
      });
    }

    return res.json({ success: true, data: keyword });
  } catch (error) {
    console.error('[Keywords API] Error fetching keyword:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch keyword',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/keywords
 * Create new keyword
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const keyword = await keywordsService.createKeyword(req.body, userId);
    return res.status(201).json({ success: true, data: keyword });
  } catch (error) {
    console.error('[Keywords API] Error creating keyword:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create keyword',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/keywords/:id
 * Update keyword
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const keyword = await keywordsService.updateKeyword(
      req.params.id,
      userId,
      req.body
    );

    if (!keyword) {
      return res.status(404).json({ 
        success: false, 
        error: 'Keyword not found' 
      });
    }

    return res.json({ success: true, data: keyword });
  } catch (error) {
    console.error('[Keywords API] Error updating keyword:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update keyword',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/keywords/:id
 * Archive keyword
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleted = await keywordsService.deleteKeyword(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Keyword not found' 
      });
    }

    return res.json({ success: true, message: 'Keyword archived successfully' });
  } catch (error) {
    console.error('[Keywords API] Error deleting keyword:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete keyword',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/keywords/bulk-update-bids
 * Bulk update keyword bids
 */
router.post('/bulk-update-bids', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request: updates must be an array' 
      });
    }

    const updateCount = await keywordsService.bulkUpdateBids(updates, userId);

    return res.json({ 
      success: true, 
      message: `Successfully updated ${updateCount} keywords`,
      updateCount 
    });
  } catch (error) {
    console.error('[Keywords API] Error bulk updating bids:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update bids',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/keywords/:id/performance
 * Get keyword performance data
 */
router.get('/:id/performance', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const days = parseInt(req.query.days as string) || 30;
    const performance = await keywordsService.getKeywordPerformance(
      req.params.id,
      userId,
      days
    );

    return res.json({ success: true, data: performance });
  } catch (error) {
    console.error('[Keywords API] Error fetching performance:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch performance data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/keywords/sync
 * Sync keywords from Amazon API
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaignId = req.body.campaignId as string | undefined;
    const syncedCount = await keywordsService.syncKeywordsFromAmazon(userId, campaignId);

    return res.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} keywords`,
      syncedCount 
    });
  } catch (error) {
    console.error('[Keywords API] Error syncing keywords:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to sync keywords',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as keywordRoutes };
export default router;
