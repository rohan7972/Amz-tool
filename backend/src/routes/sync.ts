import { Request, Response, Router } from 'express';
import { z } from 'zod'; // Assuming z is available, or use validation middleware
import { authenticate } from '../middleware/auth';
import { syncService } from '../services/SyncService';
import { logger } from '../utils/logger';

const router = Router();

// Validation Schema
const triggerSyncSchema = z.object({
    jobType: z.enum(['FULL_SYNC', 'CAMPAIGNS', 'REPORTS']).optional().default('FULL_SYNC')
});

/**
 * @route POST /api/sync/:accountId/trigger
 * @desc Trigger a new sync job
 */
router.post('/:accountId/trigger', authenticate, async (req: Request, res: Response) => {
    try {
        const { accountId } = req.params;
        const { jobType } = req.body; // Simple body access, assuming validation middleware or manual check

        // Check ownership (TODO: Move to standard middleware)
        // For now, authenticate ensures we have a user, deeper check would be in service or middleware

        const job = await syncService.createJob(accountId, jobType || 'FULL_SYNC');

        logger.info(`User ${req.user?.id} triggered sync for account ${accountId}`);

        res.json({
            success: true,
            message: 'Sync job created successfully',
            data: {
                jobId: job.id,
                status: job.status
            }
        });
    } catch (error: any) {
        logger.error('Trigger sync error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route GET /api/sync/jobs/:jobId
 * @desc Check job status
 */
router.get('/jobs/:jobId', authenticate, async (req: Request, res: Response) => {
    // Implementation needed if we want polling for status
    res.json({ success: true, message: "Endpoint pending implementation" });
});

export default router;
