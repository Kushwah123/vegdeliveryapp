import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './AdminSidebar.css';
import { logout } from '../features/authSlice'; // 👈 Make sure this exists

const AdminSidebar = ({ show, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className={`admin-sidebar ${show ? 'show' : 'hide'} bg-dark text-white`}>
      <h4 className="text-center py-3 border-bottom">Admin Panel</h4>
      <ul className="nav flex-column px-3">
        <li className="nav-item my-2">
          <Link to="/admin/products" className="nav-link text-white">
            <i className="bi bi-box-seam me-2"></i> Products
          </Link>
        </li>
        <li className="nav-item my-2">
          <Link to="/admin/orders" className="nav-link text-white">
            <i className="bi bi-receipt me-2"></i> Orders
          </Link>
        </li>
        <li className="nav-item my-2">
          <Link to="/admin/users" className="nav-link text-white">
            <i className="bi bi-people-fill me-2"></i> Users
          </Link>
        </li>
        <li className="nav-item my-2">
          <Link to="/" className="nav-link text-white">
            <i className="bi bi-house me-2"></i> Home
          </Link>
        </li>
        <li className="nav-item my-2 mt-4 border-top pt-3">
          <button onClick={handleLogout} className="btn btn-outline-light w-100">
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
