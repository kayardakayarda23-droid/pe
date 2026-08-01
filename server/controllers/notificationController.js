const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

// POST /api/notifications/register-device
exports.registerDevice = catchAsync(async (req, res) => {
  const { deviceToken } = req.body;
  if (!deviceToken) {
    return res.status(400).json({ success: false, message: 'deviceToken is required' });
  }

  await prisma.settings.upsert({
    where: { userId: req.user.id },
    update: { deviceToken },
    create: { userId: req.user.id, deviceToken },
  });

  res.json({ success: true, message: 'Device registered for push notifications' });
});

// GET /api/notifications
exports.getNotifications = catchAsync(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({ where: { userId: req.user.id, isRead: false } });
  res.json({ success: true, data: notifications, unreadCount });
});

// PUT /api/notifications/:id/read
exports.markAsRead = catchAsync(async (req, res) => {
  await prisma.notification.updateMany({
    where: { id: Number(req.params.id), userId: req.user.id },
    data: { isRead: true },
  });
  res.json({ success: true });
});

// PUT /api/notifications/read-all
exports.markAllAsRead = catchAsync(async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user.id, isRead: false },
    data: { isRead: true },
  });
  res.json({ success: true });
});

// PUT /api/notifications/preferences
exports.updatePreferences = catchAsync(async (req, res) => {
  const { notificationsEnabled, dailyReminderTime } = req.body;

  const settings = await prisma.settings.upsert({
    where: { userId: req.user.id },
    update: {
      ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      ...(dailyReminderTime !== undefined && { dailyReminderTime }),
    },
    create: { userId: req.user.id, notificationsEnabled, dailyReminderTime },
  });

  res.json({ success: true, data: settings });
});
