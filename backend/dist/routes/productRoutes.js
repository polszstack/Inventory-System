"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
// Public routes
router.get('/', productController_1.ProductController.getAllProducts);
router.get('/low-stock', productController_1.ProductController.getLowStockProducts);
router.get('/:id', productController_1.ProductController.getProduct);
// Protected routes
router.post('/', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.authorize('admin', 'manager'), validate_1.ValidateMiddleware.validate(validators_1.Validators.createProduct), productController_1.ProductController.createProduct);
router.put('/:id', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.authorize('admin', 'manager'), validate_1.ValidateMiddleware.validate(validators_1.Validators.updateProduct), productController_1.ProductController.updateProduct);
router.delete('/:id', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.authorize('admin'), productController_1.ProductController.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map