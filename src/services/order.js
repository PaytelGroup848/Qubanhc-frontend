import api from './api';

export const orderService = {

    // ===========================
    // CUSTOMER
    // ===========================

    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getMyOrders: async (page = 1, limit = 10) => {
        const response = await api.get('/orders/my-orders', {
            params: { page, limit }
        });

        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    cancelOrder: async (id, reason) => {
        const response = await api.post(`/orders/${id}/cancel`, {
            reason
        });

        return response.data;
    },

    // ===========================
    // PAYMENT (Testing)
    // ===========================

    markPaymentDoneTest: async (orderId) => {
        const response = await api.post(
            `/orders/${orderId}/payment-done-test`
        );

        return response.data;
    },

    // ===========================
    // PAYMENT (Cashfree Future)
    // ===========================

    createPaymentSession: async (orderId) => {
        const response = await api.post(
            `/payments/create-session`,
            {
                orderId
            }
        );

        return response.data;
    },

    verifyPayment: async (orderId) => {
        const response = await api.post(
            `/payments/verify`,
            {
                orderId
            }
        );

        return response.data;
    },

    // ===========================
    // INVOICE
    // ===========================

    downloadInvoice: async (orderId) => {

        const response = await api.get(

            `/invoice/${orderId}`,

            {

                responseType: 'blob',

            }

        );

        return response.data;

    },

};