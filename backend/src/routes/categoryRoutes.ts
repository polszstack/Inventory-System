import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidateMiddleware } from '../middleware/validate';
import { Validators } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategory);

// Protected routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'manager'),
  ValidateMiddleware.validate(Validators.createCategory),
  CategoryController.createCategory
);

router.put(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'manager'),
  ValidateMiddleware.validate(Validators.updateCategory),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  CategoryController.deleteCategory
);

export default router;