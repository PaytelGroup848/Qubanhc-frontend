import api from './api';

export const supportService = {
  createTicket: async (data) => {
    const response = await api.post('/support', data);
    return response.data;
  },

  getMyTickets: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();

    const response = await api.get(
      `/support${queryParams ? `?${queryParams}` : ''}`
    );

    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/support/${id}`);
    return response.data;
  },

  replyTicket: async (id, data) => {
    const response = await api.post(`/support/${id}/reply`, data);
    return response.data;
  },
};

export default supportService;