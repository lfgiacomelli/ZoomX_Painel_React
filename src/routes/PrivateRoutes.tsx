import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">Carregando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/home" />;
};
