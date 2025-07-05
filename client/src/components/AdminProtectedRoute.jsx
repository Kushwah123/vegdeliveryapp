// import { Navigate, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const AdminRoute = () => {
//   const { user } = useSelector((state) => state.auth);
//   return user && user.isAdmin ? <Outlet /> : <Navigate to="/admin" />;
// };

// export default AdminRoute;

// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (user && !user.isAdmin) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminProtectedRoute;
