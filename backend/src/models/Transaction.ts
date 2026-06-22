import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  BeforeCreate,
  Default,
} from 'sequelize-typescript';
import { Product } from './Product';
import { User } from './User';

export enum TransactionType {
  IN = 'in',
  OUT = 'out',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'transactions',
  timestamps: true,
  updatedAt: false, // Transactions are immutable after creation
})
export class Transaction extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'product_id',
  })
  product_id!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.ENUM(TransactionType.IN, TransactionType.OUT),
    allowNull: false,
    validate: {
      isIn: {
        args: [[TransactionType.IN, TransactionType.OUT]],
        msg: 'Transaction type must be either "in" or "out"',
      },
    },
  })
  type!: TransactionType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1',
      },
    },
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    field: 'unit_price',
    validate: {
      min: {
        args: [0],
        msg: 'Unit price cannot be negative',
      },
    },
  })
  unit_price!: number | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  reference!: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes!: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'created_by',
  })
  created_by!: number | null;

  @BelongsTo(() => User, 'created_by')
  creator!: User;

  @Default(TransactionStatus.COMPLETED)
  @Column({
    type: DataType.ENUM(
      TransactionStatus.PENDING,
      TransactionStatus.COMPLETED,
      TransactionStatus.CANCELLED
    ),
    defaultValue: TransactionStatus.COMPLETED,
  })
  status!: TransactionStatus;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: Date;

  // Virtual fields
  get totalAmount(): number | null {
    if (this.unit_price) {
      return this.quantity * this.unit_price;
    }
    return null;
  }

  get isStockIn(): boolean {
    return this.type === TransactionType.IN;
  }

  get isStockOut(): boolean {
    return this.type === TransactionType.OUT;
  }

  @BeforeCreate
  static async validateTransaction(instance: Transaction) {
    // Validate product exists and has enough stock for 'out' transactions
    if (instance.type === TransactionType.OUT) {
      const product = await Product.findByPk(instance.product_id);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.quantity < instance.quantity) {
        throw new Error(`Insufficient stock. Available: ${product.quantity}`);
      }
    }
  }
}
// Keep all existing code above, just add this at the end:
export default Transaction;