import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transactionService';
import { AuthRequest } from '../types';
import { ResponseUtil } from '../utils/response';

export class TransactionController {
  static async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TransactionService.getTransactions(req.query);
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
      const transaction = await TransactionService.createTransaction(
        req.body,
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