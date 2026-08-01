const prisma = require('../config/prisma');

// Resolves a { start, end } date range for a given report type + optional explicit dates.
function resolveRange(type, startDate, endDate) {
  if (startDate && endDate) return { start: new Date(startDate), end: new Date(endDate) };

  const now = new Date();
  switch (type) {
    case 'DAILY':
      return { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date() };
    case 'WEEKLY': {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { start, end: new Date() };
    }
    case 'MONTHLY':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59) };
    case 'QUARTERLY': {
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return { start, end: new Date() };
    }
    case 'YEARLY':
      return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31, 23, 59, 59) };
    default:
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date() };
  }
}

// Gathers everything a report might need: expenses, income, budgets, and computed totals.
async function gatherReportData(userId, type, startDate, endDate) {
  const { start, end } = resolveRange(type, startDate, endDate);

  const [expenses, incomes, budgets, user] = await Promise.all([
    prisma.expense.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { category: true },
      orderBy: { date: 'asc' },
    }),
    prisma.income.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    }),
    prisma.budget.findMany({
      where: { userId, startDate: { lte: end }, endDate: { gte: start } },
      include: { category: true },
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);

  const byCategory = {};
  expenses.forEach((e) => {
    const key = e.category.name;
    byCategory[key] = (byCategory[key] || 0) + Number(e.amount);
  });
  const categoryBreakdown = Object.entries(byCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return {
    user,
    range: { start, end },
    expenses,
    incomes,
    budgets,
    totals: {
      totalExpenses,
      totalIncome,
      netBalance: totalIncome - totalExpenses,
      transactionCount: expenses.length + incomes.length,
    },
    categoryBreakdown,
  };
}

module.exports = { gatherReportData, resolveRange };
