// backend/routes/orderRoutes.js
import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  verifyPayment,
  handleOnlinePayment

} from '../controllers/orderController.js';
// import { handleOnlinePayment } from    '../controllers/orderController.js';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'payment-' + Date.now() + ext);
  },
});
const upload = multer({ storage });

router.route('/').post(protect, placeOrder);
router.route('/user').get(protect, getUserOrders);
router.route('/allorders').get(protect, admin, getAllOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);
router.delete('/:id', protect, admin, deleteOrder);
router.post('/online-payment',protect, upload.single('screenshot'), handleOnlinePayment);
router.put('/verify-payment/:orderId', protect, verifyPayment);



export default router;