import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses Vite proxy in development ('/api') or relative root in production
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if saved in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studyspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if server reports unauthorized session
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem('studyspace_token');
        localStorage.removeItem('studyspace_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
