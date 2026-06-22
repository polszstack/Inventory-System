import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidateMiddleware } from '../middleware/validate';
import { Validators } from '../utils/validators';

const router = Router();

router.post(
  '/login',
  ValidateMiddleware.validate(Validators.login),
  AuthController.login
);

router.post(
  '/register',
  ValidateMiddleware.validate(Validators.register),
  AuthController.register
);

router.get(
  '/profile',
  AuthMiddleware.authenticate,
  AuthController.getProfile
);

export default router;