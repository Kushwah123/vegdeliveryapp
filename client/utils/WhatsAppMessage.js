export const generateWhatsAppMessage = ({ user, products, totalAmount, deliveryCharge, address }) => {
  const productList = products
    .map(p => `• ${p.name} × ${p.quantity} = ₹${p.price * p.quantity}`)
    .join('%0A');

  return `Hi ${user.name},%0AThank you for your Veg4You order! 🧺%0A%0A${productList}%0A%0ATotal: ₹${totalAmount + deliveryCharge}%0ADelivery: ₹${deliveryCharge}%0A%0A📍 Address:%0A${address}%0A%0AWe will notify you once your order is dispatched.`;
};
