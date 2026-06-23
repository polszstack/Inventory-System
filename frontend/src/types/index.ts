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

// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

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

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// Product Types
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category_id: number;
  category?: Category;
  quantity: number;
  unit_price: number;
  reorder_level: number;
  is_active: boolean;
  stockStatus?: 'out_of_stock' | 'low_stock' | 'in_stock';
  inventoryValue?: number;
  created_at: string;
  updated_at: string;
}

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

// Transaction Types
export interface Transaction {
  id: number;
  product_id: number;
  product?: Product;
  type: 'in' | 'out';
  quantity: number;
  unit_price: number;
  reference: string;
  notes: string;
  created_by?: number;
  creator?: User;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface CreateTransactionDTO {
  product_id: number;
  type: 'in' | 'out';
  quantity: number;
  unit_price?: number;
  reference?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface ProductFilters extends PaginationParams {
  search?: string;
  category_id?: number;
  is_active?: boolean;
  low_stock?: boolean;
}

export interface TransactionFilters extends PaginationParams {
  product_id?: number;
  type?: 'in' | 'out';
  status?: 'pending' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  icon: string;
  to?: string;
  children?: NavItem[];
  roles?: string[];
}