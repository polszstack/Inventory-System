"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const joi_1 = __importDefault(require("joi"));
exports.Validators = {
    // Auth Validators
    login: joi_1.default.object({
        username: joi_1.default.string().required().min(3).max(50),
        password: joi_1.default.string().required().min(6).max(100),
    }),
    register: joi_1.default.object({
        username: joi_1.default.string().required().min(3).max(50).alphanum(),
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().min(6).max(100)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .message('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        role: joi_1.default.string().valid('admin', 'manager', 'staff'),
    }),
    // Product Validators
    createProduct: joi_1.default.object({
        sku: joi_1.default.string().required().min(3).max(50),
        name: joi_1.default.string().required().min(2).max(200),
        description: joi_1.default.string().allow('', null).max(1000),
        category_id: joi_1.default.number().integer().allow(null),
        quantity: joi_1.default.number().integer().min(0).default(0),
        unit_price: joi_1.default.number().required().min(0).precision(2),
        reorder_level: joi_1.default.number().integer().min(0).default(10),
        is_active: joi_1.default.boolean().default(true),
    }),
    updateProduct: joi_1.default.object({
        name: joi_1.default.string().min(2).max(200),
        description: joi_1.default.string().allow('', null).max(1000),
        category_id: joi_1.default.number().integer().allow(null),
        unit_price: joi_1.default.number().min(0).precision(2),
        reorder_level: joi_1.default.number().integer().min(0),
        is_active: joi_1.default.boolean(),
    }).min(1),
    // Category Validators
    createCategory: joi_1.default.object({
        name: joi_1.default.string().required().min(2).max(100),
        description: joi_1.default.string().allow('', null).max(500),
    }),
    updateCategory: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100),
        description: joi_1.default.string().allow('', null).max(500),
    }).min(1),
    // Transaction Validators
    createTransaction: joi_1.default.object({
        product_id: joi_1.default.number().integer().required(),
        type: joi_1.default.string().valid('in', 'out').required(),
        quantity: joi_1.default.number().integer().required().min(1),
        unit_price: joi_1.default.number().min(0).precision(2),
        reference: joi_1.default.string().max(100),
        notes: joi_1.default.string().max(500),
        status: joi_1.default.string().valid('pending', 'completed', 'cancelled'),
    }),
    stockAdjustment: joi_1.default.object({
        quantity: joi_1.default.number().integer().required().min(1),
        type: joi_1.default.string().valid('in', 'out').required(),
        notes: joi_1.default.string().max(500),
        reference: joi_1.default.string().max(100),
    }),
    // Query Validators
    pagination: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10),
        sort: joi_1.default.string(),
        order: joi_1.default.string().valid('ASC', 'DESC').default('DESC'),
    }),
};
//# sourceMappingURL=validators.js.map