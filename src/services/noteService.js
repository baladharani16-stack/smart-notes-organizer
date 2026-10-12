import api from './api.js';

export const noteService = {
  async getNotes(params = {}) {
    const response = await api.get('/api/notes', { params });
    return response.data;
  },

  async getNoteById(id) {
    const response = await api.get(`/api/notes/${id}`);
    return response.data;
  },

  async createNote(noteData) {
    const response = await api.post('/api/notes', noteData);
    return response.data;
  },

  async updateNote(id, noteData) {
    const response = await api.patch(`/api/notes/${id}`, noteData);
    return response.data;
  },

  async togglePin(id, isPinned) {
    const response = await api.patch(`/api/notes/${id}/pin`, { isPinned });
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/api/notes/${id}`);
    return response.data;
  },

  async getTrashNotes() {
    const response = await api.get('/api/trash');
    return response.data;
  },

  async restoreNote(id) {
    const response = await api.patch(`/api/trash/${id}/restore`);
    return response.data;
  },

  async permanentDeleteNote(id) {
    const response = await api.delete(`/api/trash/${id}/permanent`);
    return response.data;
  },

  async emptyTrash() {
    const response = await api.delete('/api/trash/empty');
    return response.data;
  },
};

export default noteService;
