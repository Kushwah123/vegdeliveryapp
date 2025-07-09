import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import {
  Navbar,
  Nav,
  Container,
  Badge,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          🥗 Veg4You
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center w-100 d-flex flex-wrap justify-content-end">

            {/* 🔍 Search Bar - Only on Home */}
            {isHome && (
              <Form className="d-flex flex-grow-1 flex-md-shrink-0 me-md-3 my-2 my-md-0" onSubmit={(e) => e.preventDefault()}>
                <FormControl
                  type="search"
                  placeholder="Search vegetables..."
                  className="me-2"
                  aria-label="Search"
                  style={{ minWidth: '150px' }}
                />
                <Button variant="light" size="sm">Search</Button>
              </Form>
            )}

            {/* 🛒 Cart */}
            {user && !user.isAdmin && (
              <Nav.Link as={Link} to="/cart" className="position-relative text-white me-3">
                <i className="bi bi-cart-fill fs-5"></i>
                {items.length > 0 && (
                  <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {items.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {/* User Logged In */}
            {user ? (
              <>
                {/* Highlighted Username */}
                <Nav.Link as={Link} to="#" className="fw-bold text-uppercase text-white me-2">
                  <i className="bi bi-person-circle me-1"></i> {user.name}
                </Nav.Link>

                {/* My Profile (common to all) */}
                <Nav.Link as={Link} to="/profile" className="text-white me-2">
                  <i className="bi bi-person-lines-fill"></i> My Profile
                </Nav.Link>

                {/* My Orders (user only) */}
                {!user.isAdmin && (
                  <Nav.Link as={Link} to="/orders" className="text-white me-2">
                    <i className="bi bi-bag-check-fill"></i> My Orders
                  </Nav.Link>
                )}

                {/* Admin Panel */}
                {user.isAdmin && (
                  <>
                    <Nav.Link as={Link} to="/admin/products" className="text-white me-2">
                      <i className="bi bi-box-seam"></i> Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/orders" className="text-white me-2">
                      <i className="bi bi-truck"></i> Orders
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/users" className="text-white me-2">
                      <i className="bi bi-people-fill"></i> Users
                    </Nav.Link>
                  </>
                )}

                {/* Logout */}
                <Nav.Link onClick={handleLogout} className="text-white">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white me-2">
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
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
