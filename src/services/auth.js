import axios from 'axios';

const authBackendUrl = (
  import.meta.env.VITE_AUTH_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:5000'
).replace(/\/+$/, '');

const authApi = axios.create({
  baseURL: `${authBackendUrl}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const storefrontBackendUrl = (
  import.meta.env.VITE_BACKEND_URL ||
  'https://qubanhygienecare.com'
).replace(/\/+$/, '');

const usesStorefrontAuth = authBackendUrl === storefrontBackendUrl;

export const authService = {
  // Register new user
 register: async (userData) => {
  const response = await authApi.post('/auth/register', userData);
  return response.data;
},

  // Login user
  login: async (credentials) => {
    const response = await authApi.post('/auth/login', credentials);
    const payload = response.data?.data || response.data || {};
    const accessToken =
      payload.accessToken || payload.token || payload.tokens?.accessToken;
    const refreshToken =
      payload.refreshToken || payload.tokens?.refreshToken;
    const user = payload.user || response.data?.user;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      const rToken = refreshToken;
      if (rToken && rToken !== 'undefined' && rToken !== 'null') {
        localStorage.setItem('refreshToken', rToken);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    return {
      ...response.data,
      data: {
        ...payload,
        accessToken,
        refreshToken,
        user,
      },
    };
  },

  // Verify email with OTP
  verifyEmail: async (email, otp) => {
    const response = await authApi.post('/auth/verify-email', { email, otp });
    return response.data;
  },

  // Resend OTP
  resendOtp: async (email) => {
    const response = await authApi.post('/auth/resend-otp', { email, type: 'email_verify' });
    return response.data;
  },

  // Get current logged in user
  getCurrentUser: async () => {
    const response = await authApi.get('/auth/me', {
      headers: { Authorization: `Bearer ${authService.getToken()}` },
    });
    return response.data;
  },

  // Forgot password - send OTP
  forgotPassword: async (email) => {
    const response = await authApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with OTP
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    const response = await authApi.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
      confirmPassword
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await authApi.post('/auth/refresh-token', { refreshToken });
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await authApi.post('/auth/logout', null, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuthData();
      sessionStorage.clear();
      window.dispatchEvent(new Event('auth-changed'));
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const user = authService.getUser();
    if (!token || !user) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();

      if (expiryTime < currentTime) {
        // Keep the persisted session alive while the refresh token is available.
        return Boolean(authService.getRefreshToken());
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  isStorefrontAuthenticated: () =>
    usesStorefrontAuth && authService.isAuthenticated(),

  // Get user from localStorage
  getUser: () => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user:', e);
        return null;
      }
    }
    return null;
  },

  // Get access token
  getToken: () => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  },

  // Update user in localStorage
  updateUser: (userData) => {
    const currentUser = authService.getUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Clear all auth data
  clearAuthData: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = authService.getUser();
    return user?.role === role;
  },

  // Check if user is admin (super_admin or sub_admin)
  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === 'super_admin' || user?.role === 'sub_admin';
  },

  // Check if user is vendor
  isVendor: () => {
    const user = authService.getUser();
    return user?.role === 'vendor';
  },

  // Check if user is customer
  isCustomer: () => {
    const user = authService.getUser();
    return user?.role === 'customer';
  },

  // Get token expiry time
  getTokenExpiry: () => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (e) {
      return null;
    }
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      return (expiryTime - currentTime) < fiveMinutes;
    } catch (e) {
      return true;
    }
  },

  // Auto refresh token if expiring soon
  autoRefreshToken: async () => {
    if (!authService.isAuthenticated()) return false;

    if (authService.isTokenExpiringSoon()) {
      try {
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          await authService.refreshToken(refreshToken);

          return true;
        }
      } catch (error) {
        console.error('Auto refresh failed:', error);
        authService.clearAuthData();
        sessionStorage.clear();
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return false;
      }
    }
    return false;
  }
};