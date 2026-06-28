"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const Transaction_1 = require("../models/Transaction");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class TransactionService {
    static async getTransactions(filters) {
        const { page = 1, limit = 10, sort = 'created_at', order = 'DESC', product_id, type, status, start_date, end_date, created_by, } = filters;
        const offset = (page - 1) * limit;
        const where = {};
        if (product_id)
            where.product_id = product_id;
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (created_by)
            where.created_by = created_by;
        // Date range filter
        if (start_date || end_date) {
            where.created_at = {};
            if (start_date)
                where.created_at[sequelize_1.Op.gte] = new Date(start_date);
            if (end_date)
                where.created_at[sequelize_1.Op.lte] = new Date(end_date);
        }
        const { count, rows: transactions } = await Transaction_1.Transaction.findAndCountAll({
            where,
            include: [
                {
                    model: Product_1.Product,
                    attributes: ['id', 'sku', 'name'],
                },
                {
                    model: User_1.User,
                    as: 'creator',
                    attributes: ['id', 'username'],
                },
            ],
            order: [[sort, order]],
            limit,
            offset,
        });
        return {
            transactions,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        };
    }
    static async getTransaction(id) {
        const transaction = await Transaction_1.Transaction.findByPk(id, {
            include: [
                {
                    model: Product_1.Product,
                    attributes: ['id', 'sku', 'name', 'unit_price'],
                },
                {
                    model: User_1.User,
                    as: 'creator',
                    attributes: ['id', 'username'],
                },
            ],
        });
        if (!transaction) {
            throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
        }
        return transaction;
    }
    static async createTransaction(data, userId) {
        // Use transaction to ensure data consistency
        const dbTransaction = await database_1.default.transaction();
        try {
            // Find product
            const product = await Product_1.Product.findByPk(data.product_id, {
                transaction: dbTransaction,
                lock: true, // Lock row for update
            });
            if (!product) {
                throw Object.assign(new Error('Product not found'), { statusCode: 404 });
            }
            if (!product.is_active) {
                throw Object.assign(new Error('Product is inactive'), { statusCode: 400 });
            }
            // Check stock for outgoing transactions
            if (data.type === 'out') {
                if (product.quantity < data.quantity) {
                    throw Object.assign(new Error(`Insufficient stock. Available: ${product.quantity}`), { statusCode: 400 });
                }
            }
            // Use provided unit price or product's current price
            const unitPrice = data.unit_price || product.unit_price;
            // Create transaction
            const transaction = await Transaction_1.Transaction.create({
                ...data,
                unit_price: unitPrice,
                created_by: userId,
                status: data.status || 'completed',
            }, { transaction: dbTransaction });
            // Update product quantity if transaction is completed
            if (transaction.status === 'completed') {
                const quantityChange = data.type === 'in' ? data.quantity : -data.quantity;
                await product.update({
                    quantity: product.quantity + quantityChange,
                }, { transaction: dbTransaction });
            }
            await dbTransaction.commit();
            // Reload to get associations
            await transaction.reload({
                include: [
                    { model: Product_1.Product, attributes: ['id', 'sku', 'name'] },
                ],
            });
            return transaction;
        }
        catch (error) {
            await dbTransaction.rollback();
            throw error;
        }
    }
    static async cancelTransaction(id) {
        const dbTransaction = await database_1.default.transaction();
        try {
            const transaction = await Transaction_1.Transaction.findByPk(id, {
                transaction: dbTransaction,
            });
            if (!transaction) {
                throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
            }
            if (transaction.status === 'cancelled') {
                throw Object.assign(new Error('Transaction is already cancelled'), { statusCode: 400 });
            }
            if (transaction.status === 'completed') {
                // Reverse the inventory change
                const product = await Product_1.Product.findByPk(transaction.product_id, {
                    transaction: dbTransaction,
                    lock: true,
                });
                if (product) {
                    const reverseQuantity = transaction.type === 'in'
                        ? -transaction.quantity
                        : transaction.quantity;
                    await product.update({
                        quantity: product.quantity + reverseQuantity,
                    }, { transaction: dbTransaction });
                }
            }
            await transaction.update({ status: 'cancelled' }, { transaction: dbTransaction });
            await dbTransaction.commit();
            return transaction;
        }
        catch (error) {
            await dbTransaction.rollback();
            throw error;
        }
    }
    static async getProductTransactions(productId, limit = 50) {
        const transactions = await Transaction_1.Transaction.findAll({
            where: { product_id: productId },
            include: [
                {
                    model: User_1.User,
                    as: 'creator',
                    attributes: ['id', 'username'],
                },
            ],
            order: [['created_at', 'DESC']],
            limit,
        });
        return transactions;
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transactionService.js.map