import nodemailer from 'nodemailer';

export const sendOrderEmail = async (user, order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const productLines = order.products
    .map(p => `${p.name} × ${p.quantity} = ₹${p.quantity * p.price}`)
    .join('\n');

  const message = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Your Veg4You Order Confirmation',
    text: `Thanks ${user.name}, your order is placed!\n\nItems:\n${productLines}\n\nTotal: ₹${order.totalAmount + order.deliveryCharge}\nAddress: ${order.address}`,
  };

  await transporter.sendMail(message);
};
