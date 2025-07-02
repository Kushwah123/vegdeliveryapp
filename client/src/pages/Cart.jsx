import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  addToCart,
  clearCart,
  fetchCart,
  updateCart,
} from '../features/cartSlice';
import { saveUserAddress } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [askConfirm, setAskConfirm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  // ✅ Fetch cart on mount
  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const handleQuantityChange = (productId, quantity) => {
    const updatedItems = items.map((i) =>
      i.productId === productId ? { ...i, quantity: Number(quantity) } : i
    );
    dispatch(updateCart(updatedItems));
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user?.address) {
      setShowAddressModal(true);
    } else {
      setAskConfirm(true);
    }
  };

  const handleConfirmAddress = () => {
    setAskConfirm(false);
    navigate('/checkout');
  };

  const handleSaveAddress = () => {
    if (newAddress.trim() !== '') {
      dispatch(saveUserAddress(newAddress)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowAddressModal(false);
          navigate('/checkout');
        } else {
          alert('Failed to save address. Please try again.');
        }
      });
    } else {
      alert('Address is required.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">🛒 Shopping Cart</h2>
      {loading ? (
        <p>Loading cart...</p>
      ) : items.length === 0 ? (
        <Alert variant="info">Your cart is empty.</Alert>
      ) : (
        <>
          <Row>
            {items.map((item) => (
              <Col md={6} lg={4} key={item.productId} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={item.image}
                    height="160"
                    style={{ objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      ₹{item.price} ×{' '}
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value)
                        }
                        style={{
                          width: '80px',
                          display: 'inline-block',
                          marginLeft: '5px',
                        }}
                      />{' '}
                      = <strong>₹{item.price * item.quantity}</strong>
                    </Card.Text>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        dispatch(removeFromCart(item.productId))
                      }
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="p-3 mt-3">
            <h4>Total: ₹{totalAmount.toFixed(2)}</h4>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </Button>
              <Button variant="success" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* ✅ Confirm Address Modal */}
      <Modal show={askConfirm} onHide={() => setAskConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to proceed with the following address?</p>
          <p>
            <strong>{user?.address}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAskConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddress}>
            Yes, Proceed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Enter Address Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="addressInput">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter your full delivery address"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveAddress}>
            Save & Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
