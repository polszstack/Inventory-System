import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class UserController {
    static getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=userController.d.ts.map