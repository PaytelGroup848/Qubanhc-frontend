import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1, variantId = null) => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
      variantId,
    });

    return response.data;
  },

  updateQuantity: async (itemId, quantity) => {
    const response = await api.put(`/cart/items/${itemId}`, {
      quantity,
    });

    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // ✅ Alias: agar kahin removeFromCart use ho raha hai to bhi chalega
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  applyCoupon: async (couponCode) => {
    const response = await api.post('/cart/apply-coupon', {
      couponCode,
    });

    return response.data;
  },

  removeCoupon: async () => {
    const response = await api.delete('/cart/remove-coupon');
    return response.data;
  },

  // ✅ CartPage ke admin/pricing summary ke liye
  getCartSummary: async (couponCode = '') => {
    const response = await api.get('/cart/summary', {
      params: couponCode ? { couponCode } : {},
    });

    return response.data;
  },
};

export default cartService;