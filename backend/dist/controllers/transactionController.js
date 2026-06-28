"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transactionService_1 = require("../services/transactionService");
const response_1 = require("../utils/response");
class TransactionController {
    static async getAllTransactions(req, res, next) {
        try {
            // ✅ Parse query parameters to correct types
            const filters = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sort: req.query.sort || 'created_at',
                order: req.query.order || 'DESC',
                product_id: req.query.product_id ? Number(req.query.product_id) : undefined,
                type: req.query.type,
                status: req.query.status,
                start_date: req.query.start_date,
                end_date: req.query.end_date,
                created_by: req.query.created_by ? Number(req.query.created_by) : undefined,
            };
            const result = await transactionService_1.TransactionService.getTransactions(filters);
            response_1.ResponseUtil.paginated(res, result.transactions, result.total, result.page, result.totalPages, 'Transactions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getTransaction(req, res, next) {
        try {
            const transaction = await transactionService_1.TransactionService.getTransaction(Number(req.params.id));
            response_1.ResponseUtil.success(res, transaction, 'Transaction retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async createTransaction(req, res, next) {
        try {
            // ✅ Ensure numeric values
            const data = {
                ...req.body,
                product_id: Number(req.body.product_id),
                quantity: Number(req.body.quantity),
                unit_price: req.body.unit_price ? Number(req.body.unit_price) : undefined,
            };
            const transaction = await transactionService_1.TransactionService.createTransaction(data, req.userId);
            response_1.ResponseUtil.created(res, transaction, 'Transaction created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async cancelTransaction(req, res, next) {
        try {
            const transaction = await transactionService_1.TransactionService.cancelTransaction(Number(req.params.id));
            response_1.ResponseUtil.success(res, transaction, 'Transaction cancelled successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getProductTransactions(req, res, next) {
        try {
            const transactions = await transactionService_1.TransactionService.getProductTransactions(Number(req.params.productId));
            response_1.ResponseUtil.success(res, transactions, 'Product transactions retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transactionController.js.map