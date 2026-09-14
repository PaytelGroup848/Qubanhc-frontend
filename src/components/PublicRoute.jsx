// import { Navigate, useLocation } from 'react-router-dom';
// import { authService } from '../services/auth';

// export default function PublicRoute({ children }) {
//   const location = useLocation();
//   const isAuthenticated = authService.isAuthenticated();
//   const user = authService.getUser();

//   // Admin login page
// if (location.pathname.startsWith('/admin')) {

//   if (user?.role === 'super_admin') {
//     return <Navigate to="/admin/dashboard" replace />;
//   }

//   if (user?.role === 'sub_admin') {
//     return <Navigate to="/admin/categories" replace />;
//   }

// }

// // Customer login page
// if (user?.role === 'customer') {
//   const from = location.state?.from;
//   return <Navigate to={from || '/'} replace />;
// }

// // Safety fallback
// return <Navigate to="/" replace />;

//   return children;
// }

import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

export default function PublicRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated || !user) {
    return children;
  }

  // Agar already logged-in admin / sub-admin admin login page open kare
  if (location.pathname === '/admin/login') {
    if (user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'sub_admin') {
      return <Navigate to="/admin/categories" replace />;
    }

    // Customer ko admin login page se home bhejo
    return <Navigate to="/" replace />;
  }

  // Agar already logged-in customer /login open kare
  if (location.pathname === '/login') {
    if (user.role === 'customer') {
      const from = location.state?.from;
      return <Navigate to={from || '/'} replace />;
    }

    if (user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'sub_admin') {
      return <Navigate to="/admin/categories" replace />;
    }
  }

  return children;
}