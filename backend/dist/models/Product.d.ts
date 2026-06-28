import { Model } from 'sequelize-typescript';
import { Category } from './Category';
import { Transaction } from './Transaction';
export declare class Product extends Model {
    id: number;
    sku: string;
    name: string;
    description: string | null;
    category_id: number | null;
    category: Category;
    quantity: number;
    unit_price: number;
    reorder_level: number;
    is_active: boolean;
    transactions: Transaction[];
    created_at: Date;
    updated_at: Date;
    get stockStatus(): 'out_of_stock' | 'low_stock' | 'in_stock';
    get inventoryValue(): number;
    static validateAndTransform(instance: Product): void;
}
export default Product;
//# sourceMappingURL=Product.d.ts.map