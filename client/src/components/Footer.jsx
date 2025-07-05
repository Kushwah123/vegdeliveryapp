import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <Container>
        <Row>
          {/* About */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="text-success fw-bold">Veg4You</h5>
            <p style={{ fontSize: '0.9rem' }}>
              We deliver farm-fresh vegetables directly to your doorstep. Eat healthy, stay healthy! 🌿
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/cart" className="text-light text-decoration-none">Cart</Link></li>
              <li><Link to="/orders" className="text-light text-decoration-none">My Orders</Link></li>
              <li><Link to="/login" className="text-light text-decoration-none">Login</Link></li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="fw-semibold">Contact Us</h6>
            <p style={{ fontSize: '0.9rem' }}>
              📍 Agra, UP, India <br />
              📞 +91-8384895054 <br />
              ✉️ support@veg4you.com
            </p>
          </Col>

          {/* Social Media */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="fw-semibold">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-light fs-5"><i className="bi bi-whatsapp"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="border-secondary" />
        <p className="text-center mb-0" style={{ fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Veg4You. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
