/**
 * Campaigns API Routes
 * RESTful endpoints for campaign management
 */

import { Router, Request, Response } from 'express';
import { campaignsService } from '../services/campaigns.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/campaigns
 * Get all campaigns for the authenticated user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaigns = await campaignsService.getAllCampaigns(userId);
    return res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('[Campaigns API] Error fetching campaigns:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch campaigns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/campaigns/:id
 * Get single campaign by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaign = await campaignsService.getCampaignById(req.params.id, userId);
    
    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }

    return res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('[Campaigns API] Error fetching campaign:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/campaigns
 * Create new campaign
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaignData = {
      ...req.body,
      userId,
    };

    const campaign = await campaignsService.createCampaign(campaignData);
    return res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    console.error('[Campaigns API] Error creating campaign:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/campaigns/:id
 * Update campaign
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const campaign = await campaignsService.updateCampaign(
      req.params.id,
      userId,
      req.body
    );

    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }

    return res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('[Campaigns API] Error updating campaign:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to update campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /api/campaigns/:id
 * Archive campaign
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleted = await campaignsService.deleteCampaign(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found' 
      });
    }

    return res.json({ success: true, message: 'Campaign archived successfully' });
  } catch (error) {
    console.error('[Campaigns API] Error deleting campaign:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to delete campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/campaigns/:id/performance
 * Get campaign performance data
 */
router.get('/:id/performance', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const days = parseInt(req.query.days as string) || 30;
    const performance = await campaignsService.getCampaignPerformance(
      req.params.id,
      userId,
      days
    );

    return res.json({ success: true, data: performance });
  } catch (error) {
    console.error('[Campaigns API] Error fetching performance:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch performance data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/campaigns/sync
 * Sync campaigns from Amazon API
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const syncedCount = await campaignsService.syncCampaignsFromAmazon(userId);

    return res.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} campaigns`,
      syncedCount 
    });
  } catch (error) {
    console.error('[Campaigns API] Error syncing campaigns:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to sync campaigns',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as campaignRoutesV2 };
export default router;
