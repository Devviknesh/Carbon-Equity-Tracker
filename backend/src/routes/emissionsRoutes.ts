import { Router } from 'express';
import { createUserEmission, createIndustryEmission, getHistory, getAdminStats } from '../controllers/emissionsController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Protect all emission routes with JWT verification
router.use(authenticateJWT as any);

router.post('/user', createUserEmission as any);
router.post('/industry', createIndustryEmission as any);
router.get('/history', getHistory as any);
router.get('/admin/stats', getAdminStats as any);

export default router;
