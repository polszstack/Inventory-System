"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_1.AuthMiddleware.authenticate);
// Admin only routes
router.get('/', auth_1.AuthMiddleware.authorize('admin'), userController_1.UserController.getAllUsers);
// User routes
router.get('/:id', userController_1.UserController.getUser);
router.put('/:id', userController_1.UserController.updateUser);
// Admin only
router.delete('/:id', auth_1.AuthMiddleware.authorize('admin'), userController_1.UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map