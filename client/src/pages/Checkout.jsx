// frontend/src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { placeOrder } from '../features/orderSlice';
import { clearCart } from '../features/cartSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const singleItem = location.state?.item || null;
  const isBuyNow = !!singleItem;

  const [address, setAddress] = useState(user?.address || '');
  const [deliveryCharge] = useState(40);
  const [message, setMessage] = useState('');

  const itemsToShow = isBuyNow ? [singleItem] : items;

  useEffect(() => {
    if (itemsToShow.length === 0) {
      navigate('/');
    }
  }, [itemsToShow, navigate]);

  const totalAmount = itemsToShow.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert('Please enter a valid delivery address');
      return;
    }

    const orderData = {
      address,
      products: itemsToShow,
      totalAmount,
      deliveryCharge,
    };

    dispatch(placeOrder(orderData))
      .then((res) => {
        if (res.type === 'orders/placeOrder/fulfilled') {
          if (!isBuyNow) dispatch(clearCart()); // ✅ Buy Now me cart clear na ho
          setMessage('Order placed successfully!');
          setTimeout(() => navigate('/orders'), 1500);
        } else {
          setMessage('Failed to place order');
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to place order');
      });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Confirm Delivery Address</h2>
      <Card className="p-3">
        {message && (
          <Alert variant={message.includes('success') ? 'success' : 'danger'}>
            {message}
          </Alert>
        )}
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

          <h5 className="mt-3">🛒 Order Summary</h5>
          {itemsToShow.map((item) => (
            <div key={item.productId}>
              {item.name} - ₹{item.price} × {item.quantity} = ₹
              {item.price * item.quantity}
            </div>
          ))}

          <hr />
          <p>Delivery Charge: ₹{deliveryCharge}</p>
          <h5><strong>Total Payable: ₹{totalAmount + deliveryCharge}</strong></h5>

          <Button variant="success" type="submit" className="w-100 mt-3">
            Place Order
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Checkout;
