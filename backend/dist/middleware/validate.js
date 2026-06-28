"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMiddleware = void 0;
const response_1 = require("../utils/response");
class ValidateMiddleware {
    static validate(schema, property = 'body') {
        return (req, res, next) => {
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
                return response_1.ResponseUtil.validationError(res, errors, 'Validation Error');
            }
            // Replace request data with validated data
            req[property] = value;
            next();
        };
    }
    static validateQuery(schema) {
        return ValidateMiddleware.validate(schema, 'query');
    }
    static validateParams(schema) {
        return ValidateMiddleware.validate(schema, 'params');
    }
}
exports.ValidateMiddleware = ValidateMiddleware;
//# sourceMappingURL=validate.js.map