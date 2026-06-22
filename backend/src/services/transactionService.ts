import { Transaction, TransactionType, TransactionStatus } from '../models/Transaction';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Op } from 'sequelize';
import { CreateTransactionDTO, TransactionFilters } from '../types';
import sequelize from '../config/database';

export class TransactionService {
  static async getTransactions(filters: TransactionFilters) {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC',
      product_id,
      type,
      status,
      start_date,
      end_date,
      created_by,
    } = filters;

    const offset = (page - 1) * limit;
    const where: any = {};

    if (product_id) where.product_id = product_id;
    if (type) where.type = type;
    if (status) where.status = status;
    if (created_by) where.created_by = created_by;

    // Date range filter
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = new Date(start_date);
      if (end_date) where.created_at[Op.lte] = new Date(end_date);
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          attributes: ['id', 'sku', 'name'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
      order: [[sort, order]],
      limit,
      offset,
    });

    return {
      transactions,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  static async getTransaction(id: number) {
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'sku', 'name', 'unit_price'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
    });

    if (!transaction) {
      throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
    }

    return transaction;
  }

  static async createTransaction(data: CreateTransactionDTO, userId?: number) {
    // Use transaction to ensure data consistency
    const dbTransaction = await sequelize.transaction();

    try {
      // Find product
      const product = await Product.findByPk(data.product_id, {
        transaction: dbTransaction,
        lock: true, // Lock row for update
      });

      if (!product) {
        throw Object.assign(new Error('Product not found'), { statusCode: 404 });
      }

      if (!product.is_active) {
        throw Object.assign(new Error('Product is inactive'), { statusCode: 400 });
      }

      // Check stock for outgoing transactions
      if (data.type === 'out') {
        if (product.quantity < data.quantity) {
          throw Object.assign(
            new Error(`Insufficient stock. Available: ${product.quantity}`),
            { statusCode: 400 }
          );
        }
      }

      // Use provided unit price or product's current price
      const unitPrice = data.unit_price || product.unit_price;

      // Create transaction
      const transaction = await Transaction.create(
        {
          ...data,
          unit_price: unitPrice,
          created_by: userId,
          status: data.status || 'completed',
        },
        { transaction: dbTransaction }
      );

      // Update product quantity if transaction is completed
      if (transaction.status === 'completed') {
        const quantityChange = data.type === 'in' ? data.quantity : -data.quantity;
        await product.update(
          {
            quantity: product.quantity + quantityChange,
          },
          { transaction: dbTransaction }
        );
      }

      await dbTransaction.commit();

      // Reload to get associations
      await transaction.reload({
        include: [
          { model: Product, attributes: ['id', 'sku', 'name'] },
        ],
      });

      return transaction;
    } catch (error) {
      await dbTransaction.rollback();
      throw error;
    }
  }

  static async cancelTransaction(id: number) {
    const dbTransaction = await sequelize.transaction();

    try {
      const transaction = await Transaction.findByPk(id, {
        transaction: dbTransaction,
      });

      if (!transaction) {
        throw Object.assign(new Error('Transaction not found'), { statusCode: 404 });
      }

      if (transaction.status === 'cancelled') {
        throw Object.assign(new Error('Transaction is already cancelled'), { statusCode: 400 });
      }

      if (transaction.status === 'completed') {
        // Reverse the inventory change
        const product = await Product.findByPk(transaction.product_id, {
          transaction: dbTransaction,
          lock: true,
        });

        if (product) {
          const reverseQuantity = transaction.type === 'in' 
            ? -transaction.quantity 
            : transaction.quantity;
          
          await product.update(
            {
              quantity: product.quantity + reverseQuantity,
            },
            { transaction: dbTransaction }
          );
        }
      }

      await transaction.update(
        { status: 'cancelled' },
        { transaction: dbTransaction }
      );

      await dbTransaction.commit();

      return transaction;
    } catch (error) {
      await dbTransaction.rollback();
      throw error;
    }
  }

  static async getProductTransactions(productId: number, limit: number = 50) {
    const transactions = await Transaction.findAll({
      where: { product_id: productId },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
    });

    return transactions;
  }
}