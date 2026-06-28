"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
class AuthController {
    static async login(req, res, next) {
        try {
            const result = await authService_1.AuthService.login(req.body);
            response_1.ResponseUtil.success(res, result, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    static async register(req, res, next) {
        try {
            const result = await authService_1.AuthService.register(req.body);
            response_1.ResponseUtil.created(res, result, 'Registration successful');
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
        try {
            const user = await authService_1.AuthService.getProfile(req.userId);
            response_1.ResponseUtil.success(res, user, 'Profile retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map