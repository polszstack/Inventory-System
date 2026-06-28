import { Request, Response, NextFunction } from 'express';
export declare class CategoryController {
    static getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static createCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteCategory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=categoryController.d.ts.map