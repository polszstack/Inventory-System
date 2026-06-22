import Joi from 'joi';

export const Validators = {
  // Auth Validators
  login: Joi.object({
    username: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(6).max(100),
  }),

  register: Joi.object({
    username: Joi.string().required().min(3).max(50).alphanum(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(100)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    role: Joi.string().valid('admin', 'manager', 'staff'),
  }),

  // Product Validators
  createProduct: Joi.object({
    sku: Joi.string().required().min(3).max(50),
    name: Joi.string().required().min(2).max(200),
    description: Joi.string().allow('', null).max(1000),
    category_id: Joi.number().integer().allow(null),
    quantity: Joi.number().integer().min(0).default(0),
    unit_price: Joi.number().required().min(0).precision(2),
    reorder_level: Joi.number().integer().min(0).default(10),
    is_active: Joi.boolean().default(true),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(200),
    description: Joi.string().allow('', null).max(1000),
    category_id: Joi.number().integer().allow(null),
    unit_price: Joi.number().min(0).precision(2),
    reorder_level: Joi.number().integer().min(0),
    is_active: Joi.boolean(),
  }).min(1),

  // Category Validators
  createCategory: Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().allow('', null).max(500),
  }),

  updateCategory: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().allow('', null).max(500),
  }).min(1),

  // Transaction Validators
  createTransaction: Joi.object({
    product_id: Joi.number().integer().required(),
    type: Joi.string().valid('in', 'out').required(),
    quantity: Joi.number().integer().required().min(1),
    unit_price: Joi.number().min(0).precision(2),
    reference: Joi.string().max(100),
    notes: Joi.string().max(500),
    status: Joi.string().valid('pending', 'completed', 'cancelled'),
  }),

  stockAdjustment: Joi.object({
    quantity: Joi.number().integer().required().min(1),
    type: Joi.string().valid('in', 'out').required(),
    notes: Joi.string().max(500),
    reference: Joi.string().max(100),
  }),

  // Query Validators
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string(),
    order: Joi.string().valid('ASC', 'DESC').default('DESC'),
  }),
};