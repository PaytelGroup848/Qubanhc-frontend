import api from './api';

export const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (productId, variantId = null) => {
    const response = await api.post(`/wishlist/add/${productId}`, { variantId });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId, variantId = null) => {
    const response = await api.delete(`/wishlist/remove/${productId}`, { data: { variantId } });
    return response.data;
  },

  // Check if product in wishlist
  checkInWishlist: async (productId, variantId = null) => {
    const response = await api.get(`/wishlist/check/${productId}`, { params: { variantId } });
    return response.data;
  },

  // Move to cart
  moveToCart: async (productId, variantId = null, quantity = 1) => {
    const response = await api.post(`/wishlist/move-to-cart/${productId}`, { variantId, quantity });
    return response.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },
};