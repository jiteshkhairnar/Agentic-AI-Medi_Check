import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.me);

export default router;
