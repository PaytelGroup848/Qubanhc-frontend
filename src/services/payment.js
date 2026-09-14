import api from './api';

export const paymentService = {
  createCashfreeOrder: async (orderId) => {
    const response = await api.post('/payments/cashfree/create-order', {
      orderId,
    });

    return response.data;
  },

  verifyCashfreePayment: async (orderId) => {
    const response = await api.post('/payments/cashfree/verify', {
      orderId,
    });

    return response.data;
  },
};

export default paymentService;