import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
// Correct path after moving into src/utils




const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    referredBy: ''
  });
  const generateReferralCode = (name) => {
    const base = name.toLowerCase().replace(/\s+/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${base}${random}`;
  };
  const referralCode = generateReferralCode(formData.name);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      referredBy: formData.referredBy.trim() === '' ? null : formData.referredBy.trim()
    };

    dispatch(register(payload));
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto shadow" style={{ maxWidth: '430px' }}>
        <Card.Body>
          <h4 className="mb-4 text-center text-success">Create Account</h4>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>

            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </Form.Group>

            {/* Mobile */}
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </Form.Group>

            {/* Referral Code (optional) */}
            <Form.Group className="mb-3">
              <Form.Label>Referral Code (optional)</Form.Label>
              <Form.Control
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Enter referral code"
              />
            </Form.Group>

            <Button type="submit" variant="success" className="w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>

            {/* Optional: Show user referral code after registration */}
            {formData.name && (
              <div className="text-center mt-3 text-muted small">
                🎁 Your Referral Code: <strong>{referralCode}</strong>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
