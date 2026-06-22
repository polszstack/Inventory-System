import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction';
import { Op, Sequelize } from 'sequelize';
import { CreateProductDTO } from '../types/index';
import { UpdateProductDTO } from '../types/index';
import { ProductFilters } from '../types/index';

export class ProductService {
  static async getProducts(filters: ProductFilters) {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC',
      search,
      category_id,
      is_active,
      low_stock,
      min_price,
      max_price,
    } = filters;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Category filter
    if (category_id) {
      where.category_id = category_id;
    }

    // Active filter
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // Price range filter
    if (min_price !== undefined || max_price !== undefined) {
      where.unit_price = {};
      if (min_price !== undefined) where.unit_price[Op.gte] = min_price;
      if (max_price !== undefined) where.unit_price[Op.lte] = max_price;
    }

    // Low stock filter
    if (low_stock) {
      where.quantity = { [Op.lte]: Sequelize.col('reorder_level') };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
      order: [[sort, order]],
      limit,
      offset,
    });

    return {
      products,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  static async getProduct(id: number) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: Transaction,
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!product) {
      throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    }

    return product;
  }

  static async createProduct(data: CreateProductDTO) {
    // Check if SKU already exists
    const existingProduct = await Product.findOne({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      throw Object.assign(new Error('SKU already exists'), { statusCode: 409 });
    }

    // Validate category exists if provided
    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw Object.assign(new Error('Category not found'), { statusCode: 404 });
      }
    }

    const product = await Product.create(data as any);
    return product;
  }

  static async updateProduct(id: number, data: UpdateProductDTO) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    }

    // Validate category if being updated
    if (data.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw Object.assign(new Error('Category not found'), { statusCode: 404 });
      }
    }

    await product.update(data);
    
    // Reload to get updated associations
    await product.reload({
      include: [{ model: Category }],
    });

    return product;
  }

  static async deleteProduct(id: number) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    }

    // Soft delete - deactivate instead of deleting
    await product.update({ is_active: false });
    
    return { message: 'Product deactivated successfully' };
  }

  static async hardDeleteProduct(id: number) {
    const product = await Product.findByPk(id);

    if (!product) {
      throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    }

    // Check if product has transactions
    const transactionCount = await Transaction.count({
      where: { product_id: id },
    });

    if (transactionCount > 0) {
      throw Object.assign(
        new Error('Cannot delete product with existing transactions'),
        { statusCode: 400 }
      );
    }

    await product.destroy();
    return { message: 'Product deleted permanently' };
  }

  static async getLowStockProducts() {
    const products = await Product.findAll({
      where: {
        quantity: {
          [Op.lte]: Sequelize.col('reorder_level'),
        },
        is_active: true,
      },
      include: [{ model: Category }],
      order: [['quantity', 'ASC']],
    });

    return products;
  }
}