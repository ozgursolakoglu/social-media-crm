import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : 'https://solax-social-media-crm.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
};

export const platforms = {
  list: () => API.get('/platforms'),
  connect: (data) => API.post('/platforms/connect', data),
  remove: (id) => API.delete(`/platforms/${id}`),
};

export const posts = {
  list: () => API.get('/posts'),
  create: (data) => API.post('/posts', data),
};

export const schedules = {
  list: () => API.get('/schedules'),
  create: (data) => API.post('/schedules', data),
  remove: (id) => API.delete(`/schedules/${id}`),
};

export const meta = {
  publish: (data) => API.post('/meta/publish', data),
  status: () => API.get('/meta/status'),
};

export const health = () => API.get('/health');
