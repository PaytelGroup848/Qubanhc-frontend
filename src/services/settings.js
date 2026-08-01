import api from './api';

export const settingsService = {
  // Get all settings (Admin only)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update settings (Admin only)
  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },

  // Get vendor registration status (Public)
  getVendorRegistrationStatus: async () => {
    const response = await api.get('/settings/vendor-registration');
    return response.data;
  },

  // Update vendor registration status (Admin only)
  updateVendorRegistrationStatus: async (isEnabled) => {
    const response = await api.put('/settings/vendor-registration', { isEnabled });
    return response.data;
  },

  // Update vendor auto approve (Admin only)
  updateVendorAutoApprove: async (autoApprove) => {
    const response = await api.put('/settings/vendor-auto-approve', { autoApprove });
    return response.data;
  },

  // Update commission rate (Admin only)
  updateCommissionRate: async (rate) => {
    const response = await api.put('/settings/commission-rate', { rate });
    return response.data;
  },

  // Get store info (Public)
  getStoreInfo: async () => {
    const response = await api.get('/settings/store-info');
    return response.data;
  },

  // Check maintenance mode (Public)
  checkMaintenance: async () => {
    const response = await api.get('/settings/maintenance');
    return response.data;
  },
};