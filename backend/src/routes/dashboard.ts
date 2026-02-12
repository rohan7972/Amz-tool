import { Router } from 'express';
import { authenticate, authorize, Permission, requireAccountAccess } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard routes (replicating DataFuel structure)
// GET /api/dashboard/ads - Main dashboard with KPI cards
// GET /api/dashboard/total - Daily report
// GET /api/dashboard/duplicate-keywords - Opportunity keywords
// GET /api/dashboard/search-query-performance - SQP analysis
// GET /api/dashboard/n-gram-analysis - N-gram analysis
// GET /api/dashboard/synopsis/live - Synopsis dashboard
// GET /api/dashboard/synopsis/reports - Synopsis reports
// GET /api/dashboard/smart-labels - Smart labels
// GET /api/dashboard/day-parting - Day parting
// GET /api/dashboard/alerts - Alerts

// Placeholder for now
router.get('/health', (req, res) => {
  res.json({ message: 'Dashboard routes are ready for implementation' });
});

export { router as dashboardRoutes };