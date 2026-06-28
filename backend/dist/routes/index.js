"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const transactionRoutes_1 = __importDefault(require("./transactionRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/products', productRoutes_1.default);
router.use('/categories', categoryRoutes_1.default);
router.use('/transactions', transactionRoutes_1.default);
router.use('/users', userRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map