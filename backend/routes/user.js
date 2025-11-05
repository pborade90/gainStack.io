import express from 'express';
import { loginUser, signupUser, updateProfile } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/signup', signupUser);

// Protected routes
router.use(requireAuth);
router.patch('/profile', updateProfile);

export default router;