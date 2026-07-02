import { Router } from 'express';
import { register, login, getMe, checkEmail } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.get('/me', authenticateJWT as any, getMe);

export default router;
