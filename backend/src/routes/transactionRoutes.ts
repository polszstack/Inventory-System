import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { AuthMiddleware } from '../middleware/auth';
import { ValidateMiddleware } from '../middleware/validate';
import { Validators } from '../utils/validators';

const router = Router();

// All transaction routes require authentication
router.use(AuthMiddleware.authenticate);

router.get('/', TransactionController.getAllTransactions);
router.get('/:id', TransactionController.getTransaction);
router.get('/product/:productId', TransactionController.getProductTransactions);

router.post(
  '/',
  ValidateMiddleware.validate(Validators.createTransaction),
  TransactionController.createTransaction
);

router.patch(
  '/:id/cancel',
  AuthMiddleware.authorize('admin', 'manager'),
  TransactionController.cancelTransaction
);

export default router;