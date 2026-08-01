import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import AdminLayout from './AdminLayout';
import { authService } from '../../services/auth';
import {
  canAccessModule,
  getFirstAllowedAdminPath,
  getModuleByPath,
  isSuperAdmin,
  isSubAdmin,
} from '../../utils/adminAccess';

import SettingsPage from './pages/settings/SettingsPage';
import InvoicePage from '../../components/invoice/invoice';
import OrderDetails from './pages/orderDetails';
import Support from './pages/support';

const AdminLogin = lazy(() => import('./AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SubAdmins = lazy(() => import('./pages/SubAdmins'));
const SubAdminCreate = lazy(() => import('./pages/SubAdminCreate'));
const Products = lazy(() => import('./pages/Products'));
const ProductCreate = lazy(() => import('./pages/ProductCreate'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customer'));
const Categories = lazy(() => import('./pages/Category'));
const CategoryCreate = lazy(() => import('./pages/CategoryCreate'));
const Reports = lazy(() => import('./pages/Reports'));
const Coupons = lazy(() => import('./pages/Coupons'));
const CouponCreate = lazy(() => import('./pages/CouponCreate'));

function NoAccess() {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6">
      <h1 className="text-lg font-bold text-red-700">No Access Assigned</h1>
      <p className="mt-2 text-sm text-red-600">
        You do not have permission to access any admin module. Please contact
        the super admin.
      </p>
    </div>
  );
}

function RequireAdminLayout() {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isSuperAdmin(user) && !isSubAdmin(user)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout />;
}

function AdminRedirect() {
  const user = authService.getUser();
  const redirectPath = getFirstAllowedAdminPath(user);

  return <Navigate to={redirectPath} replace />;
}

function SuperAdminOnly({ children }) {
  const user = authService.getUser();

  if (!isSuperAdmin(user)) {
    return <Navigate to={getFirstAllowedAdminPath(user)} replace />;
  }

  return children;
}

function ModuleGuard({ moduleId, children }) {
  const user = authService.getUser();
  const location = useLocation();

  const resolvedModuleId = moduleId || getModuleByPath(location.pathname);

  if (!resolvedModuleId) {
    if (isSuperAdmin(user)) return children;
    return <Navigate to={getFirstAllowedAdminPath(user)} replace />;
  }

  if (!canAccessModule(user, resolvedModuleId)) {
    return <Navigate to={getFirstAllowedAdminPath(user)} replace />;
  }

  return children;
}

export default function AdminRoutes() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<RequireAdminLayout />}>
          <Route index element={<AdminRedirect />} />

          <Route
            path="dashboard"
            element={
              <SuperAdminOnly>
                <AdminDashboard />
              </SuperAdminOnly>
            }
          />

          <Route
            path="sub-admins"
            element={
              <SuperAdminOnly>
                <SubAdmins />
              </SuperAdminOnly>
            }
          />

          <Route
            path="sub-admins/create"
            element={
              <SuperAdminOnly>
                <SubAdminCreate />
              </SuperAdminOnly>
            }
          />

          <Route
            path="products"
            element={
              <ModuleGuard moduleId="products">
                <Products />
              </ModuleGuard>
            }
          />

          <Route
            path="products/create"
            element={
              <ModuleGuard moduleId="products">
                <ProductCreate />
              </ModuleGuard>
            }
          />

          <Route
            path="categories"
            element={
              <ModuleGuard moduleId="categories">
                <Categories />
              </ModuleGuard>
            }
          />

          <Route
            path="categories/new"
            element={
              <ModuleGuard moduleId="categories">
                <CategoryCreate />
              </ModuleGuard>
            }
          />

          <Route
            path="categories/:id/edit"
            element={
              <ModuleGuard moduleId="categories">
                <CategoryCreate />
              </ModuleGuard>
            }
          />

          <Route
            path="orders"
            element={
              <ModuleGuard moduleId="orders">
                <Orders />
              </ModuleGuard>
            }
          />

          <Route
            path="orders/:id"
            element={
              <ModuleGuard moduleId="orders">
                <OrderDetails />
              </ModuleGuard>
            }
          />

          <Route
            path="orders/:id/invoice"
            element={
              <ModuleGuard moduleId="orders">
                <InvoicePage
                  backUrl="/admin/orders"
                  backLabel="Back to Admin Orders"
                />
              </ModuleGuard>
            }
          />

          <Route
            path="customers"
            element={
              <ModuleGuard moduleId="customers">
                <Customers />
              </ModuleGuard>
            }
          />

          <Route
            path="support"
            element={
              <ModuleGuard moduleId="support">
                <Support />
              </ModuleGuard>
            }
          />

          <Route
            path="coupons"
            element={
              <SuperAdminOnly>
                <Coupons />
              </SuperAdminOnly>
            }
          />

          <Route
            path="coupons/new"
            element={
              <SuperAdminOnly>
                <CouponCreate />
              </SuperAdminOnly>
            }
          />

          <Route
            path="coupons/:id/edit"
            element={
              <SuperAdminOnly>
                <CouponCreate />
              </SuperAdminOnly>
            }
          />

          <Route
            path="reports"
            element={
              <SuperAdminOnly>
                <Reports />
              </SuperAdminOnly>
            }
          />

          <Route
            path="settings"
            element={
              <SuperAdminOnly>
                <SettingsPage />
              </SuperAdminOnly>
            }
          />

          <Route path="no-access" element={<NoAccess />} />
        </Route>
      </Routes>
    </Suspense>
  );
}