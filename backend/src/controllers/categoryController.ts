import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ResponseUtil } from '../utils/response';

export class CategoryController {
  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: categories } = await Category.findAndCountAll({
        include: [
          {
            model: Product,
            attributes: ['id'],
          },
        ],
        limit: Number(limit),
        offset,
        order: [['name', 'ASC']],
      });

      ResponseUtil.paginated(
        res,
        categories,
        count,
        Number(page),
        Math.ceil(count / Number(limit)),
        'Categories retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [
          {
            model: Product,
            attributes: ['id', 'sku', 'name', 'quantity', 'unit_price'],
          },
        ],
      });

      if (!category) {
        return ResponseUtil.notFound(res, 'Category not found');
      }

      ResponseUtil.success(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      // Check for duplicate name
      const existingCategory = await Category.findOne({ where: { name } });
      if (existingCategory) {
        return ResponseUtil.badRequest(res, 'Category name already exists');
      }

      const category = await Category.create(req.body);
      ResponseUtil.created(res, category, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await Category.findByPk(req.params.id);
      
      if (!category) {
        return ResponseUtil.notFound(res, 'Category not found');
      }

      // Check for duplicate name if name is being updated
      if (req.body.name && req.body.name !== category.name) {
        const duplicate = await Category.findOne({
          where: { name: req.body.name },
        });
        
        if (duplicate) {
          return ResponseUtil.badRequest(res, 'Category name already exists');
        }
      }

      await category.update(req.body);
      ResponseUtil.success(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await Category.findByPk(req.params.id);
      
      if (!category) {
        return ResponseUtil.notFound(res, 'Category not found');
      }

      // Check if category has products
      const productCount = await Product.count({
        where: { category_id: req.params.id },
      });

      if (productCount > 0) {
        return ResponseUtil.badRequest(
          res,
          'Cannot delete category with associated products. Remove or reassign products first.'
        );
      }

      await category.destroy();
      ResponseUtil.success(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}