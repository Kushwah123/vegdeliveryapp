import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/productSlice';
import { fetchAllOrders } from '../features/orderSlice';
import { fetchAllUsers } from '../features/authSlice';

const AdminPanel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const { products, loading: productLoading } = useSelector((state) => state.products);
  const { orders, loading: orderLoading } = useSelector((state) => state.orders);
  const { users, loading: userLoading } = useSelector((state) => state.auth);


  const isLoading = productLoading || orderLoading || userLoading;

  const productsCount = Array.isArray(products) ? products.length : 0;
  // const ordersCount = Array.isArray(orders) ? orders.length : 0;
  const usersCount = Array.isArray(users) ? users.length : 0;

  // const totalSales = Array.isArray(orders)
  //   ? orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0)
  //   : 0;
  // ✅ Safe fallback अगर ordersObj.orders नहीं मिला तो खाली array
const orderList = Array.isArray(orders) ? orders : [];


const totalSales = orderList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
const ordersCount = orderList.length;

  const today = new Date().toDateString();

  const newUsersToday = Array.isArray(users)
    ? users.filter((u) => new Date(u.createdAt).toDateString() === today).length
    : 0;

  const lowStockProducts = Array.isArray(products)
    ? products.filter((p) => p.stock < 5)
    : [];

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <Container fluid className="py-4 px-3 px-md-5">
      <h2 className="mb-4 text-success text-center text-md-start">📊 Dashboard Overview</h2>

      {/* Alerts */}
      <div className="mb-4">
        {newUsersToday > 0 && (
          <Alert variant="info">
            🧍‍♂️ <strong>{newUsersToday}</strong> new user(s) registered today.
          </Alert>
        )}
        {lowStockProducts.length > 0 && (
          <Alert variant="danger">
            ⚠️ <strong>{lowStockProducts.length}</strong> product(s) have low stock.
            <ul className="mb-0 ms-3">
              {lowStockProducts.slice(0, 3).map((p) => (
                <li key={p._id}>
                  {p.name} — {p.stock} left
                </li>
              ))}
              {lowStockProducts.length > 3 && <li>...and more</li>}
            </ul>
          </Alert>
        )}
      </div>

      {/* Metrics Cards */}
      <Row className="g-4">
        <Col xs={12} sm={6} lg={3}>
          <Card className="text-center shadow-sm bg-primary text-white">
            <Card.Body>
              <Card.Title>
                <i className="bi bi-box-seam me-2"></i>Total Products
              </Card.Title>
              <Card.Text className="fs-4">{productsCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="text-center shadow-sm bg-warning text-white">
            <Card.Body>
              <Card.Title>
                <i className="bi bi-people-fill me-2"></i>Total Users
              </Card.Title>
              <Card.Text className="fs-4">{usersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="text-center shadow-sm bg-success text-white">
            <Card.Body>
              <Card.Title>
                <i className="bi bi-currency-rupee me-2"></i>Total Sales
              </Card.Title>
              <Card.Text className="fs-4">₹{totalSales.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="text-center shadow-sm bg-info text-white">
            <Card.Body>
              <Card.Title>
                <i className="bi bi-receipt me-2"></i>Total Orders
              </Card.Title>
              <Card.Text className="fs-4">{ordersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="mt-5">
        <h4 className="mb-3 text-center text-md-start">🚀 Quick Actions</h4>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
          <Link to="/admin/products" className="btn btn-outline-primary">
            🧺 Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-warning">
            📦 Manage Orders
          </Link>
          <Link to="/admin/users" className="btn btn-outline-success">
            👥 Manage Users
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default AdminPanel;
