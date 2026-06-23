import api from './api';
import type { Product, CreateProductDTO, UpdateProductDTO, ProductFilters } from '@/types';

export const productService = {
  async getAll(filters?: ProductFilters) {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async create(data: CreateProductDTO) {
    const response = await api.post('/products', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateProductDTO) {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async getLowStock() {
    const response = await api.get('/products/low-stock');
    return response.data.data;
  },
};