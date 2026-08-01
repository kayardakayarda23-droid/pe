const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

function getRange(period) {
  const now = new Date();
  switch (period) {
    case 'daily':
      return { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date() };
    case 'weekly': {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { start, end: new Date() };
    }
    case 'monthly':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date() };
    case 'quarterly': {
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return { start, end: new Date() };
    }
    case 'yearly':
      return { start: new Date(now.getFullYear(), 0, 1), end: new Date() };
    default:
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date() };
  }
}

// GET /api/analytics/:period  (daily | weekly | monthly | quarterly | yearly)
exports.getAnalysis = catchAsync(async (req, res) => {
  const { period } = req.params;
  const userId = req.user.id;
  const { start, end } = getRange(period);

  const expenses = await prisma.expense.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { category: true },
    orderBy: { date: 'asc' },
  });

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const byCategory = {};
  expenses.forEach((e) => {
    const key = e.category.name;
    byCategory[key] = (byCategory[key] || 0) + Number(e.amount);
  });
  const categoryBreakdown = Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const byDate = {};
  expenses.forEach((e) => {
    const key = e.date.toISOString().slice(0, 10);
    byDate[key] = (byDate[key] || 0) + Number(e.amount);
  });
  const timeline = Object.entries(byDate).map(([date, amount]) => ({ date, amount }));

  const daySpan = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  res.json({
    success: true,
    data: {
      period,
      startDate: start,
      endDate: end,
      totalExpenses: total,
      transactionCount: expenses.length,
      averagePerDay: Math.round((total / daySpan) * 100) / 100,
      topCategory: categoryBreakdown[0] || null,
      categoryBreakdown,
      timeline,
      topExpenses: [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5),
    },
  });
});

// GET /api/analytics/income-vs-expense?months=6
exports.incomeVsExpense = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const months = Number(req.query.months) || 6;
  const now = new Date();
  const results = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

    const [expenseAgg, incomeAgg] = await Promise.all([
      prisma.expense.aggregate({ where: { userId, date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
      prisma.income.aggregate({ where: { userId, date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
    ]);

    results.push({
      month: monthStart.toISOString().slice(0, 7),
      income: Number(incomeAgg._sum.amount || 0),
      expense: Number(expenseAgg._sum.amount || 0),
    });
  }

  res.json({ success: true, data: results });
});
