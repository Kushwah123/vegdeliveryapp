import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          🥗 Veg4You
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">

            {/* 🔍 Search bar for users only */}
            {user && !user.isAdmin && (
              <Form className="d-flex me-3" onSubmit={(e) => e.preventDefault()}>
                <FormControl
                  type="search"
                  placeholder="Search vegetables..."
                  className="me-2"
                  aria-label="Search"
                  style={{ width: '200px' }}
                />
                <Button variant="light" size="sm">Search</Button>
              </Form>
            )}

            {/* 🛒 Cart for users only */}
            {user && !user.isAdmin && (
              <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                <i className="bi bi-cart-fill fs-5"></i>
                {items.length > 0 && (
                  <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {items.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {user ? (
              <NavDropdown title={<><i className="bi bi-person-circle me-1"></i>{user.name}</>} id="user-menu">
                {!user.isAdmin && (
                  <NavDropdown.Item as={Link} to="/orders">
                    <i className="bi bi-bag-check-fill"></i> My Orders
                  </NavDropdown.Item>
                )}

                {user.isAdmin && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/products">
                      <i className="bi bi-box-seam"></i> Manage Products
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      <i className="bi bi-truck"></i> Manage Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      <i className="bi bi-people-fill"></i> Manage Users
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="bi bi-person-plus-fill"></i> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
