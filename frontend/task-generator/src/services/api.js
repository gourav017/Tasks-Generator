import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI generation
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// API methods
export const healthAPI = {
  check: () => api.get('/health'),
};

export const specificationsAPI = {
  generate: (data) => api.post('/specifications/generate', data),
  getRecent: () => api.get('/specifications/recent'),
  getById: (id) => api.get(`/specifications/${id}`),
  update: (id, data) => api.put(`/specifications/${id}`, data),
  reorderTasks: (id, tasks, type) => api.put(`/specifications/${id}/tasks/reorder`, { tasks, type }),
  delete: (id) => api.delete(`/specifications/${id}`),
  export: (id) => {
    return axios.get(`${API_BASE_URL}/specifications/${id}/export`, {
      responseType: 'blob',
    });
  },
};

export default api;