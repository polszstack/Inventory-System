import api from './api';
import type { CreateTransactionDTO, TransactionFilters } from '@/types';

export const transactionService = {
  async getAll(filters?: TransactionFilters) {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  async create(data: CreateTransactionDTO) {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  async cancel(id: number) {
    const response = await api.patch(`/transactions/${id}/cancel`);
    return response.data.data;
  },

  async getByProduct(productId: number) {
    const response = await api.get(`/transactions/product/${productId}`);
    return response.data.data;
  },
};