// frontend/src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { placeOrder } from '../features/orderSlice';
import { clearCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(user?.address || '');
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [message, setMessage] = useState('');

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address) {
      alert('Please enter a valid delivery address');
      return;
    }

    const orderData = {
      address,
      products: items,
      totalAmount,
      deliveryCharge,
    };

    dispatch(placeOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearCart());
        setMessage('Order placed successfully!');
        setTimeout(() => navigate('/orders'), 1500);
      })
      .catch(() => setMessage('Failed to place order'));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Confirm Delivery Address</h2>
      <Card className="p-3">
        {message && <Alert variant={message.includes('success') ? 'success' : 'danger'}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <p>Delivery Charge: ₹{deliveryCharge}</p>
          <p><strong>Total Payable: ₹{totalAmount + deliveryCharge}</strong></p>
          <Button variant="success" type="submit" className="w-100">
            Place Order
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Checkout;
