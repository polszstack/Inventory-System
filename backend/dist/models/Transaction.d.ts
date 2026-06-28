import { Model } from 'sequelize-typescript';
import { Product } from './Product';
import { User } from './User';
export declare enum TransactionType {
    IN = "in",
    OUT = "out"
}
export declare enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Transaction extends Model {
    id: number;
    product_id: number;
    product: Product;
    type: TransactionType;
    quantity: number;
    unit_price: number | null;
    reference: string | null;
    notes: string | null;
    created_by: number | null;
    creator: User;
    status: TransactionStatus;
    created_at: Date;
    get totalAmount(): number | null;
    get isStockIn(): boolean;
    get isStockOut(): boolean;
    static validateTransaction(instance: Transaction): Promise<void>;
}
export default Transaction;
//# sourceMappingURL=Transaction.d.ts.map