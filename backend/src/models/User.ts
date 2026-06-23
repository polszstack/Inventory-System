import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  BeforeCreate,
  BeforeUpdate,
  Default,
} from 'sequelize-typescript';
import { Transaction } from './Transaction';
import bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
}

@Table({
  tableName: 'users',
  timestamps: true,
  updatedAt: false,
})
export class User extends Model {
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
        msg: 'Username cannot be empty',
      },
      len: {
        args: [3, 50],
        msg: 'Username must be between 3 and 50 characters',
      },
    },
  })
  username!: string;

  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address',
      },
      notEmpty: {
        msg: 'Email cannot be empty',
      },
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'password_hash',
  })
  password_hash!: string;

  // ✅ ADD THIS: Virtual column for password
  @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  password?: string;

  @Default(UserRole.STAFF)
  @Column({
    type: DataType.ENUM(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF),
    defaultValue: UserRole.STAFF,
    validate: {
      isIn: {
        args: [[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]],
        msg: 'Invalid user role',
      },
    },
  })
  role!: UserRole;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
    defaultValue: true,
  })
  is_active!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login',
  })
  last_login!: Date | null;

  @HasMany(() => Transaction, 'created_by')
  transactions!: Transaction[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: Date;

  // Instance methods
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password_hash);
  }

  async updateLastLogin(): Promise<void> {
    this.last_login = new Date();
    await this.save();
  }

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    console.log('🔍 Hook triggered, password:', instance.password ? 'YES' : 'NO');
    
    if (instance.password) {
      const salt = await bcrypt.genSalt(10);
      instance.password_hash = await bcrypt.hash(instance.password, salt);
      console.log('✅ Password hashed:', instance.password_hash.substring(0, 20) + '...');
    }
    
    if (instance.email) {
      instance.email = instance.email.toLowerCase().trim();
    }
    
    if (instance.username) {
      instance.username = instance.username.trim();
    }
  }

  // Helper method to return user data without sensitive info
  toSafeObject(): Partial<User> {
    const { password_hash, password, ...userWithoutPassword } = this.toJSON();
    return userWithoutPassword;
  }
}

export default User;