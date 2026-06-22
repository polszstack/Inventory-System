// Export all models with default exports
export { default as Category } from './Category';
export { default as Product } from './Product';
export { default as Transaction } from './Transaction';
export { default as User } from './User';

// Re-export types
export { TransactionType, TransactionStatus } from './Transaction';
export { UserRole } from './User';

// Import all models for associations
import Category from './Category';
import Product from './Product';
import Transaction from './Transaction';
import User from './User';

// All associations are already defined through decorators
export const models = {
  Category,
  Product,
  Transaction,
  User,
};