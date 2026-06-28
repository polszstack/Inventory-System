import { Response } from 'express';
export declare class ResponseUtil {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: any): Response;
    static created<T>(res: Response, data: T, message?: string): Response;
    static error(res: Response, message?: string, statusCode?: number, error?: string): Response;
    static badRequest(res: Response, message?: string): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static notFound(res: Response, message?: string): Response;
    static validationError(res: Response, errors: any[], message?: string): Response;
    static paginated<T>(res: Response, data: T[], total: number, page: number, limit: number, message?: string): Response;
}
//# sourceMappingURL=response.d.ts.map