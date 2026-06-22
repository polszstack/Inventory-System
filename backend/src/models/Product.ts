 import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { Category } from './Category';
import { Transaction } from './Transaction';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'SKU cannot be empty',
      },
      len: {
        args: [3, 50],
        msg: 'SKU must be between 3 and 50 characters',
      },
    },
  })
  sku!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name cannot be empty',
      },
      len: {
        args: [2, 200],
        msg: 'Product name must be between 2 and 200 characters',
      },
    },
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string | null;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'category_id',
  })
  category_id!: number | null;

  @BelongsTo(() => Category)
  category!: Category;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Quantity cannot be negative',
      },
    },
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Unit price cannot be negative',
      },
    },
  })
  unit_price!: number;

  @Default(10)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'reorder_level',
    validate: {
      min: {
        args: [0],
        msg: 'Reorder level cannot be negative',
      },
    },
  })
  reorder_level!: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
  })
  is_active!: boolean;

  @HasMany(() => Transaction)
  transactions!: Transaction[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updated_at!: Date;

  // Virtual fields
  get stockStatus(): 'out_of_stock' | 'low_stock' | 'in_stock' {
    if (this.quantity <= 0) return 'out_of_stock';
    if (this.quantity <= this.reorder_level) return 'low_stock';
    return 'in_stock';
  }

  get inventoryValue(): number {
    return this.quantity * this.unit_price;
  }

  @BeforeCreate
  @BeforeUpdate
  static validateAndTransform(instance: Product) {
    // Trim strings
    if (instance.name) instance.name = instance.name.trim();
    if (instance.sku) instance.sku = instance.sku.trim().toUpperCase();
    
    // Ensure quantity is not negative
    if (instance.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
  }
}
// Keep all existing code above, just add this at the end:
export default Product;