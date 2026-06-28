"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.UserRole = exports.TransactionStatus = exports.TransactionType = exports.User = exports.Transaction = exports.Product = exports.Category = void 0;
// Export all models with default exports
var Category_1 = require("./Category");
Object.defineProperty(exports, "Category", { enumerable: true, get: function () { return __importDefault(Category_1).default; } });
var Product_1 = require("./Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return __importDefault(Product_1).default; } });
var Transaction_1 = require("./Transaction");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return __importDefault(Transaction_1).default; } });
var User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(User_1).default; } });
// Re-export types
var Transaction_2 = require("./Transaction");
Object.defineProperty(exports, "TransactionType", { enumerable: true, get: function () { return Transaction_2.TransactionType; } });
Object.defineProperty(exports, "TransactionStatus", { enumerable: true, get: function () { return Transaction_2.TransactionStatus; } });
var User_2 = require("./User");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return User_2.UserRole; } });
// Import all models for associations
const Category_2 = __importDefault(require("./Category"));
const Product_2 = __importDefault(require("./Product"));
const Transaction_3 = __importDefault(require("./Transaction"));
const User_3 = __importDefault(require("./User"));
// All associations are already defined through decorators
exports.models = {
    Category: Category_2.default,
    Product: Product_2.default,
    Transaction: Transaction_3.default,
    User: User_3.default,
};
//# sourceMappingURL=index.js.map