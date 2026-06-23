import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transactionService';
import { AuthRequest, TransactionFilters } from '../types';
import { ResponseUtil } from '../utils/response';

export class TransactionController {
  static async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Parse query parameters to correct types
      const filters: TransactionFilters = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sort: req.query.sort as string || 'created_at',
        order: (req.query.order as 'ASC' | 'DESC') || 'DESC',
        product_id: req.query.product_id ? Number(req.query.product_id) : undefined,
        type: req.query.type as 'in' | 'out' | undefined,
        status: req.query.status as 'pending' | 'completed' | 'cancelled' | undefined,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        created_by: req.query.created_by ? Number(req.query.created_by) : undefined,
      };

      const result = await TransactionService.getTransactions(filters);
      ResponseUtil.paginated(
        res,
        result.transactions,
        result.total,
        result.page,
        result.totalPages,
        'Transactions retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await TransactionService.getTransaction(
        Number(req.params.id)
      );
      ResponseUtil.success(res, transaction, 'Transaction retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // ✅ Ensure numeric values
      const data = {
        ...req.body,
        product_id: Number(req.body.product_id),
        quantity: Number(req.body.quantity),
        unit_price: req.body.unit_price ? Number(req.body.unit_price) : undefined,
      };

      const transaction = await TransactionService.createTransaction(
        data,
        req.userId
      );
      ResponseUtil.created(res, transaction, 'Transaction created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async cancelTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await TransactionService.cancelTransaction(
        Number(req.params.id)
      );
      ResponseUtil.success(res, transaction, 'Transaction cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getProductTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await TransactionService.getProductTransactions(
        Number(req.params.productId)
      );
      ResponseUtil.success(
        res,
        transactions,
        'Product transactions retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}