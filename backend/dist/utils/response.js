"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message = 'Success', statusCode = 200, meta) {
        const response = {
            success: true,
            message,
            data,
        };
        if (meta) {
            response.meta = meta;
        }
        return res.status(statusCode).json(response);
    }
    static created(res, data, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }
    static error(res, message = 'Internal Server Error', statusCode = 500, error) {
        const response = {
            success: false,
            message,
            error: error || message,
        };
        return res.status(statusCode).json(response);
    }
    static badRequest(res, message = 'Bad Request') {
        return this.error(res, message, 400);
    }
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }
    static notFound(res, message = 'Not Found') {
        return this.error(res, message, 404);
    }
    static validationError(res, errors, message = 'Validation Error') {
        return res.status(422).json({
            success: false,
            message,
            errors,
        });
    }
    static paginated(res, data, total, page, limit, message = 'Success') {
        const totalPages = Math.ceil(total / limit);
        return this.success(res, data, message, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.js.map