import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class AuthController {
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static register(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map