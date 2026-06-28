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
exports.Product = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Category_1 = require("./Category");
const Transaction_1 = require("./Transaction");
let Product = class Product extends sequelize_typescript_1.Model {
    // Virtual fields
    get stockStatus() {
        if (this.quantity <= 0)
            return 'out_of_stock';
        if (this.quantity <= this.reorder_level)
            return 'low_stock';
        return 'in_stock';
    }
    get inventoryValue() {
        return this.quantity * this.unit_price;
    }
    static validateAndTransform(instance) {
        // Trim strings
        if (instance.name)
            instance.name = instance.name.trim();
        if (instance.sku)
            instance.sku = instance.sku.trim().toUpperCase();
        // Ensure quantity is not negative
        if (instance.quantity < 0) {
            throw new Error('Quantity cannot be negative');
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
], Product.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
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
    }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
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
    }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Product.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Category_1.Category),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        field: 'category_id',
    }),
    __metadata("design:type", Object)
], Product.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Category_1.Category),
    __metadata("design:type", Category_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Quantity cannot be negative',
            },
        },
    }),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Unit price cannot be negative',
            },
        },
    }),
    __metadata("design:type", Number)
], Product.prototype, "unit_price", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(10),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'reorder_level',
        validate: {
            min: {
                args: [0],
                msg: 'Reorder level cannot be negative',
            },
        },
    }),
    __metadata("design:type", Number)
], Product.prototype, "reorder_level", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        field: 'is_active',
    }),
    __metadata("design:type", Boolean)
], Product.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_1.Transaction),
    __metadata("design:type", Array)
], Product.prototype, "transactions", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], Product.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], Product.prototype, "updated_at", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Product]),
    __metadata("design:returntype", void 0)
], Product, "validateAndTransform", null);
Product = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'products',
        timestamps: true,
    })
], Product);
exports.Product = Product;
// Keep all existing code above, just add this at the end:
exports.default = Product;
//# sourceMappingURL=Product.js.map