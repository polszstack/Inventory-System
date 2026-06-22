import { Request } from 'express';
import { User } from '../models/User';

// Extended Request with user
export interface AuthRequest extends Request {
  user?: User;
  userId?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Pagination Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// Filter Types
export interface ProductFilters extends PaginationQuery {
  search?: string;
  category_id?: number;
  is_active?: boolean;
  low_stock?: boolean;
  min_price?: number;
  max_price?: number;
}

export interface TransactionFilters extends PaginationQuery {
  product_id?: number;
  type?: 'in' | 'out';
  status?: 'pending' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_by?: number;
}

// Auth Types
export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'staff';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// Product DTOs
export interface CreateProductDTO {
  sku: string;
  name: string;
  description?: string;
  category_id?: number;
  quantity?: number;
  unit_price: number;
  reorder_level?: number;
  is_active?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  category_id?: number;
  unit_price?: number;
  reorder_level?: number;
  is_active?: boolean;
}

// Category DTOs
export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

// Transaction DTOs
export interface CreateTransactionDTO {
  product_id: number;
  type: 'in' | 'out';
  quantity: number;
  unit_price?: number;
  reference?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface StockAdjustmentDTO {
  quantity: number;
  type: 'in' | 'out';
  notes?: string;
  reference?: string;
}

// Report Types
export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  outOfStock: number;
  lowStock: number;
  categoryBreakdown: {
    category: string;
    count: number;
    value: number;
  }[];
}

export interface TransactionReport {
  totalTransactions: number;
  totalInflow: number;
  totalOutflow: number;
  netFlow: number;
  periodStart: string;
  periodEnd: string;
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  filters?: any;
  columns?: string[];
}