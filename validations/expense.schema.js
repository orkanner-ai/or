import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '../models/expense.model.js';

// Note: there is intentionally no "user" field here.
// The owner of an expense always comes from the JWT (req.userId).
export const createExpenseSchema = z.object({
  title: z.string().trim().min(2, 'title must be at least 2 characters'),

  amount: z.number().positive('amount must be greater than 0'),

  category: z.enum(EXPENSE_CATEGORIES),

  date: z.coerce.date().optional(),

  description: z.string().trim().optional(),
});

export const updateExpenseSchema = createExpenseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

// Bonus: filtering and sorting for GET /api/expenses
export const listExpensesQuerySchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  sortBy: z.enum(['date', 'amount']).default('date'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
