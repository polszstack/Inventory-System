import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseUtil } from '../utils/response';

export class ValidateMiddleware {
  static validate(schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        return ResponseUtil.validationError(res, errors, 'Validation Error');
      }

      // Replace request data with validated data
      req[property] = value;
      next();
    };
  }

  static validateQuery(schema: Joi.ObjectSchema) {
    return ValidateMiddleware.validate(schema, 'query');
  }

  static validateParams(schema: Joi.ObjectSchema) {
    return ValidateMiddleware.validate(schema, 'params');
  }
}