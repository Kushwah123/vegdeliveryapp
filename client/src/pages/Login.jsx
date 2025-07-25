// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [mobile, setMobile] = useState('');

  const [password, setPassword] = useState('');

  useEffect(() => {
  if (user) {
    if (user.isAdmin || user.role === 'admin') {
      navigate('/admin'); // ✅ Admin ke liye admin panel
    } else {
      navigate('/'); // ✅ Normal user ke liye home page
    }
  }
}, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ mobile, password }));
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <h4 className="mb-4">Login</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
<Form.Control
  type="tel"
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
  required
  pattern="[0-9]{10}"
  placeholder="Enter 10-digit mobile number"
/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;