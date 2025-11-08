import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { isLoggedIn, isRefreshing } = useAuth();
  console.log({ isLoggedIn, isRefreshing });
  return isLoggedIn || isRefreshing ? <Outlet /> : <Navigate to="/login" />;
};
