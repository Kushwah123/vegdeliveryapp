import Cart from '../models/Cart.js';

// ✅ GET CART
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  res.status(200).json(cart || { items: [] });
};

// ✅ ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, name, image, price, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingProduct = cart.items.find((p) => p.productId.toString() === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.items.push({ productId, name, image, price, quantity });
  }

  await cart.save();
  res.status(200).json(cart);
};

// ✅ REMOVE ITEM
export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter((p) => p._id.toString() !== req.params.itemId);
  await cart.save();
  res.status(200).json(cart);
};

// ✅ CLEAR CART
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = [];
  await cart.save();
  res.status(200).json({ message: 'Cart cleared' });
};
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  const item = cart.products.id(req.params.itemId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};
// ✅ UPDATE FULL CART (overwrite items)
export const updateFullCart = async (req, res) => {
  const { items } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  cart.items = items; // purana items overwrite karo
  await cart.save();

  res.status(200).json(cart);
};

