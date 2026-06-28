"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
// All transaction routes require authentication
router.use(auth_1.AuthMiddleware.authenticate);
router.get('/', transactionController_1.TransactionController.getAllTransactions);
router.get('/:id', transactionController_1.TransactionController.getTransaction);
router.get('/product/:productId', transactionController_1.TransactionController.getProductTransactions);
router.post('/', validate_1.ValidateMiddleware.validate(validators_1.Validators.createTransaction), transactionController_1.TransactionController.createTransaction);
router.patch('/:id/cancel', auth_1.AuthMiddleware.authorize('admin', 'manager'), transactionController_1.TransactionController.cancelTransaction);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map