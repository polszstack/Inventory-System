import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare class ValidateMiddleware {
    static validate(schema: Joi.ObjectSchema, property?: 'body' | 'query' | 'params'): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateQuery(schema: Joi.ObjectSchema): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateParams(schema: Joi.ObjectSchema): (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=validate.d.ts.map