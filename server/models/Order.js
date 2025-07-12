import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  address: String,
  totalAmount: Number,
  deliveryCharge: Number,
  status: {
    type: String,
    enum: ['pending', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD',
  },

  // ✅ Add this field for QR screenshot image path
  paymentScreenshot: {
    type: String, // This will store the image path like: uploads/payments/payment-17234567.jpg
  },
  paymentVerified: {
  type: String,
  status: ['pending', 'verified', 'rejected'],
  default: 'pending',
},
deliverySlot: {
  type: String,
  enum: ['Morning', 'Evening'],
  default: 'Morning',
},

}, { timestamps: true });

export default mongoose.model('Order', orderSchema);