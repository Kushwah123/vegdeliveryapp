import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateOrderPDF = (order) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Veg4You - Order Invoice', 20, 20);

  doc.setFontSize(12);
  doc.text(`Customer: ${order.user.name}`, 20, 30);
  doc.text(`Address: ${order.address}`, 20, 38);
  doc.text(`Total Amount: ₹${order.totalAmount + order.deliveryCharge}`, 20, 46);
  doc.text(`Delivery Charge: ₹${order.deliveryCharge}`, 20, 54);

  const rows = order.products.map(p => [
    p.name,
    p.quantity,
    `₹${p.price}`,
    `₹${p.quantity * p.price}`
  ]);

  doc.autoTable({
    head: [['Product', 'Qty', 'Price', 'Total']],
    body: rows,
    startY: 65,
  });

  doc.save(`Order_${order._id}.pdf`);
};
export default generateOrderPDF;