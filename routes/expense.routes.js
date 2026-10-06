import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller.js';

const router = Router();

// Every expenses route requires a valid JWT
router.use(authMiddleware);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
