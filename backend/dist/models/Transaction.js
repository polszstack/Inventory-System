"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionStatus = exports.TransactionType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Product_1 = require("./Product");
const User_1 = require("./User");
var TransactionType;
(function (TransactionType) {
    TransactionType["IN"] = "in";
    TransactionType["OUT"] = "out";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
let Transaction = class Transaction extends sequelize_typescript_1.Model {
    // Virtual fields
    get totalAmount() {
        if (this.unit_price) {
            return this.quantity * this.unit_price;
        }
        return null;
    }
    get isStockIn() {
        return this.type === TransactionType.IN;
    }
    get isStockOut() {
        return this.type === TransactionType.OUT;
    }
    static async validateTransaction(instance) {
        // Validate product exists and has enough stock for 'out' transactions
        if (instance.type === TransactionType.OUT) {
            const product = await Product_1.Product.findByPk(instance.product_id);
            if (!product) {
                throw new Error('Product not found');
            }
            if (product.quantity < instance.quantity) {
                throw new Error(`Insufficient stock. Available: ${product.quantity}`);
            }
        }
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Product_1.Product),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'product_id',
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "product_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Product_1.Product),
    __metadata("design:type", Product_1.Product)
], Transaction.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(TransactionType.IN, TransactionType.OUT),
        allowNull: false,
        validate: {
            isIn: {
                args: [[TransactionType.IN, TransactionType.OUT]],
                msg: 'Transaction type must be either "in" or "out"',
            },
        },
    }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Quantity must be at least 1',
            },
        },
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: true,
        field: 'unit_price',
        validate: {
            min: {
                args: [0],
                msg: 'Unit price cannot be negative',
            },
        },
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "unit_price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "reference", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'created_by',
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "created_by", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'created_by'),
    __metadata("design:type", User_1.User)
], Transaction.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(TransactionStatus.COMPLETED),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(TransactionStatus.PENDING, TransactionStatus.COMPLETED, TransactionStatus.CANCELLED),
        defaultValue: TransactionStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Transaction]),
    __metadata("design:returntype", Promise)
], Transaction, "validateTransaction", null);
Transaction = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'transactions',
        timestamps: true,
        updatedAt: false, // Transactions are immutable after creation
    })
], Transaction);
exports.Transaction = Transaction;
// Keep all existing code above, just add this at the end:
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map