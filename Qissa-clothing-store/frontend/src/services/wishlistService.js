import api from './api';

export const wishlistService = {
  getWishlist() {
    return api.get('/wishlist');
  },

  addToWishlist(productId) {
    return api.post('/wishlist', { product: productId });
  },

  removeFromWishlist(productId) {
    return api.delete(`/wishlist/${productId}`);
  },

  clearWishlist() {
    return api.delete('/wishlist');
  },
};
