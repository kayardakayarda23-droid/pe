const cron = require('node-cron');
const prisma = require('../config/prisma');
const {
  notifyDailyReminder,
  notifyWeeklyReportReady,
  notifyMonthlyReportReady,
} = require('../services/notificationService');

// Runs every 15 minutes and notifies users whose configured daily reminder
// time matches the current time (HH:MM), so each user gets their own
// preferred time rather than one global schedule.
function scheduleDailyReminders() {
  cron.schedule('*/15 * * * *', async () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentSlot = `${hh}:${mm}`;

    try {
      const dueSettings = await prisma.settings.findMany({
        where: { notificationsEnabled: true, dailyReminderTime: currentSlot },
      });
      for (const s of dueSettings) {
        await notifyDailyReminder(s.userId);
      }
    } catch (err) {
      console.error('[cron:daily-reminder] failed:', err.message);
    }
  });
}

// Every Monday at 8am — weekly report ready
function scheduleWeeklyReportNotice() {
  cron.schedule('0 8 * * 1', async () => {
    try {
      const users = await prisma.settings.findMany({ where: { notificationsEnabled: true } });
      for (const s of users) await notifyWeeklyReportReady(s.userId);
    } catch (err) {
      console.error('[cron:weekly-report] failed:', err.message);
    }
  });
}

// 1st of each month at 8am — monthly report ready
function scheduleMonthlyReportNotice() {
  cron.schedule('0 8 1 * *', async () => {
    try {
      const users = await prisma.settings.findMany({ where: { notificationsEnabled: true } });
      for (const s of users) await notifyMonthlyReportReady(s.userId);
    } catch (err) {
      console.error('[cron:monthly-report] failed:', err.message);
    }
  });
}

function startScheduledJobs() {
  scheduleDailyReminders();
  scheduleWeeklyReportNotice();
  scheduleMonthlyReportNotice();
  console.log('[cron] Scheduled jobs started (daily reminders, weekly/monthly report notices)');
}

module.exports = { startScheduledJobs };
