"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.post('/login', validate_1.ValidateMiddleware.validate(validators_1.Validators.login), authController_1.AuthController.login);
router.post('/register', validate_1.ValidateMiddleware.validate(validators_1.Validators.register), authController_1.AuthController.register);
router.get('/profile', auth_1.AuthMiddleware.authenticate, authController_1.AuthController.getProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map