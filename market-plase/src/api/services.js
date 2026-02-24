import api from './axios';

// Auth
export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// Items
export const itemsService = {
  getAll: () => api.get('/api/items'),
  getById: (id) => api.get(`/api/items/${id}`),
  create: (data) => api.post('/api/items', data),
  delete: (id) => api.delete(`/api/items/${id}`),
  getBids: (id) => api.get(`/api/items/${id}/bids`),
  createBid: (id, data) => api.post(`/api/items/${id}/bids`, data),
};

// Bids
export const bidsService = {
  getMy: () => api.get('/api/bids/my'),
};

// Stats
export const statsService = {
  get: () => api.get('/api/stats'),
};
