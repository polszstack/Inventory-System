"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const response_1 = require("../utils/response");
class CategoryController {
    static async getAllCategories(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const { count, rows: categories } = await Category_1.Category.findAndCountAll({
                include: [
                    {
                        model: Product_1.Product,
                        attributes: ['id'],
                    },
                ],
                limit: Number(limit),
                offset,
                order: [['name', 'ASC']],
            });
            response_1.ResponseUtil.paginated(res, categories, count, Number(page), Math.ceil(count / Number(limit)), 'Categories retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategory(req, res, next) {
        try {
            const category = await Category_1.Category.findByPk(req.params.id, {
                include: [
                    {
                        model: Product_1.Product,
                        attributes: ['id', 'sku', 'name', 'quantity', 'unit_price'],
                    },
                ],
            });
            if (!category) {
                return response_1.ResponseUtil.notFound(res, 'Category not found');
            }
            response_1.ResponseUtil.success(res, category, 'Category retrieved successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const { name } = req.body;
            // Check for duplicate name
            const existingCategory = await Category_1.Category.findOne({ where: { name } });
            if (existingCategory) {
                return response_1.ResponseUtil.badRequest(res, 'Category name already exists');
            }
            const category = await Category_1.Category.create(req.body);
            response_1.ResponseUtil.created(res, category, 'Category created successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCategory(req, res, next) {
        try {
            const category = await Category_1.Category.findByPk(req.params.id);
            if (!category) {
                return response_1.ResponseUtil.notFound(res, 'Category not found');
            }
            // Check for duplicate name if name is being updated
            if (req.body.name && req.body.name !== category.name) {
                const duplicate = await Category_1.Category.findOne({
                    where: { name: req.body.name },
                });
                if (duplicate) {
                    return response_1.ResponseUtil.badRequest(res, 'Category name already exists');
                }
            }
            await category.update(req.body);
            response_1.ResponseUtil.success(res, category, 'Category updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCategory(req, res, next) {
        try {
            const category = await Category_1.Category.findByPk(req.params.id);
            if (!category) {
                return response_1.ResponseUtil.notFound(res, 'Category not found');
            }
            // Check if category has products
            const productCount = await Product_1.Product.count({
                where: { category_id: req.params.id },
            });
            if (productCount > 0) {
                return response_1.ResponseUtil.badRequest(res, 'Cannot delete category with associated products. Remove or reassign products first.');
            }
            await category.destroy();
            response_1.ResponseUtil.success(res, null, 'Category deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=categoryController.js.map