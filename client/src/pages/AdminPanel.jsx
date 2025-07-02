import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/orders/allorders'),
          axios.get('/api/users/all'),
        ]);

        setProductsCount(productsRes.data.length);
        setOrdersCount(ordersRes.data.length);
        setUsersCount(usersRes.data.length);

        const sales = ordersRes.data.reduce((acc, order) => acc + order.totalAmount, 0);
        setTotalSales(sales);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className="col-md-3 bg-dark text-white p-3">
          <h3 className="text-center mb-4">Admin Panel</h3>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/admin/products" className="nav-link text-white">
                <i className="bi bi-box-seam me-2"></i> Products
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/orders" className="nav-link text-white">
                <i className="bi bi-receipt-cutoff me-2"></i> Orders
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/users" className="nav-link text-white">
                <i className="bi bi-people-fill me-2"></i> Users
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/" className="nav-link text-white">
                <i className="bi bi-house-door-fill me-2"></i> Home
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-4">
          <h2 className="mb-4 text-success">Dashboard</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title"><i className="bi bi-box-seam"></i> Total Products</h5>
                  <p className="card-text fs-4">{productsCount}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5 className="card-title"><i className="bi bi-people-fill"></i> Total Users</h5>
                  <p className="card-text fs-4">{usersCount}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title"><i className="bi bi-currency-rupee"></i> Total Sales</h5>
                  <p className="card-text fs-4">₹{totalSales.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="mb-3">Quick Actions</h4>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/admin/products" className="btn btn-outline-primary">
                Manage Products
              </Link>
              <Link to="/admin/orders" className="btn btn-outline-warning">
                Manage Orders
              </Link>
              <Link to="/admin/users" className="btn btn-outline-success">
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
