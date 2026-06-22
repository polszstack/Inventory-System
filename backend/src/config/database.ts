import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Category from '../models/Category';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import User from '../models/User';

// Load environment variables
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'inventory_system',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialect: 'mysql',
  models: [Category, Product, Transaction, User], // Explicitly pass models
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

export default sequelize;