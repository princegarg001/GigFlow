import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface Props {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
