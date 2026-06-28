import { Request, Response, NextFunction } from 'express';
export declare class ErrorHandler {
    static handle: (error: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
}
//# sourceMappingURL=errorHandler.d.ts.map