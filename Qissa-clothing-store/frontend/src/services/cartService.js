import api from './api';

export const cartService = {
  getCart() {
    return api.get('/cart');
  },

  addToCart({ product, color, size, quantity }) {
    return api.post('/cart', { product, color, size, quantity });
  },

  updateCartItem(productId, { color, size, quantity }) {
    return api.put(`/cart/${productId}`, { color, size, quantity });
  },

  removeCartItem(productId, { color, size }) {
    return api.delete(`/cart/${productId}`, { data: { color, size } });
  },

  clearCart() {
    return api.delete('/cart');
  },
};
