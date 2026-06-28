"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
class AuthMiddleware {
    // Extract token from request
    static extractToken(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        // Check query parameter
        if (req.query.token) {
            return req.query.token;
        }
        return null;
    }
    // Generate tokens
    static generateTokens(userId, role) {
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
        const accessToken = jsonwebtoken_1.default.sign({ id: userId, role }, jwtSecret, { expiresIn: '24h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, refreshSecret, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
            expiresIn: 86400,
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
_a = AuthMiddleware;
// Verify JWT token
AuthMiddleware.authenticate = async (req, res, next) => {
    try {
        const token = AuthMiddleware.extractToken(req);
        if (!token) {
            return response_1.ResponseUtil.unauthorized(res, 'No token provided');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User_1.User.findByPk(decoded.id, {
            attributes: { exclude: ['password_hash'] },
        });
        if (!user) {
            return response_1.ResponseUtil.unauthorized(res, 'User not found');
        }
        if (!user.is_active) {
            return response_1.ResponseUtil.forbidden(res, 'Account is deactivated');
        }
        req.user = user;
        req.userId = user.id;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return response_1.ResponseUtil.unauthorized(res, 'Token expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return response_1.ResponseUtil.unauthorized(res, 'Invalid token');
        }
        next(error);
    }
};
// Role-based authorization
AuthMiddleware.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return response_1.ResponseUtil.unauthorized(res, 'Not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            return response_1.ResponseUtil.forbidden(res, 'You do not have permission to perform this action');
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map