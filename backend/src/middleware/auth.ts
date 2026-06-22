import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types';
import { ResponseUtil } from '../utils/response';

export class AuthMiddleware {
  // Verify JWT token
  static authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = AuthMiddleware.extractToken(req);
      
      if (!token) {
        return ResponseUtil.unauthorized(res, 'No token provided');
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      ) as { id: number; role: string };

      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] },
      });

      if (!user) {
        return ResponseUtil.unauthorized(res, 'User not found');
      }

      if (!user.is_active) {
        return ResponseUtil.forbidden(res, 'Account is deactivated');
      }

      req.user = user;
      req.userId = user.id;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return ResponseUtil.unauthorized(res, 'Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return ResponseUtil.unauthorized(res, 'Invalid token');
      }
      next(error);
    }
  };

  // Role-based authorization
  static authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return ResponseUtil.unauthorized(res, 'Not authenticated');
      }

      if (!roles.includes(req.user.role)) {
        return ResponseUtil.forbidden(
          res,
          'You do not have permission to perform this action'
        );
      }

      next();
    };
  };

  // Extract token from request
  private static extractToken(req: AuthRequest): string | null {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    // Check query parameter
    if (req.query.token) {
      return req.query.token as string;
    }
    
    return null;
  }

  // Generate tokens
  static generateTokens(userId: number, role: string) {
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

  const accessToken = jwt.sign(
    { id: userId, role },
    jwtSecret,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    refreshSecret,
    { expiresIn: '7d' }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 86400,
  };
}
}