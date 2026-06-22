import { Router } from 'express';
import { loginWithAzureAD, logout, refreshToken } from '../controllers/authController';

const router = Router();

// Authentication endpoints
router.post('/login', loginWithAzureAD);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export default router;
