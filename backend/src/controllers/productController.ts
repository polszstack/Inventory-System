 import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ResponseUtil } from '../utils/response';

export class ProductController {
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProducts(req.query);
      ResponseUtil.paginated(
        res,
        result.products,
        result.total,
        result.page,
        result.totalPages,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProduct(Number(req.params.id));
      ResponseUtil.success(res, product, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      ResponseUtil.created(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(
        Number(req.params.id),
        req.body
      );
      ResponseUtil.success(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.deleteProduct(Number(req.params.id));
      ResponseUtil.success(res, result, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getLowStockProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getLowStockProducts();
      ResponseUtil.success(res, products, 'Low stock products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}