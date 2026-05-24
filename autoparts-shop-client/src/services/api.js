import axios from 'axios';

const API_URL = 'http://localhost:5051/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/Auth/login', { email, password }),
  register: (userData) => api.post('/Auth/register', userData),
};

export const partsAPI = {
  search: (term) => api.get(`/Parts/search?term=${encodeURIComponent(term)}`),
  getAll: () => api.get('/Parts'),
  getAnalogues: (id) => api.get(`/Parts/${id}/analogues`),
};

export default api;