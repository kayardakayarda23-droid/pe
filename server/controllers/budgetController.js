const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

async function withUsage(budget) {
  const spent = await prisma.expense.aggregate({
    where: {
      userId: budget.userId,
      date: { gte: budget.startDate, lte: budget.endDate },
      ...(budget.categoryId && { categoryId: budget.categoryId }),
    },
    _sum: { amount: true },
  });

  const used = Number(spent._sum.amount || 0);
  const amount = Number(budget.amount);
  const remaining = amount - used;
  const percentage = amount > 0 ? Math.round((used / amount) * 1000) / 10 : 0;

  return { ...budget, used, remaining, percentage, isOverBudget: used > amount };
}

// GET /api/budgets
exports.getBudgets = catchAsync(async (req, res) => {
  const budgets = await prisma.budget.findMany({
    where: { userId: req.user.id },
    include: { category: true },
    orderBy: { startDate: 'desc' },
  });

  const withStats = await Promise.all(budgets.map(withUsage));
  res.json({ success: true, data: withStats });
});

// POST /api/budgets
exports.createBudget = catchAsync(async (req, res) => {
  const { categoryId, amount, period, startDate, endDate } = req.body;

  const budget = await prisma.budget.create({
    data: {
      userId: req.user.id,
      categoryId: categoryId ? Number(categoryId) : null,
      amount,
      period: period || 'MONTHLY',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
    include: { category: true },
  });

  res.status(201).json({ success: true, data: await withUsage(budget) });
});

// PUT /api/budgets/:id
exports.updateBudget = catchAsync(async (req, res) => {
  const existing = await prisma.budget.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ success: false, message: 'Budget not found' });

  const { categoryId, amount, period, startDate, endDate } = req.body;

  const budget = await prisma.budget.update({
    where: { id: existing.id },
    data: {
      ...(categoryId !== undefined && { categoryId: categoryId ? Number(categoryId) : null }),
      ...(amount !== undefined && { amount }),
      ...(period !== undefined && { period }),
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: new Date(endDate) }),
    },
    include: { category: true },
  });

  res.json({ success: true, data: await withUsage(budget) });
});

// DELETE /api/budgets/:id
exports.deleteBudget = catchAsync(async (req, res) => {
  const existing = await prisma.budget.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ success: false, message: 'Budget not found' });

  await prisma.budget.delete({ where: { id: existing.id } });
  res.json({ success: true, message: 'Budget deleted successfully' });
});
