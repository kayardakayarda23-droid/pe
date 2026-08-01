const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

// GET /api/income
exports.getIncomes = catchAsync(async (req, res) => {
  const { startDate, endDate, source, page = 1, limit = 20 } = req.query;

  const where = {
    userId: req.user.id,
    ...(source && { source: { contains: source } }),
    ...((startDate || endDate) && {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    }),
  };

  const [incomes, total] = await Promise.all([
    prisma.income.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.income.count({ where }),
  ]);

  res.json({
    success: true,
    data: incomes,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

// POST /api/income
exports.createIncome = catchAsync(async (req, res) => {
  const { source, amount, date, notes } = req.body;

  const income = await prisma.income.create({
    data: { userId: req.user.id, source, amount, date: new Date(date), notes },
  });

  res.status(201).json({ success: true, data: income });
});

// PUT /api/income/:id
exports.updateIncome = catchAsync(async (req, res) => {
  const existing = await prisma.income.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ success: false, message: 'Income not found' });

  const { source, amount, date, notes } = req.body;

  const income = await prisma.income.update({
    where: { id: existing.id },
    data: {
      ...(source !== undefined && { source }),
      ...(amount !== undefined && { amount }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(notes !== undefined && { notes }),
    },
  });

  res.json({ success: true, data: income });
});

// DELETE /api/income/:id
exports.deleteIncome = catchAsync(async (req, res) => {
  const existing = await prisma.income.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ success: false, message: 'Income not found' });

  await prisma.income.delete({ where: { id: existing.id } });
  res.json({ success: true, message: 'Income deleted successfully' });
});
