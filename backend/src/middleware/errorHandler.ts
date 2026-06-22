import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';
import { ResponseUtil } from '../utils/response';
import logger from '../utils/logger';

export class ErrorHandler {
  static handle = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.error('Error:', {
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    });

    // Sequelize Validation Error
    if (error instanceof ValidationError) {
      const messages = error.errors.map((e) => ({
        field: e.path,
        message: e.message,
      }));
      
      return ResponseUtil.validationError(res, messages, 'Validation Error');
    }

    // Custom error with status code
    if ('statusCode' in error) {
      const statusCode = (error as any).statusCode;
      return ResponseUtil.error(res, error.message, statusCode);
    }

    // Default error
    const statusCode = 500;
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal Server Error';

    return ResponseUtil.error(res, message, statusCode);
  };
}