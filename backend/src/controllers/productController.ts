import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ResponseUtil } from '../utils/response';
import { ProductFilters } from '../types';

export class ProductController {
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Parse query parameters to correct types
      const filters: ProductFilters = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sort: req.query.sort as string || 'created_at',
        order: (req.query.order as 'ASC' | 'DESC') || 'DESC',
        search: req.query.search as string,
        category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
        is_active: req.query.is_active !== undefined && req.query.is_active !== '' 
          ? req.query.is_active === 'true' 
          : undefined,
        low_stock: req.query.low_stock === 'true',
        min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
        max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
      };

      const result = await ProductService.getProducts(filters);
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
      // ✅ Ensure numeric values are numbers
      const data = {
        ...req.body,
        quantity: Number(req.body.quantity) || 0,
        unit_price: Number(req.body.unit_price),
        reorder_level: Number(req.body.reorder_level) || 10,
        category_id: req.body.category_id ? Number(req.body.category_id) : undefined,
      };

      const product = await ProductService.createProduct(data);
      ResponseUtil.created(res, product, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // ✅ Ensure numeric values are numbers
      const data: any = { ...req.body };
      if (data.unit_price !== undefined) data.unit_price = Number(data.unit_price);
      if (data.reorder_level !== undefined) data.reorder_level = Number(data.reorder_level);
      if (data.category_id !== undefined) data.category_id = Number(data.category_id);

      const product = await ProductService.updateProduct(
        Number(req.params.id),
        data
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