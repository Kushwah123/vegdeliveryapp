import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminRoute;
