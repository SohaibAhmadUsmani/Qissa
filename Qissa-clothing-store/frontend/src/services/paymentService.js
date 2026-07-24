import api from './api';

export const paymentService = {
  createCheckoutSession(addressId) {
    return api.post('/payments/create-checkout-session', { addressId });
  },

  verifyPayment(sessionId) {
    return api.get(`/payments/verify/${sessionId}`);
  },
};
