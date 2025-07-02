// backend/routes/orderRoutes.js
import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, placeOrder);
router.route('/user').get(protect, getUserOrders);
router.route('/allorders').get(protect, admin, getAllOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);
router.delete('/:id', protect, admin, deleteOrder);


export default router;