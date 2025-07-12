import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Image,
} from 'react-bootstrap';
import { placeOrder } from '../features/orderSlice';
import { clearCart } from '../features/cartSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ IMPORTS SAME RAHENGE

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
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [qrScreenshot, setQrScreenshot] = useState(null);
  const [showQrStep, setShowQrStep] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState('Morning'); // ✅ New slot state

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

  const handleCodSubmit = (e) => {
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
      paymentMethod: 'COD',
      deliverySlot, // ✅ Add slot here
    };

    dispatch(placeOrder(orderData)).then((res) => {
      if (res.type === 'orders/placeOrder/fulfilled') {
        if (!isBuyNow) dispatch(clearCart());
        setMessage('Order placed successfully!');
        setTimeout(() => navigate('/orders'), 1500);
      } else {
        setMessage('Failed to place order');
      }
    });
  };

  const handleOnlinePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert('Please enter a valid delivery address');
      return;
    }

    if (!qrScreenshot) {
      alert('Please upload the screenshot of your payment');
      return;
    }

    const formData = new FormData();
    formData.append('screenshot', qrScreenshot);
    formData.append('address', address);
    formData.append('totalAmount', totalAmount);
    formData.append('deliveryCharge', deliveryCharge);
    formData.append('paymentMethod', 'Online');
    formData.append('deliverySlot', deliverySlot); // ✅ Add slot here
    formData.append('products', JSON.stringify(itemsToShow));

    try {
      const res = await fetch('/api/orders/online-payment', {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (res.ok) {
        if (!isBuyNow) dispatch(clearCart());
        setMessage('Online order placed successfully!');
        setTimeout(() => navigate('/orders'), 1500);
      } else {
        alert(data.message || 'Payment failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
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

        <Form>
          {/* ✅ Address */}
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

          {/* ✅ Delivery Slot Selection */}
          <Form.Group className="mb-3">
            <Form.Label>🛒 Select Delivery Slot</Form.Label>
            <Form.Select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              required
            >
              <option value="Morning">Morning (8 AM - 11 AM)</option>
              <option value="Evening">Evening (5 PM - 8 PM)</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ Order Summary */}
          <h5 className="mt-3">Order Summary</h5>
          {itemsToShow.map((item) => (
            <div key={item.productId}>
              {item.name} - ₹{item.price} × {item.quantity} = ₹
              {item.price * item.quantity}
            </div>
          ))}

          <hr />
          <p>Delivery Charge: ₹{deliveryCharge}</p>
          <h5>
            <strong>Total Payable: ₹{totalAmount + deliveryCharge}</strong>
          </h5>

          {/* ✅ Payment Options */}
          {!paymentMethod && (
            <>
              <Button
                variant="success"
                className="w-100 my-2"
                onClick={() => setPaymentMethod('COD')}
              >
                Pay on Delivery (COD)
              </Button>
              <Button
                variant="primary"
                className="w-100"
                onClick={() => setPaymentMethod('Online')}
              >
                Pay Now (Online)
              </Button>
            </>
          )}

          {/* ✅ COD Submit */}
          {paymentMethod === 'COD' && (
            <Button
              variant="dark"
              type="submit"
              onClick={handleCodSubmit}
              className="w-100 mt-3"
            >
              Confirm COD Order
            </Button>
          )}

          {/* ✅ Online Payment Flow */}
          {paymentMethod === 'Online' && (
            <>
              <div className="mt-4">
                {!showQrStep ? (
                  <>
                    <h6>Click below to see QR code and upload payment</h6>
                    <Button
                      variant="info"
                      className="w-100"
                      onClick={() => setShowQrStep(true)}
                    >
                      Show QR Code
                    </Button>
                  </>
                ) : (
                  <>
                    <h6>Scan the QR Code and Pay</h6>
                    <Image
                      src="/qr.jpg"
                      fluid
                      className="mb-3"
                      style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                    />

                    <Form.Group controlId="qrScreenshot">
                      <Form.Label>Upload Payment Screenshot</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setQrScreenshot(e.target.files[0])}
                      />
                    </Form.Group>

                    <Button
                      variant="success"
                      className="mt-3 w-100"
                      onClick={handleOnlinePaymentSubmit}
                    >
                      Confirm Online Payment
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default Checkout;
