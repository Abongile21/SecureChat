import { Router } from 'express';
import { getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/', authenticateToken, getAllUsers); // Admin only

export default router;
