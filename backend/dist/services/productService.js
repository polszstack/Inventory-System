"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const Transaction_1 = require("../models/Transaction");
const sequelize_1 = require("sequelize");
class ProductService {
    static async getProducts(filters) {
        const { page = 1, limit = 10, sort = 'created_at', order = 'DESC', search, category_id, is_active, low_stock, min_price, max_price, } = filters;
        const offset = (page - 1) * limit;
        const where = {};
        // Search filter
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.like]: `%${search}%` } },
                { sku: { [sequelize_1.Op.like]: `%${search}%` } },
                { description: { [sequelize_1.Op.like]: `%${search}%` } },
            ];
        }
        // Category filter
        if (category_id) {
            where.category_id = category_id;
        }
        // Active filter
        if (is_active !== undefined) {
            where.is_active = is_active;
        }
        // Price range filter
        if (min_price !== undefined || max_price !== undefined) {
            where.unit_price = {};
            if (min_price !== undefined)
                where.unit_price[sequelize_1.Op.gte] = min_price;
            if (max_price !== undefined)
                where.unit_price[sequelize_1.Op.lte] = max_price;
        }
        // Low stock filter
        if (low_stock) {
            where.quantity = { [sequelize_1.Op.lte]: sequelize_1.Sequelize.col('reorder_level') };
        }
        const { count, rows: products } = await Product_1.Product.findAndCountAll({
            where,
            include: [
                {
                    model: Category_1.Category,
                    attributes: ['id', 'name'],
                },
            ],
            order: [[sort, order]],
            limit,
            offset,
        });
        return {
            products,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        };
    }
    static async getProduct(id) {
        const product = await Product_1.Product.findByPk(id, {
            include: [
                {
                    model: Category_1.Category,
                    attributes: ['id', 'name'],
                },
                {
                    model: Transaction_1.Transaction,
                    limit: 10,
                    order: [['created_at', 'DESC']],
                },
            ],
        });
        if (!product) {
            throw Object.assign(new Error('Product not found'), { statusCode: 404 });
        }
        return product;
    }
    static async createProduct(data) {
        // Check if SKU already exists
        const existingProduct = await Product_1.Product.findOne({
            where: { sku: data.sku },
        });
        if (existingProduct) {
            throw Object.assign(new Error('SKU already exists'), { statusCode: 409 });
        }
        // Validate category exists if provided
        if (data.category_id) {
            const category = await Category_1.Category.findByPk(data.category_id);
            if (!category) {
                throw Object.assign(new Error('Category not found'), { statusCode: 404 });
            }
        }
        const product = await Product_1.Product.create(data);
        return product;
    }
    static async updateProduct(id, data) {
        const product = await Product_1.Product.findByPk(id);
        if (!product) {
            throw Object.assign(new Error('Product not found'), { statusCode: 404 });
        }
        // Validate category if being updated
        if (data.category_id) {
            const category = await Category_1.Category.findByPk(data.category_id);
            if (!category) {
                throw Object.assign(new Error('Category not found'), { statusCode: 404 });
            }
        }
        await product.update(data);
        // Reload to get updated associations
        await product.reload({
            include: [{ model: Category_1.Category }],
        });
        return product;
    }
    static async deleteProduct(id) {
        const product = await Product_1.Product.findByPk(id);
        if (!product) {
            throw Object.assign(new Error('Product not found'), { statusCode: 404 });
        }
        // Soft delete - deactivate instead of deleting
        await product.update({ is_active: false });
        return { message: 'Product deactivated successfully' };
    }
    static async hardDeleteProduct(id) {
        const product = await Product_1.Product.findByPk(id);
        if (!product) {
            throw Object.assign(new Error('Product not found'), { statusCode: 404 });
        }
        // Check if product has transactions
        const transactionCount = await Transaction_1.Transaction.count({
            where: { product_id: id },
        });
        if (transactionCount > 0) {
            throw Object.assign(new Error('Cannot delete product with existing transactions'), { statusCode: 400 });
        }
        await product.destroy();
        return { message: 'Product deleted permanently' };
    }
    static async getLowStockProducts() {
        const products = await Product_1.Product.findAll({
            where: {
                quantity: {
                    [sequelize_1.Op.lte]: sequelize_1.Sequelize.col('reorder_level'),
                },
                is_active: true,
            },
            include: [{ model: Category_1.Category }],
            order: [['quantity', 'ASC']],
        });
        return products;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=productService.js.map