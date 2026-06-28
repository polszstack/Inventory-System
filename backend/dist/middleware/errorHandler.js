"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const sequelize_1 = require("sequelize");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
class ErrorHandler {
}
exports.ErrorHandler = ErrorHandler;
ErrorHandler.handle = (error, req, res, next) => {
    logger_1.default.error('Error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });
    // Sequelize Validation Error
    if (error instanceof sequelize_1.ValidationError) {
        const messages = error.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return response_1.ResponseUtil.validationError(res, messages, 'Validation Error');
    }
    // Custom error with status code
    if ('statusCode' in error) {
        const statusCode = error.statusCode;
        return response_1.ResponseUtil.error(res, error.message, statusCode);
    }
    // Default error
    const statusCode = 500;
    const message = process.env.NODE_ENV === 'development'
        ? error.message
        : 'Internal Server Error';
    return response_1.ResponseUtil.error(res, message, statusCode);
};
//# sourceMappingURL=errorHandler.js.map