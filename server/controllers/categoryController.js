const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

// GET /api/categories
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { OR: [{ isDefault: true }, { userId: req.user.id }] },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
  });
  res.json({ success: true, data: categories });
});

// POST /api/categories  (custom category)
exports.createCategory = catchAsync(async (req, res) => {
  const { name, icon, color, type } = req.body;

  const category = await prisma.category.create({
    data: { name, icon, color, type: type || 'EXPENSE', userId: req.user.id, isDefault: false },
  });

  res.status(201).json({ success: true, data: category });
});

// DELETE /api/categories/:id  (only custom categories owned by the user)
exports.deleteCategory = catchAsync(async (req, res) => {
  const existing = await prisma.category.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id, isDefault: false },
  });
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Custom category not found' });
  }
  await prisma.category.delete({ where: { id: existing.id } });
  res.json({ success: true, message: 'Category deleted successfully' });
});
