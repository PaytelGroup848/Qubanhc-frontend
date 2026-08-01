import api from '../../../../services/api';

export const accountService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await api.put('/users/profile', payload);
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get('/users/addresses');
    return response.data;
  },

  addAddress: async (payload) => {
    const response = await api.post('/users/addresses', payload);
    return response.data;
  },

  updateAddress: async (id, payload) => {
    const response = await api.put(`/users/addresses/${id}`, payload);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },

  changePassword: async (payload) => {
    const response = await api.post('/users/change-password', payload);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  removeWishlistItem: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },
};