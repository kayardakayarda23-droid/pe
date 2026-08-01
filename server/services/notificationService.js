const prisma = require('../config/prisma');
const { initFirebase } = require('../config/firebase');

// Sends a push notification to a user's registered device (if any) and always
// logs it to the Notification table so it shows up in-app regardless of
// whether the push itself succeeds (e.g. Firebase not configured in dev).
async function sendNotification(userId, { title, message, type }) {
  const notification = await prisma.notification.create({
    data: { userId, title, message, type },
  });

  const settings = await prisma.settings.findUnique({ where: { userId } });
  if (!settings?.notificationsEnabled || !settings?.deviceToken) {
    return notification;
  }

  const admin = initFirebase();
  if (!admin) return notification; // Firebase not configured — in-app notification still recorded

  try {
    await admin.messaging().send({
      token: settings.deviceToken,
      notification: { title, body: message },
      data: { type },
    });
  } catch (err) {
    console.error(`[push] Failed to send to user ${userId}:`, err.message);
    // If the token is invalid/expired, clear it so we stop retrying
    if (err.code === 'messaging/registration-token-not-registered') {
      await prisma.settings.update({ where: { userId }, data: { deviceToken: null } }).catch(() => {});
    }
  }

  return notification;
}

// --- Specific notification triggers, matching the original spec ---

async function notifyBudgetExceeded(userId, budgetLabel, used, limit) {
  return sendNotification(userId, {
    title: 'Budget Exceeded',
    message: `You've spent ₦${used.toLocaleString('en-NG', { minimumFractionDigits: 2 })} of your ₦${limit.toLocaleString('en-NG', { minimumFractionDigits: 2 })} ${budgetLabel} budget.`,
    type: 'BUDGET_EXCEEDED',
  });
}

async function notifyDailyReminder(userId) {
  return sendNotification(userId, {
    title: 'Daily Expense Reminder',
    message: "Don't forget to log today's expenses.",
    type: 'DAILY_REMINDER',
  });
}

async function notifyWeeklyReportReady(userId) {
  return sendNotification(userId, {
    title: 'Weekly Report Ready',
    message: 'Your weekly spending report is ready to view.',
    type: 'WEEKLY_REPORT',
  });
}

async function notifyMonthlyReportReady(userId) {
  return sendNotification(userId, {
    title: 'Monthly Report Ready',
    message: 'Your monthly spending report is ready to view.',
    type: 'MONTHLY_REPORT',
  });
}

async function notifySavingsReminder(userId, amountShort) {
  return sendNotification(userId, {
    title: 'Savings Reminder',
    message: `You're ₦${amountShort.toLocaleString('en-NG', { minimumFractionDigits: 2 })} short of this month's savings goal.`,
    type: 'SAVINGS_REMINDER',
  });
}

async function notifyBillDue(userId, billName, dueDate) {
  return sendNotification(userId, {
    title: 'Bill Due Reminder',
    message: `${billName} is due on ${new Date(dueDate).toLocaleDateString('en-US')}.`,
    type: 'BILL_DUE',
  });
}

module.exports = {
  sendNotification,
  notifyBudgetExceeded,
  notifyDailyReminder,
  notifyWeeklyReportReady,
  notifyMonthlyReportReady,
  notifySavingsReminder,
  notifyBillDue,
};
