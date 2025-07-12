// backend/controllers/orderController.js
import Order from '../models/Order.js';
import { sendOrderEmail } from '../utils/email.js';



export   const    handleOnlinePayment = async (req, res) => {
  try {
    const { address, totalAmount, deliveryCharge, paymentMethod , deliverySlot, } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    const products = JSON.parse(req.body.products);

    const order = new Order({
      user: req.user._id,
      address,
      totalAmount,
      deliveryCharge,
      paymentMethod,
      products,
       deliverySlot, // ✅ new field,
      paymentScreenshot: req.file.path, // 👈 save screenshot
    });

    await order.save();

    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    console.error('🛑 Online payment error:', err);
    res.status(500).json({ message: 'Failed to place online order' });
  }
};

// controllers/orderController.js

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentVerified } = req.body;

    // ✅ Step 1: Validate status
    const allowedStatuses = ['verified', 'rejected'];
    if (!allowedStatuses.includes(paymentVerified)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // ✅ Step 2: Find order by ID and ensure it's an online payment
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentMethod !== 'Online') {
      return res.status(400).json({ message: 'This order is not an online payment' });
    }

    // ✅ Step 3: Update payment verification status
    order.paymentVerified = paymentVerified;
    await order.save();

    // ✅ Step 4: Respond with success
    res.status(200).json({
      message: `Payment marked as ${paymentVerified}`,
      paymentVerified: order.paymentVerified,
      orderId: order._id,
    });

  } catch (err) {
    console.error('❌ Payment verification failed:', err.message);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};



export const placeOrder = async (req, res) => {
  const { products, address, totalAmount, deliveryCharge , deliverySlot, } = req.body;
 
  const order = new Order({
    user: req.user._id,
    products,
    address,
    totalAmount,
    deliveryCharge,
     deliverySlot, // ✅ new field
  });
  const saved = await order.save();
  // await sendOrderEmail(req.user, );
  res.status(201).json({ success: true, saved });
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch user orders. Please try again later.' });
  }
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
   const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(order => 
    new Date(order.createdAt) >= today
  );

  res.json({ orders, todayCount: todayOrders.length });
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const cancelOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (order && order.status === 'pending') {
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled' });
  } else {
    res.status(400).json({ message: 'Cannot cancel order' });
  }
};
export const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  await order.deleteOne();
  res.json({ message: 'Order deleted successfully' });
};
