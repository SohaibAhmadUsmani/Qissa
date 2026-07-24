import api from './api';

export const addressService = {
  getAddresses() {
    return api.get('/addresses');
  },

  createAddress(data) {
    return api.post('/addresses', data);
  },

  updateAddress(id, data) {
    return api.put(`/addresses/${id}`, data);
  },
};
