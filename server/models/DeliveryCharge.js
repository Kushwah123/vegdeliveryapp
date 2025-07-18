// models/DeliveryCharge.js
import mongoose from 'mongoose';

const deliveryChargeSchema = new mongoose.Schema({
  colony: {
    type: String,
    required: true,
    unique: true,
  },
  charge: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('DeliveryCharge', deliveryChargeSchema);
