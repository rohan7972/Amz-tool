import { Router } from 'express';
import { authenticate, requireRole, UserRole } from '../middleware/auth';
import adminRouter from './admin/index';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(UserRole.ADMIN));

// Mount admin routes
router.use('/', adminRouter);

export { router as adminRoutes };