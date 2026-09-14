import api from "./api";

const bannerService = {
  // Public endpoints
  getActiveBanners: async (type) => {
    const params = type ? { type } : {};
    const response = await api.get("/banners/active", { params });
    return response.data;
  },

  // Admin endpoints
  getAllBanners: async (params) => {
    const response = await api.get("/banners", { params });
    return response.data;
  },

  getBannerById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  createBanner: async (formData) => {
    const response = await api.post("/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBanner: async (id, formData) => {
    const response = await api.put(`/banners/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  toggleBannerStatus: async (id) => {
    const response = await api.patch(`/banners/${id}/toggle-status`);
    return response.data;
  },
};

export default bannerService;
