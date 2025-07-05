// backend/controllers/orderController.js
import Order from '../models/Order.js';
import { sendOrderEmail } from '../utils/email.js';

export const placeOrder = async (req, res) => {
  const { products, address, totalAmount, deliveryCharge } = req.body;
 
  const order = new Order({
    user: req.user._id,
    products,
    address,
    totalAmount,
    deliveryCharge,
  });
  const saved = await order.save();
  // await sendOrderEmail(req.user, order);
  res.status(201).json(saved);
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
