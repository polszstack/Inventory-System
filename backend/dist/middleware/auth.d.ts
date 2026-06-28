import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare class AuthMiddleware {
    static authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    static authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    private static extractToken;
    static generateTokens(userId: number, role: string): {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
}
//# sourceMappingURL=auth.d.ts.map