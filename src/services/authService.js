import api from './api.js';

export const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('studyspace_token', response.data.token);
      localStorage.setItem('studyspace_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('studyspace_token', response.data.token);
      localStorage.setItem('studyspace_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('studyspace_token');
      localStorage.removeItem('studyspace_user');
    }
  },

  async getMe() {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.patch('/api/auth/profile', profileData);
    if (response.data?.user) {
      localStorage.setItem('studyspace_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

export default authService;
