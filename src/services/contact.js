import api from "./api";

export const contactService = {
  submitQuery: async (data) => {
    const response = await api.post("/contact", data);
    return response.data;
  },
};

export default contactService;
