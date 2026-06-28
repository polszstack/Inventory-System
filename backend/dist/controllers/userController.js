"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
class UserController {
    static async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const { count, rows: users } = await User_1.User.findAndCountAll({
                attributes: { exclude: ['password_hash'] },
                limit: Number(limit),
                offset,
                order: [['created_at', 'DESC']],
            });
            response_1.ResponseUtil.paginated(res, users, count, Number(page), Math.ceil(count / Number(limit)), 'Users retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getUser(req, res, next) {
        try {
            const user = await User_1.User.findByPk(req.params.id, {
                attributes: { exclude: ['password_hash'] },
            });
            if (!user) {
                return response_1.ResponseUtil.notFound(res, 'User not found');
            }
            response_1.ResponseUtil.success(res, user, 'User retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateUser(req, res, next) {
        try {
            // Only allow users to update their own profile (or admin can update anyone)
            if (req.user.role !== 'admin' && req.user.id !== Number(req.params.id)) {
                return response_1.ResponseUtil.forbidden(res, 'You can only update your own profile');
            }
            const user = await User_1.User.findByPk(req.params.id);
            if (!user) {
                return response_1.ResponseUtil.notFound(res, 'User not found');
            }
            // Don't allow role updates unless admin
            if (req.body.role && req.user.role !== 'admin') {
                delete req.body.role;
            }
            await user.update(req.body);
            response_1.ResponseUtil.success(res, user.toSafeObject(), 'User updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteUser(req, res, next) {
        try {
            const user = await User_1.User.findByPk(req.params.id);
            if (!user) {
                return response_1.ResponseUtil.notFound(res, 'User not found');
            }
            // Soft delete - deactivate user
            await user.update({ is_active: false });
            response_1.ResponseUtil.success(res, null, 'User deactivated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map