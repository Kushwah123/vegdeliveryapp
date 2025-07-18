// routes/deliveryChargeRoutes.js
import express from 'express';
import {
  getAllCharges,
  getChargeByColony,
  setCharge,
  deleteDeliveryCharge,
  updateDeliveryCharge
} from '../controllers/deliveryChargeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCharges);                          // All charges
router.get('/:colony', getChargeByColony);               // Charge for specific colony
router.post('/', protect, setCharge);         // Add/Update charge
router.put('/:id', protect, updateDeliveryCharge);
router.delete('/:id', protect, deleteDeliveryCharge);


export default router;
