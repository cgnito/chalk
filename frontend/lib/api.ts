import axios from 'axios';

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || ''
).replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return api.post('/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  register: (data: unknown) => api.post('/register/', data),
};

export const classAPI = {
  create: (data: { name: string }) => api.post('/classes/', data),
  list: () => api.get('/classes/'),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

export const studentAPI = {
  list: () => api.get('/students/'),
  create: (data: unknown) => api.post('/students/', data),
  searchBySlugAndSID: (slug: string, sid: string) =>
    api.get(`/public/${slug}/search/${sid.toUpperCase()}`),
};

export const paymentAPI = {
  verifyPayment: (ref: string) =>
    api.get(`/payments/verify/${encodeURIComponent(ref)}`),
  getHistory: () => api.get('/payments/history/'),
};

export const schoolAPI = {
  getSettings: () => api.get('/schools/me/settings/'),
  updateSettings: (data: unknown) => api.put('/schools/me/settings/', data),
};
