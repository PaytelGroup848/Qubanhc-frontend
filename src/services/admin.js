import api from './api';
import { unwrapApiData, unwrapProductDetail } from '../utils/apiResponse';

export const adminService = {
  // ==================== DASHBOARD ====================
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // ==================== CATEGORIES ====================
  getCategories: async () => {
    const response = await api.get('/categories/admin/all');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/admin/${id}`);
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  toggleCategoryStatus: async (id) => {
    const response = await api.patch(`/categories/${id}/toggle`);
    return response.data;
  },

  // ==================== PRODUCTS ====================
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/products${queryParams ? `?${queryParams}` : ''}`);
    return unwrapApiData(response.data);
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return unwrapProductDetail(response.data);
  },

  createProduct: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateProductStatus: async (id, status) => {
    const response = await api.patch(`/products/${id}/status`, { status });
    return response.data;
  },

  // ==================== VARIANTS ====================
  getVariantsByProduct: async (productId) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
  },

  createVariant: async (productId, data) => {
    const response = await api.post(`/products/${productId}/variants`, data);
    return response.data;
  },

  updateVariant: async (variantId, data) => {
    const response = await api.put(`/products/variants/${variantId}`, data);
    return response.data;
  },

  deleteVariant: async (variantId) => {
    const response = await api.delete(`/products/variants/${variantId}`);
    return response.data;
  },

  toggleVariantStatus: async (variantId) => {
    const response = await api.patch(`/products/variants/${variantId}/toggle`);
    return response.data;
  },

  // ==================== VENDORS ====================
  getVendors: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/vendors${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  getVendorById: async (id) => {
    const response = await api.get(`/admin/vendors/${id}`);
    return response.data;
  },

  createVendor: async (data) => {
    const response = await api.post('/admin/vendors', data);
    return response.data;
  },

  approveVendor: async (id) => {
    const response = await api.put(`/admin/vendors/${id}/approve`);
    return response.data;
  },

  rejectVendor: async (id, reason) => {
    const response = await api.put(`/admin/vendors/${id}/reject`, { reason });
    return response.data;
  },

  suspendVendor: async (id, reason) => {
    const response = await api.put(`/admin/vendors/${id}/suspend`, { reason });
    return response.data;
  },

  activateVendor: async (id) => {
    const response = await api.put(`/admin/vendors/${id}/activate`);
    return response.data;
  },

  // ==================== USERS ====================
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/users${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // ==================== ORDERS ====================
  getAllOrders: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();

    const response = await api.get(
      `/orders/admin/all${queryParams ? `?${queryParams}` : ''}`
    );

    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/admin/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status, reason = '') => {
    const response = await api.patch(`/orders/admin/${id}/status`, {
      status,
      reason,
    });

    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/admin/${id}`);
    return response.data;
  },


  // ==================== COUPONS ====================
  getCoupons: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/coupons${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  getCouponById: async (id) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  createCoupon: async (data) => {
    const response = await api.post('/coupons', data);
    return response.data;
  },

  updateCoupon: async (id, data) => {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  toggleCouponStatus: async (id) => {
    const response = await api.patch(`/coupons/${id}/toggle`);
    return response.data;
  },

  // ==================== SETTINGS ====================
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },


  updateOrderSettings: async (data) => {
    const response = await api.put('/admin/settings/order', data);
    return response.data;
  },

  updateTaxSettings: async (data) => {
    const response = await api.put('/settings/tax', data);
    return response.data;
  },

  getCommissionSettings: async () => {
    const response = await api.get('/settings/commission');
    return response.data;
  },

  updateCommissionSettings: async (data) => {
    const response = await api.put('/settings/commission', data);
    return response.data;
  },

  // ==================== REPORTS ====================
  getReports: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/reports${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // ==================== DASHBOARD WIDGETS ====================
  getRecentOrders: async (limit = 5) => {
    const response = await api.get(`/admin/orders/recent?limit=${limit}`);
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },

  getRevenueStats: async (period = 'month') => {
    const response = await api.get(`/admin/reports/revenue?period=${period}`);
    return response.data;
  },

  // ==================== VENDOR WITHDRAWALS ====================
  getWithdrawals: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/withdrawals${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  approveWithdrawal: async (id) => {
    const response = await api.put(`/admin/withdrawals/${id}/approve`);
    return response.data;
  },

  rejectWithdrawal: async (id, reason) => {
    const response = await api.put(`/admin/withdrawals/${id}/reject`, { reason });
    return response.data;
  },

  // ==================== SYSTEM LOGS ====================
  getLogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/logs${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // ==================== BACKUP ====================
  createBackup: async () => {
    const response = await api.post('/admin/backup');
    return response.data;
  },

  getBackups: async () => {
    const response = await api.get('/admin/backups');
    return response.data;
  },

  restoreBackup: async (id) => {
    const response = await api.post(`/admin/backups/${id}/restore`);
    return response.data;
  },


// ==================== SUPPORT ====================
getSupportStats: async () => {
  const response = await api.get('/support/admin/stats');
  return response.data;
},

getSupportTickets: async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  const response = await api.get(
    `/support${queryParams ? `?${queryParams}` : ''}`
  );

  return response.data;
},

getSupportTicketById: async (id) => {
  const response = await api.get(`/support/${id}`);
  return response.data;
},

replySupportTicket: async (id, data) => {
  const response = await api.post(`/support/${id}/reply`, data);
  return response.data;
},

updateSupportTicket: async (id, data) => {
  const response = await api.patch(`/support/${id}`, data);
  return response.data;
},

deleteSupportTicket: async (id) => {
  const response = await api.delete(`/support/${id}`);
  return response.data;
},

};
export default adminService;