import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  search: (query) => api.get('/inventory/search/query', { params: { q: query } }),
};

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  create: (data) => api.post('/transactions', data),
  getByItem: (itemId) => api.get(`/transactions/item/${itemId}`),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  getById: (id) => api.get(`/users/${id}`),
};

export const activityAPI = {
  getAll: () => api.get('/activity'),
  create: (data) => api.post('/activity', data),
  getByUser: (userId) => api.get(`/activity/user/${userId}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;
