import api from './api.js';

export const subjectService = {
  async getSubjects() {
    const response = await api.get('/api/subjects');
    return response.data;
  },

  async createSubject(subjectData) {
    const response = await api.post('/api/subjects', subjectData);
    return response.data;
  },

  async updateSubject(id, subjectData) {
    const response = await api.patch(`/api/subjects/${id}`, subjectData);
    return response.data;
  },

  async deleteSubject(id) {
    const response = await api.delete(`/api/subjects/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  async seedDemoData() {
    const response = await api.post('/api/dashboard/seed');
    return response.data;
  },
};

export default subjectService;
