import Expense from '../models/expense.model.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesQuerySchema,
} from '../validations/expense.schema.js';

function isValidId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function createExpense(req, res, next) {
  try {
    const data = createExpenseSchema.parse(req.body);

    // The owner comes from the JWT, never from the request body
    const expense = await Expense.create({ ...data, user: req.userId });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
}

export async function getExpenses(req, res, next) {
  try {
    const query = listExpensesQuerySchema.parse(req.query);

    const filter = { user: req.userId };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.from || query.to) {
      filter.date = {};
      if (query.from) filter.date.$gte = query.from;
      if (query.to) filter.date.$lte = query.to;
    }

    const sort = { [query.sortBy]: query.order === 'asc' ? 1 : -1 };

    const expenses = await Expense.find(filter).sort(sort);

    res.json(expenses);
  } catch (error) {
    next(error);
  }
}

export async function getExpenseById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    // Query by expense id AND owner
    const expense = await Expense.findOne({ _id: id, user: req.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
}

export async function updateExpense(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const data = updateExpenseSchema.parse(req.body);

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
