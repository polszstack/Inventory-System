import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class TransactionController {
    static getAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createTransaction(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static cancelTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProductTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=transactionController.d.ts.map