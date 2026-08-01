const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');
const { notifyBudgetExceeded } = require('../services/notificationService');

// Checks all budgets that cover the expense's date and fires a notification
// for any that are newly over their limit. Non-blocking — failures here
// should never prevent the expense itself from being saved.
async function checkBudgetsForExpense(userId, expense) {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: expense.date },
        endDate: { gte: expense.date },
        OR: [{ categoryId: null }, { categoryId: expense.categoryId }],
      },
    });

    for (const budget of budgets) {
      const spentAgg = await prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: budget.startDate, lte: budget.endDate },
          ...(budget.categoryId && { categoryId: budget.categoryId }),
        },
        _sum: { amount: true },
      });
      const used = Number(spentAgg._sum.amount || 0);
      const limit = Number(budget.amount);
      if (used > limit) {
        const label = budget.categoryId ? `${expense.category?.name || 'category'}` : 'overall';
        await notifyBudgetExceeded(userId, label, used, limit);
      }
    }
  } catch (err) {
    console.error('[budget-check] failed:', err.message);
  }
}

// GET /api/expenses  (supports ?category=&startDate=&endDate=&minAmount=&maxAmount=&merchant=&paymentMethod=&q=&page=&limit=)
exports.getExpenses = catchAsync(async (req, res) => {
  const {
    category, startDate, endDate, minAmount, maxAmount,
    merchant, paymentMethod, q, page = 1, limit = 20,
  } = req.query;

  const where = {
    userId: req.user.id,
    ...(category && { categoryId: Number(category) }),
    ...(paymentMethod && { paymentMethod }),
    ...(merchant && { merchantName: { contains: merchant } }),
    ...(q && { title: { contains: q } }),
    ...((startDate || endDate) && {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    }),
    ...((minAmount || maxAmount) && {
      amount: {
        ...(minAmount && { gte: Number(minAmount) }),
        ...(maxAmount && { lte: Number(maxAmount) }),
      },
    }),
  };

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.expense.count({ where }),
  ]);

  res.json({
    success: true,
    data: expenses,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

// GET /api/expenses/:id
exports.getExpenseById = catchAsync(async (req, res) => {
  const expense = await prisma.expense.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
    include: { category: true },
  });

  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
  res.json({ success: true, data: expense });
});

// POST /api/expenses
exports.createExpense = catchAsync(async (req, res) => {
  const {
    title, description, categoryId, amount, date,
    paymentMethod, merchantName, notes, location,
  } = req.body;

  const receiptImage = req.file ? `/uploads/${req.file.filename}` : undefined;

  const expense = await prisma.expense.create({
    data: {
      userId: req.user.id,
      categoryId: Number(categoryId),
      title,
      description,
      amount,
      date: new Date(date),
      paymentMethod: paymentMethod || 'CASH',
      merchantName,
      notes,
      location,
      receiptImage,
    },
    include: { category: true },
  });

  res.status(201).json({ success: true, data: expense });

  checkBudgetsForExpense(req.user.id, expense);
});
// PUT /api/expenses/:id
exports.updateExpense = catchAsync(async (req, res) => {
  const existing = await prisma.expense.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ success: false, message: 'Expense not found' });

  const {
    title, description, categoryId, amount, date,
    paymentMethod, merchantName, notes, location,
  } = req.body;

  const receiptImage = req.file ? `/uploads/${req.file.filename}` : undefined;

  const expense = await prisma.expense.update({
    where: { id: existing.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
      ...(amount !== undefined && { amount }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(paymentMethod !== undefined && { paymentMethod }),
      ...(merchantName !== undefined && { merchantName }),
      ...(notes !== undefined && { notes }),
      ...(location !== undefined && { location }),
      ...(receiptImage && { receiptImage }),
    },
    include: { category: true },
  });

  res.json({ success: true, data: expense });

  checkBudgetsForExpense(req.user.id, expense);
});
exports.deleteExpense = catchAsync(async (req, res) => {
  const existing = await prisma.expense.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ success: false, message: 'Expense not found' });

  await prisma.expense.delete({ where: { id: existing.id } });
  res.json({ success: true, message: 'Expense deleted successfully' });
});
