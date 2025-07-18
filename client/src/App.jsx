// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminUsers from './components/admin/AdminUsers';
import AdminPanel from './pages/AdminPanel';
import { Container } from 'react-bootstrap';
import AdminLayout from './components/AdminLayout';
import Profile from './components/Profile';
import DeliveryChargePage from './components/admin/DeliveryChargePage';
const App = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;

  return (
    <Router>
      {!isAdmin && <Header />}
      <main className="py-4">
        <Container fluid>
          <Routes>
            {/* Admin Routes Only */}
            <Route element={<AdminProtectedRoute />}>
             <Route element={<AdminLayout />}>
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/products" element={<AdminProducts />} />
    <Route path="/admin/orders" element={<AdminOrders />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path='/admin/delivery' element={<DeliveryChargePage/>}/>
  </Route>
            </Route>

            {/* Hide all public routes from admin */}
            {!isAdmin && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />

                </Route>
              </>
            )}

            {/* Handle unknown routes */}
            <Route
              path="*"
              element={<Navigate to={isAdmin ? "/admin" : "/"} />}
            />
          </Routes>
        </Container>
      </main>
      {!isAdmin && <Footer />}
    </Router>
  );
};

export default App;
