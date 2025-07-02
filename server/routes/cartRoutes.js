import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateFullCart
} from '../controllers/cartController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCart);                  // Get user cart
router.post('/', protect, addToCart);               // Add item to cart
router.put('/:itemId', protect, updateCartItem);    // Update quantity
router.delete('/:itemId', protect, removeCartItem); // Remove item
router.delete('/', protect, clearCart);             // Clear full cart
router.put('/', protect, updateFullCart); 

export default router;



