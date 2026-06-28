"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
// Public routes
router.get('/', categoryController_1.CategoryController.getAllCategories);
router.get('/:id', categoryController_1.CategoryController.getCategory);
// Protected routes
router.post('/', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.authorize('admin', 'manager'), validate_1.ValidateMiddleware.validate(validators_1.Validators.createCategory), categoryController_1.CategoryController.createCategory);
router.put('/:id', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.authorize('admin', 'manager'), validate_1.ValidateMiddleware.validate(validators_1.Validators.updateCategory), categoryController_1.CategoryController.updateCategory);
router.delete('/:id', auth_1.AuthMiddleware.authenticate, auth_1.AuthMiddleware.authorize('admin'), categoryController_1.CategoryController.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map