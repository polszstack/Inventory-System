import { Product } from '../models/Product';
import { CreateProductDTO } from '../types/index';
import { UpdateProductDTO } from '../types/index';
import { ProductFilters } from '../types/index';
export declare class ProductService {
    static getProducts(filters: ProductFilters): Promise<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static getProduct(id: number): Promise<Product>;
    static createProduct(data: CreateProductDTO): Promise<Product>;
    static updateProduct(id: number, data: UpdateProductDTO): Promise<Product>;
    static deleteProduct(id: number): Promise<{
        message: string;
    }>;
    static hardDeleteProduct(id: number): Promise<{
        message: string;
    }>;
    static getLowStockProducts(): Promise<Product[]>;
}
//# sourceMappingURL=productService.d.ts.map