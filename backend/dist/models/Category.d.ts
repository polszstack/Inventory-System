import 'reflect-metadata';
import { Model } from 'sequelize-typescript';
import { Product } from './Product';
export declare class Category extends Model {
    id: number;
    name: string;
    description: string | null;
    products: Product[];
    created_at: Date;
    updated_at: Date;
    static trimName(instance: Category): void;
}
export default Category;
//# sourceMappingURL=Category.d.ts.map