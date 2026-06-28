import { Request, Response, NextFunction } from 'express';
export declare class ProductController {
    static getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getLowStockProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=productController.d.ts.map