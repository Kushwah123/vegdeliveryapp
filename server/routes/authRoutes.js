// backend/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser,
     getUserProfile, updateUserAddress,
     getUserDetails,getNewUsersToday,
updateUserProfile} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/address', protect, updateUserAddress);
router.get('/users', protect, getUserDetails);
// routes/userRoutes.js
router.get('/newtoday', protect, getNewUsersToday);
router.put('/profile', protect, updateUserProfile);




export default router;