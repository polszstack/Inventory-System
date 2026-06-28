"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    static async login(data) {
        const { username, password } = data;
        const user = await User_1.User.findOne({
            where: {
                ...(username.includes('@')
                    ? { email: username.toLowerCase() }
                    : { username: username }),
            },
        });
        if (!user) {
            throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
        }
        if (!user.password_hash) {
            await user.destroy();
            throw Object.assign(new Error('Account was corrupted. Please register again.'), { statusCode: 400 });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
        }
        if (!user.is_active) {
            throw Object.assign(new Error('Account is deactivated'), { statusCode: 403 });
        }
        await user.updateLastLogin();
        const tokens = auth_1.AuthMiddleware.generateTokens(user.id, user.role);
        return {
            user: user.toSafeObject(),
            tokens,
        };
    }
    static async register(data) {
        // Check if user already exists
        const existingUser = await User_1.User.findOne({
            where: {
                ...(data.email ? { email: data.email.toLowerCase() } : {}),
                ...(data.username ? { username: data.username } : {}),
            },
        });
        if (existingUser) {
            // If existing user has NULL password, delete it
            if (!existingUser.password_hash) {
                await existingUser.destroy();
            }
            else {
                const field = existingUser.email === data.email?.toLowerCase() ? 'Email' : 'Username';
                throw Object.assign(new Error(`${field} already exists`), { statusCode: 409 });
            }
        }
        // ✅ Hash password manually before creating user
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
        // Create user with pre-hashed password
        const user = await User_1.User.create({
            username: data.username,
            email: data.email,
            password_hash: hashedPassword,
            role: data.role || 'staff',
        });
        console.log('✅ User created with hash:', hashedPassword.substring(0, 20) + '...');
        const tokens = auth_1.AuthMiddleware.generateTokens(user.id, user.role);
        return {
            user: user.toSafeObject(),
            tokens,
        };
    }
    static async getProfile(userId) {
        const user = await User_1.User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] },
        });
        if (!user) {
            throw Object.assign(new Error('User not found'), { statusCode: 404 });
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map