import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Row, Col, Card, Button } from 'react-bootstrap';

const AdminPanel = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes, newUsersRes, lowStockRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders/allorders'),
          axios.get('/api/users/all'),
          axios.get('/api/users/newtoday'),
          axios.get('/api/products/lowstock')
        ]);

        setProductsCount(productsRes.data.length);
        setOrdersCount(ordersRes.data.length);
        setUsersCount(usersRes.data.length);
        setNewUsersToday(newUsersRes.data.count);
        setLowStockProducts(lowStockRes.data);

        const sales = ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0);
        setTotalSales(sales);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid px-4 py-3">
      <h2 className="mb-4 text-success">📊 Dashboard Overview</h2>

      {/* 🔔 Alerts Section */}
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
                <li key={p._id}>{p.name} — {p.stock} left</li>
              ))}
              {lowStockProducts.length > 3 && <li>...and more</li>}
            </ul>
          </Alert>
        )}
      </div>

      {/* 🧾 Metrics Cards */}
      <Row className="g-4">
        <Col md={3}>
          <Card bg="primary" text="white" className="shadow-sm">
            <Card.Body>
              <Card.Title><i className="bi bi-box-seam me-2"></i>Total Products</Card.Title>
              <Card.Text className="fs-4">{productsCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="warning" text="white" className="shadow-sm">
            <Card.Body>
              <Card.Title><i className="bi bi-people-fill me-2"></i>Total Users</Card.Title>
              <Card.Text className="fs-4">{usersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white" className="shadow-sm">
            <Card.Body>
              <Card.Title><i className="bi bi-currency-rupee me-2"></i>Total Sales</Card.Title>
              <Card.Text className="fs-4">₹{totalSales.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="info" text="white" className="shadow-sm">
            <Card.Body>
              <Card.Title><i className="bi bi-receipt me-2"></i>Total Orders</Card.Title>
              <Card.Text className="fs-4">{ordersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🚀 Quick Actions */}
      <div className="mt-5">
        <h4 className="mb-3">🚀 Quick Actions</h4>
        <div className="d-flex flex-wrap gap-3">
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
    </div>
  );
};

export default AdminPanel;
