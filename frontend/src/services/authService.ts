import api from './api';
import type { LoginDTO, RegisterDTO, AuthResponse, User } from '@/types';

export const authService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },
};