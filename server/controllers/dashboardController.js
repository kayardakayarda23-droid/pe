const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

// GET /api/dashboard  -> summary cards for the current month
exports.getDashboard = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [expenseAgg, incomeAgg, expenseCount, largestExpense, recentExpenses, activeBudget] = await Promise.all([
    prisma.expense.aggregate({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.income.aggregate({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.expense.count({ where: { userId, date: { gte: startOfMonth, lte: endOfMonth } } }),
    prisma.expense.findFirst({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      orderBy: { amount: 'desc' },
      include: { category: true },
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
      include: { category: true },
    }),
    prisma.budget.findFirst({
      where: { userId, categoryId: null, startDate: { lte: now }, endDate: { gte: now } },
    }),
  ]);

  const totalExpenses = Number(expenseAgg._sum.amount || 0);
  const totalIncome = Number(incomeAgg._sum.amount || 0);
  const monthlyBudget = activeBudget ? Number(activeBudget.amount) : 0;
  const budgetUsedPercentage = monthlyBudget > 0 ? Math.round((totalExpenses / monthlyBudget) * 1000) / 10 : 0;

  res.json({
    success: true,
    data: {
      totalIncome,
      totalExpenses,
      currentBalance: totalIncome - totalExpenses,
      monthlyBudget,
      budgetRemaining: monthlyBudget - totalExpenses,
      budgetUsedPercentage,
      totalTransactions: expenseCount,
      largestExpense,
      recentTransactions: recentExpenses,
    },
  });
});
