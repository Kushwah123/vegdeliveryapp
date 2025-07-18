import React, { useState, useEffect } from 'react';
import { useSelector,shallowEqual, useDispatch } from 'react-redux';
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Image,
} from 'react-bootstrap';
import { placeOnlineOrderWithScreenshot, placeOrder } from '../features/orderSlice';
import { fetchDeliveryCharges } from '../features/deliveryChargeSlice';
import { clearCart } from '../features/cartSlice';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ IMPORTS SAME RAHENGE

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);


 const { charges, loading, error } = useSelector((state) => state.deliveryCharge);

  const singleItem = location.state?.item || null;
  const isBuyNow = !!singleItem;
  
  const [selectedColony, setSelectedColony] = useState('');
const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [address, setAddress] = useState(user?.address || '');
 
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [qrScreenshot, setQrScreenshot] = useState(null);
  const [showQrStep, setShowQrStep] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState('Morning'); // ✅ New slot state

  const itemsToShow = isBuyNow ? [singleItem] : items;

  useEffect(() => {
  dispatch(fetchDeliveryCharges());
}, [dispatch]);

useEffect(() => {
  console.log("Charges updated:", charges);
}, [charges]);

  useEffect(() => {
    if (itemsToShow.length === 0) {
      navigate('/');
    }
  }, [itemsToShow, navigate]);
  useEffect(() => {
  const colonyCharge = charges.find(c => c.colony === selectedColony);
  setDeliveryCharge(colonyCharge ? colonyCharge.charge : 0);
}, [selectedColony, charges]);

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
          // 👉 WhatsApp भेजें
  const whatsappMessage = encodeURIComponent(`
🛒 *New Order Received*
👤 Name: ${user?.name}
🏠 Address: ${address}
💰 Total: ₹${totalAmount + deliveryCharge}
🧾 Payment: COD
🕒 Slot: ${deliverySlot}
🛍️ Items:
${itemsToShow.map((item) => `• ${item.name} × ${item.quantity}`).join('\n')}
  `);
   window.open(`https://wa.me/918384895054?text=${whatsappMessage}`, '_blank');
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
  formData.append('deliverySlot', deliverySlot);
  formData.append('products', JSON.stringify(itemsToShow));

  try {
    const res = await dispatch(placeOnlineOrderWithScreenshot({ formData }));

    if (res?.payload?.success) {
      if (!isBuyNow) dispatch(clearCart());
     setMessage('Online order placed successfully!');

      const whatsappMessage = encodeURIComponent(`
🛒 *New Online Order*
👤 Name: ${user?.name}
🏠 Address: ${address} 
💰 Total: ₹${totalAmount + deliveryCharge}
🧾 Payment: Online (Screenshot uploaded)
🕒 Slot: ${deliverySlot}
🛍️ Items:
${itemsToShow.map((item) => `• ${item.name} × ${item.quantity}`).join('\n')}
      `);

       window.open(`https://wa.me/918384895054?text=${whatsappMessage}`, '_blank');


      setTimeout(() => navigate('/orders'), 1500);
    } else {
      alert(res?.payload?.message || 'Payment failed');
    }
  } catch (err) {
    console.error(err);
    alert('Error placing order');
  }
};


  return (
  <Container className="mt-4">
    <h2 className="mb-4 text-center">🧾 Confirm Your Delivery Details</h2>

    <div className="row">
      {/* Left Side: Address & Slot */}
      <div className="col-md-6">
        <Card className="p-4 shadow-sm mb-4">
          <h5 className="mb-3">📦 Delivery Information</h5>

          <Form.Group className="mb-3">
            <Form.Label>🏠 Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter full delivery address"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>🕒 Select Delivery Slot</Form.Label>
            <Form.Select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
            >
              <option value="Morning">Morning (8 AM - 11 AM)</option>
              <option value="Evening">Evening (5 PM - 8 PM)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>🏘️ Select Colony</Form.Label>
            <Form.Select onChange={(e) => setSelectedColony(e.target.value)}>
              <option value="">-- Select --</option>
              {charges.map((c) => (
                <option key={c._id} value={c.colony}>
                  {c.colony}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card>
      </div>

      {/* Right Side: Order Summary */}
      <div className="col-md-6">
        <Card className="p-4 shadow-sm mb-4">
          <h5 className="mb-3">🧾 Order Summary</h5>
          {itemsToShow.map((item) => (
            <div key={item.productId} className="d-flex justify-content-between">
              <div>{item.name} × {item.quantity}</div>
              <div>₹{item.price * item.quantity}</div>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-between">
            <div>🚚 Delivery Charge</div>
            <div>₹{deliveryCharge}</div>
          </div>

          <h5 className="mt-3 d-flex justify-content-between">
            <strong>Total Payable</strong>
            <strong>₹{totalAmount + deliveryCharge}</strong>
          </h5>
        </Card>

        {/* Payment Buttons */}
        {!paymentMethod && (
          <div className="d-grid gap-2">
            <Button variant="success" onClick={() => setPaymentMethod('COD')}>
              💵 Pay on Delivery (COD)
            </Button>
            <Button variant="primary" onClick={() => setPaymentMethod('Online')}>
              💳 Pay Online
            </Button>
          </div>
        )}

        {/* COD Button */}
        {paymentMethod === 'COD' && (
          <Button
            variant="dark"
            className="mt-3 w-100"
            onClick={handleCodSubmit}
          >
            Confirm COD Order
          </Button>
        )}

        {/* Online Payment */}
        {paymentMethod === 'Online' && (
          <Card className="p-3 mt-4 text-center">
            {!showQrStep ? (
              <>
                <p>Click below to upload payment screenshot</p>
                <Button onClick={() => setShowQrStep(true)}>Show QR</Button>
              </>
            ) : (
              <>
                <Image
                  src="/qr.jpg"
                  fluid
                  className="mb-3 border"
                  style={{ maxWidth: '250px', margin: '0 auto' }}
                />
                <Form.Group controlId="qrScreenshot">
                  <Form.Label>Upload Screenshot</Form.Label>
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
          </Card>
        )}
      </div>
    </div>

    {/* Message Alert */}
    {message && (
      <Alert
        variant={message.includes('success') ? 'success' : 'danger'}
        className="mt-4"
      >
        {message}
      </Alert>
    )}
  </Container>
);
}

export default Checkout;
