import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidateMiddleware } from '../middleware/validate';
import { Validators } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/low-stock', ProductController.getLowStockProducts);
router.get('/:id', ProductController.getProduct);

// Protected routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'manager'),
  ValidateMiddleware.validate(Validators.createProduct),
  ProductController.createProduct
);

router.put(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'manager'),
  ValidateMiddleware.validate(Validators.updateProduct),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ProductController.deleteProduct
);

export default router;