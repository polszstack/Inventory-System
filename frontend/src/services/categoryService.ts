import api from './api';
import type { Category } from '@/types';

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  async create(data: { name: string; description?: string }) {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  async update(id: number, data: { name?: string; description?: string }) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};