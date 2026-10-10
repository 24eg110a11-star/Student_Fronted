import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith('/auth/login') || error.config?.url?.startsWith('/auth/register');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error, fallback = 'Something went wrong.') => {
  if (!error.response) return 'Server connection failed.';
  return error.response.data?.message || fallback;
};

export const authApi = {
  register: (d) => api.post('/auth/register', d),
  login: (d) => api.post('/auth/login', d)
};
export const taskApi = {
  list: (params) => api.get('/tasks', { params }),
  subjects: () => api.get('/tasks/subjects'),
  get: (id) => api.get(`/tasks/${id}`),
  create: (d) => api.post('/tasks', d),
  update: (id, d) => api.put(`/tasks/${id}`, d),
  remove: (id) => api.delete(`/tasks/${id}`),
  setStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status })
};
export const dashboardApi = { get: () => api.get('/dashboard') };
export default api;
