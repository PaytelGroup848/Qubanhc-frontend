import api from "./api";

const blogService = {
  // Public endpoints
  getFeaturedBlogs: async (limit = 3) => {
    const response = await api.get("/blogs/featured", { params: { limit } });
    return response.data;
  },

  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/${slug}`);
    return response.data;
  },

  getBlogCategories: async () => {
    try {
      const response = await api.get("/blogs/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      // Fallback to static categories if API fails
      return {
        success: true,
        data: [
          "Baby-Diaper",
          "Baby-Wipes",
          "Adult-Diapers",
          "sanitary-pads",
          "others",
        ],
      };
    }
  },

  // Admin endpoints
  getAllBlogs: async (params = {}) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blogs/id/${id}`);
    return response.data;
  },

  createBlog: async (formData) => {
    const response = await api.post("/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBlog: async (id, formData) => {
    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  togglePublishStatus: async (id) => {
    const response = await api.patch(`/blogs/${id}/toggle-publish`);
    return response.data;
  },

  toggleFeaturedStatus: async (id) => {
    const response = await api.patch(`/blogs/${id}/toggle-featured`);
    return response.data;
  },
};

export default blogService;
