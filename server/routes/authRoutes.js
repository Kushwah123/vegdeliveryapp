// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserAddress,getUserDetails,} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/address', protect, updateUserAddress);
router.get('/users', protect, getUserDetails);



export default router;