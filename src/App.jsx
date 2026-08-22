import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import { authService } from "./services/auth";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollTop";

// ---------- Customer imports ----------
import Layout from "./layouts/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import CustomerPage from "./pages/customer/CustomerPage";
import AccountPage from "./pages/customer/Account/AccountPage";
import CategoryPage from "./pages/customer/Category/CategoryPage";
import AllCategories from "./pages/customer/Category/AllCategories";
import ProductDetailPage from "./pages/customer/FeaturedProucts/ProductDetailPage";
import CartPage from "./pages/customer/Cart/CartPage";
import CheckoutPage from "./pages/customer/Checkout/CheckoutPage";
import WishlistPage from "./pages/customer/WishlistPage/WishlistPage";
import ContactUs from "./pages/customer/ContactUs";
import SearchPage from "./pages/customer/Search/SearchPage";
import CashfreeSuccess from "./pages/customer/payment/CashfreeSuccess";
// import RazorpaySuccess from "./pages/customer/payment/RazorpaySuccess";

// Remove this duplicate import - you already have BlogListing and BlogPage below
// import QubanHCBlogPage from "./pages/customer/blogPage";

import InvoicePage from "./components/invoice/invoice";
// import MySupport from "./pages/customer/Category/support/mySupport";
import MySupport from "./pages/customer/Support/MySupport";
// import SupportTicketDetail from "./pages/customer/Category/support/supportTicketDetail";
import SupportTicketDetail from "./pages/customer/Support/SupportTicketDetail";
import BlogListing from "./pages/customer/BlogListing";
import BlogPage from "./pages/customer/blogPage";

// ---------- Admin imports lazy ----------
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminRoutes = lazy(() => import("./pages/admin/AdminRoutes"));

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" />
  </div>
);

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-6xl font-bold text-gray-300">404</h1>
    <p className="text-gray-500">Page not found</p>
    <a href="/" className="text-teal-600 hover:underline">
      Go back home
    </a>
  </div>
);

export default function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      authService.autoRefreshToken();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* ========== PUBLIC AUTH ROUTES ========== */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/payment/cashfree/success"
                element={
                  <PublicRoute>
                    <CashfreeSuccess />
                  </PublicRoute>
                }
              />

              <Route
                path="/admin/login"
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                }
              />

              {/* ========== PROTECTED ADMIN ROUTES ========== */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["super_admin", "sub_admin"]}>
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />

              {/* ========== CUSTOMER ROUTES WITH MAIN LAYOUT ========== */}
              <Route element={<Layout />}>
                {/* Public customer pages */}
                <Route path="/" element={<CustomerPage />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/search" element={<SearchPage />} />

                <Route path="/blog" element={<BlogListing />} />
                <Route path="/blog/:slug" element={<BlogPage />} />

                {/* Support routes */}
                <Route
                  path="/account/support"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <MySupport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account/support/:id"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <SupportTicketDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Protected customer pages */}
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                {/* Customer Invoice Page */}
                <Route
                  path="/account/orders/:id/invoice"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <InvoicePage
                        backUrl="/account"
                        backLabel="Back to My Account"
                      />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ========== 404 NOT FOUND ========== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
