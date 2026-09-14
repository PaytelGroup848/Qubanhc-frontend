import api from './api';

export const invoiceService = {
  generateInvoice: async (orderId) => {
    const response = await api.post(`/invoices/orders/${orderId}/generate`);
    return response.data;
  },

  getInvoiceByOrder: async (orderId) => {
    const response = await api.get(`/invoices/orders/${orderId}`);
    return response.data;
  },
};