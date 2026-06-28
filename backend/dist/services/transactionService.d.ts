import { Transaction } from '../models/Transaction';
import { CreateTransactionDTO, TransactionFilters } from '../types';
export declare class TransactionService {
    static getTransactions(filters: TransactionFilters): Promise<{
        transactions: Transaction[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getTransaction(id: number): Promise<Transaction>;
    static createTransaction(data: CreateTransactionDTO, userId?: number): Promise<Transaction>;
    static cancelTransaction(id: number): Promise<Transaction>;
    static getProductTransactions(productId: number, limit?: number): Promise<Transaction[]>;
}
//# sourceMappingURL=transactionService.d.ts.map