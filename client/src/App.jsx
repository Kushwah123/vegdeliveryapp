// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminUsers from './components/admin/AdminUsers';
import AdminPanel from './pages/AdminPanel';
import { Container } from 'react-bootstrap';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-4">
        <Container>
          <Routes>
          <Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

{/* 🔐 Protected Routes for Logged-in Users */}
<Route element={<ProtectedRoute />}>
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/orders" element={<Orders />} />
</Route>

{/* 🛠️ Admin Routes */}
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/admin/products" element={<AdminProducts />} />
  <Route path="/admin/orders" element={<AdminOrders />} />
  <Route path="/admin/users" element={<AdminUsers />} />
</Route>

{/* ❌ 404 Page */}
<Route path="*" element={<h3>404 - Page not found</h3>} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
