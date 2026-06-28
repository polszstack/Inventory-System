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
exports.Category = void 0;
require("reflect-metadata");
const sequelize_typescript_1 = require("sequelize-typescript");
const Product_1 = require("./Product");
let Category = class Category extends sequelize_typescript_1.Model {
    static trimName(instance) {
        if (instance.name) {
            instance.name = instance.name.trim();
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
], Category.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Category name cannot be empty',
            },
            len: {
                args: [2, 100],
                msg: 'Category name must be between 2 and 100 characters',
            },
        },
    }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Category.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Product_1.Product),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], Category.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updated_at',
    }),
    __metadata("design:type", Date)
], Category.prototype, "updated_at", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Category]),
    __metadata("design:returntype", void 0)
], Category, "trimName", null);
Category = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'categories',
        timestamps: true,
    })
], Category);
exports.Category = Category;
exports.default = Category;
//# sourceMappingURL=Category.js.map