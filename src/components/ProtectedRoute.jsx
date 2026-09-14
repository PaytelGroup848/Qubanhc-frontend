import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
  return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect based on role
    if (user?.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if(user?.role ==='sub_admin'){
      return <Navigate to='/admin/categories' replace/>;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}