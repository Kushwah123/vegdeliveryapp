import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';

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
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">🥬 Veg4You</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">

            {/* ✅ Show Cart only if logged in */}
            {user && (
              <Nav.Link as={Link} to="/cart">
                <i className="bi bi-cart"></i> Cart{' '}
                {items.length > 0 && <Badge bg="success">{items.length}</Badge>}
              </Nav.Link>
            )}

            {user ? (
              <NavDropdown title={user.name} id="user-menu">
                <NavDropdown.Item as={Link} to="/orders">
                  <i className="bi bi-bag-check"></i> My Orders
                </NavDropdown.Item>

                {(user.isAdmin || user.role === 'admin') && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/products">
                      🧺 Manage Products
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orders">
                      📦 Manage Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">
                      👥 Manage Users
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
                  <i className="bi bi-person-plus"></i> Register
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
