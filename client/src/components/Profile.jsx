import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [address, setAddress] = useState(user?.address || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setMobile(user?.mobile || '');
    setAddress(user?.address || '');
  }, [user]);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!name.trim() || !mobile.trim()) {
      setMessage('Name and mobile are required!');
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      setMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    const updatedData = { name, mobile, address };
    dispatch(updateUserProfile(updatedData)).then((res) => {
      if (res.type.includes('fulfilled')) {
        setMessage('✅ Profile updated successfully!');
      } else {
        setMessage('❌ Failed to update profile');
      }
    });
  };

  const handleReferralShare = () => {
    const referralMessage = `Hey! Use my referral code *${user.referralCode}* to sign up on this awesome app and earn rewards! Click here to join: ${window.location.origin}/register?ref=${user.referralCode}`;
    const encodedMsg = encodeURIComponent(referralMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm mb-4">
            <h4 className="mb-3 text-success">👋 Welcome, {user.name}</h4>

            <Row>
              <Col sm={6}>
                <p><strong>Referral Code:</strong> <span className="text-primary">{user.referralCode}</span></p>
              </Col>
              <Col sm={6} className="text-sm-end">
                <Button variant="outline-success" size="sm" onClick={handleReferralShare}>
                  📤 Share on WhatsApp
                </Button>
              </Col>
            </Row>

            <p><strong>Wallet Points:</strong> ₹{user.points || 0}</p>
          </Card>

          <Card className="p-4 shadow-sm">
            <h5 className="mb-3">📝 Update Your Profile</h5>

            {message && (
              <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
                {message}
              </Alert>
            )}

            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" value={email} disabled className="bg-light" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit phone number"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your default delivery address"
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                💾 Save Changes
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
