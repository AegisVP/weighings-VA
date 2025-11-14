import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const PublicOnlyRoute = () => {
  const { isLoggedIn, isRefreshing } = useAuth();
  return isLoggedIn || isRefreshing ? <Navigate to="/" /> : <Outlet />;
};
