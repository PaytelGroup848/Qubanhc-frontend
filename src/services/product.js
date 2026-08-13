import api from './api';
import { unwrapApiData, unwrapProductDetail } from '../utils/apiResponse';

export const productService = {
  // Get all products with filters
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/products${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return unwrapProductDetail(response.data);
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return unwrapProductDetail(response.data);
  },

  // Search products
  searchProducts: async (searchTerm, page = 1, limit = 20) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 1, limit = 20) => {
    const response = await api.get(`/products/category/${categoryId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get vendor products (for vendor dashboard)
  getVendorProducts: async (page = 1, limit = 20) => {
    const response = await api.get(`/products/vendor/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create product (vendor/admin)
  createProduct: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update product
  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Update product status
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
};

export default productService;