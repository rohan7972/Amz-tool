import { Router } from 'express';
import { authenticate, authorize, Permission, requireAccountAccess } from '../middleware/auth';

const router = Router();

// All account routes require authentication
router.use(authenticate);

// Amazon account management routes
// GET /api/accounts - List connected accounts
// POST /api/accounts/connect - Connect new Amazon account
// GET /api/accounts/:id - Get account details
// PUT /api/accounts/:id - Update account settings
// DELETE /api/accounts/:id - Disconnect account
// POST /api/accounts/:id/sync - Trigger account sync
// GET /api/accounts/:id/status - Get sync status

// Placeholder for now
router.get('/health', (req, res) => {
  res.json({ message: 'Account routes are ready for implementation' });
});

export { router as accountRoutes };