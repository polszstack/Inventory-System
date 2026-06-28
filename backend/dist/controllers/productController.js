"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const productService_1 = require("../services/productService");
const response_1 = require("../utils/response");
class ProductController {
    static async getAllProducts(req, res, next) {
        try {
            // ✅ Parse query parameters to correct types
            const filters = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sort: req.query.sort || 'created_at',
                order: req.query.order || 'DESC',
                search: req.query.search,
                category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
                is_active: req.query.is_active !== undefined && req.query.is_active !== ''
                    ? req.query.is_active === 'true'
                    : undefined,
                low_stock: req.query.low_stock === 'true',
                min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
                max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
            };
            const result = await productService_1.ProductService.getProducts(filters);
            response_1.ResponseUtil.paginated(res, result.products, result.total, result.page, result.totalPages, 'Products retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getProduct(req, res, next) {
        try {
            const product = await productService_1.ProductService.getProduct(Number(req.params.id));
            response_1.ResponseUtil.success(res, product, 'Product retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async createProduct(req, res, next) {
        try {
            // ✅ Ensure numeric values are numbers
            const data = {
                ...req.body,
                quantity: Number(req.body.quantity) || 0,
                unit_price: Number(req.body.unit_price),
                reorder_level: Number(req.body.reorder_level) || 10,
                category_id: req.body.category_id ? Number(req.body.category_id) : undefined,
            };
            const product = await productService_1.ProductService.createProduct(data);
            response_1.ResponseUtil.created(res, product, 'Product created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            // ✅ Ensure numeric values are numbers
            const data = { ...req.body };
            if (data.unit_price !== undefined)
                data.unit_price = Number(data.unit_price);
            if (data.reorder_level !== undefined)
                data.reorder_level = Number(data.reorder_level);
            if (data.category_id !== undefined)
                data.category_id = Number(data.category_id);
            const product = await productService_1.ProductService.updateProduct(Number(req.params.id), data);
            response_1.ResponseUtil.success(res, product, 'Product updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            const result = await productService_1.ProductService.deleteProduct(Number(req.params.id));
            response_1.ResponseUtil.success(res, result, 'Product deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getLowStockProducts(req, res, next) {
        try {
            const products = await productService_1.ProductService.getLowStockProducts();
            response_1.ResponseUtil.success(res, products, 'Low stock products retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=productController.js.map