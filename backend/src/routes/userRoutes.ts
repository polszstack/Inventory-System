import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(AuthMiddleware.authenticate);

// Admin only routes
router.get(
  '/',
  AuthMiddleware.authorize('admin'),
  UserController.getAllUsers
);

// User routes
router.get('/:id', UserController.getUser);
router.put('/:id', UserController.updateUser);

// Admin only
router.delete(
  '/:id',
  AuthMiddleware.authorize('admin'),
  UserController.deleteUser
);

export default router;