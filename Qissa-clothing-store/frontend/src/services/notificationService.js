import api from './api';

export const notificationService = {
  subscribeToBackInStock({ productId, email, size, color }) {
    return api.post('/v1/notifications/back-in-stock', { productId, email, size, color });
  },
};
