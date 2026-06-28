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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Transaction_1 = require("./Transaction");
const bcrypt_1 = __importDefault(require("bcrypt"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["STAFF"] = "staff";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
let User = class User extends sequelize_typescript_1.Model {
    // Instance methods
    async comparePassword(candidatePassword) {
        return bcrypt_1.default.compare(candidatePassword, this.password_hash);
    }
    async updateLastLogin() {
        this.last_login = new Date();
        await this.save();
    }
    // Hooks
    static async hashPassword(instance) {
        console.log('🔍 Hook triggered, password:', instance.password ? 'YES' : 'NO');
        if (instance.password) {
            const salt = await bcrypt_1.default.genSalt(10);
            instance.password_hash = await bcrypt_1.default.hash(instance.password, salt);
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
    toSafeObject() {
        const { password_hash, password, ...userWithoutPassword } = this.toJSON();
        return userWithoutPassword;
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
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
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
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
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        field: 'password_hash',
    }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(UserRole.STAFF),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF),
        defaultValue: UserRole.STAFF,
        validate: {
            isIn: {
                args: [[UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]],
                msg: 'Invalid user role',
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        field: 'is_active',
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'last_login',
    }),
    __metadata("design:type", Object)
], User.prototype, "last_login", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Transaction_1.Transaction, 'created_by'),
    __metadata("design:type", Array)
], User.prototype, "transactions", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'created_at',
    }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
        updatedAt: false,
    })
], User);
exports.User = User;
exports.default = User;
//# sourceMappingURL=User.js.map