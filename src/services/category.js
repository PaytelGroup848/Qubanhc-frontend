import api from './api';

export const categoryService = {
  // ==================== PUBLIC ROUTES ====================
  
  // Get all categories with tree structure
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get featured categories (homepage)
  getFeaturedCategories: async (limit = 6) => {
    const response = await api.get(`/categories/featured?limit=${limit}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Get categories by level
  getCategoriesByLevel: async (level) => {
    const response = await api.get(`/categories/level/${level}`);
    return response.data;
  },

  // Get category tree for a specific parent
  getCategoryTree: async (parentId = null) => {
    const url = parentId ? `/categories/tree/${parentId}` : '/categories/tree';
    const response = await api.get(url);
    return response.data;
  },

  // Get category hierarchy (breadcrumb)
  getCategoryHierarchy: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/hierarchy`);
    return response.data;
  },

  // ==================== PROTECTED ROUTES ====================
  
  // Get all categories flat (admin/vendor panel)
  getCategoriesFlat: async () => {
    const response = await api.get('/categories/admin/all');
    return response.data;
  },

  // Get vendor's own categories
  getVendorCategories: async () => {
    const response = await api.get('/categories/vendor/my-categories');
    return response.data;
  },

  // Get category by ID (with permission check)
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create category (admin/vendor)
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Toggle category status
  toggleCategoryStatus: async (id) => {
    const response = await api.patch(`/categories/${id}/toggle`);
    return response.data;
  },

  // Bulk update display order (admin only)
  bulkUpdateDisplayOrder: async (updates) => {
    const response = await api.put('/categories/bulk-order', { updates });
    return response.data;
  },

  // Get category statistics (admin only)
  getCategoryStats: async () => {
    const response = await api.get('/categories/stats');
    return response.data;
  },
};

export default categoryService;