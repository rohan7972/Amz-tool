import { Router } from 'express';
import dashboardRoutes from './dashboard';
import usersRoutes from './users';
import formulasRoutes from './formulas';
import settingsRoutes from './settings';

const router = Router();

// Mount all admin sub-routes
router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRoutes);
router.use('/formulas', formulasRoutes);
router.use('/settings', settingsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin API is running',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

export default router;
