import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    meta?: any
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    
    if (meta) {
      response.meta = meta;
    }
    
    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: error || message,
    };
    
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string = 'Bad Request'): Response {
    return this.error(res, message, 400);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Not Found'): Response {
    return this.error(res, message, 404);
  }

  static validationError(
    res: Response,
    errors: any[],
    message: string = 'Validation Error'
  ): Response {
    return res.status(422).json({
      success: false,
      message,
      errors,
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    return this.success(res, data, message, 200, {
      page,
      limit,
      total,
      totalPages,
    });
  }
}