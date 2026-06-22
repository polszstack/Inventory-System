import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { ResponseUtil } from '../utils/response';

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows: users } = await User.findAndCountAll({
        attributes: { exclude: ['password_hash'] },
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']],
      });

      ResponseUtil.paginated(
        res,
        users,
        count,
        Number(page),
        Math.ceil(count / Number(limit)),
        'Users retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password_hash'] },
      });

      if (!user) {
        return ResponseUtil.notFound(res, 'User not found');
      }

      ResponseUtil.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Only allow users to update their own profile (or admin can update anyone)
      if (req.user!.role !== 'admin' && req.user!.id !== Number(req.params.id)) {
        return ResponseUtil.forbidden(res, 'You can only update your own profile');
      }

      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return ResponseUtil.notFound(res, 'User not found');
      }

      // Don't allow role updates unless admin
      if (req.body.role && req.user!.role !== 'admin') {
        delete req.body.role;
      }

      await user.update(req.body);
      
      ResponseUtil.success(
        res,
        user.toSafeObject(),
        'User updated successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return ResponseUtil.notFound(res, 'User not found');
      }

      // Soft delete - deactivate user
      await user.update({ is_active: false });
      
      ResponseUtil.success(res, null, 'User deactivated successfully');
    } catch (error) {
      next(error);
    }
  }
}