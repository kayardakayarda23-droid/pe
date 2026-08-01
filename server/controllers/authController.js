const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const { catchAsync } = require('../middleware/errorHandler');

const SALT_ROUNDS = 12;

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sanitizeUser(user) {
  const { password, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
}

// POST /api/auth/register
exports.register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      settings: { create: {} },
    },
  });

  const token = signToken(user);
  res.status(201).json({ success: true, data: { user: sanitizeUser(user), token } });
});

// POST /api/auth/login
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({ success: true, data: { user: sanitizeUser(user), token } });
});

// POST /api/auth/forgot-password
exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same way to avoid leaking which emails are registered
  const genericResponse = {
    success: true,
    message: 'If an account with that email exists, a reset link has been sent',
  };

  if (!user) return res.json(genericResponse);

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  // TODO: wire up nodemailer to actually send `resetToken` via email.
  // Left as a hook point rather than a placeholder implementation, since
  // SMTP credentials are environment-specific.
  if (process.env.NODE_ENV === 'development') {
    console.log(`[dev] Password reset token for ${email}: ${resetToken}`);
  }

  res.json(genericResponse);
});

// POST /api/auth/reset-password
exports.resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Reset token is invalid or has expired' });
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  res.json({ success: true, message: 'Password has been reset successfully' });
});

// GET /api/auth/profile
exports.getProfile = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ success: true, data: sanitizeUser(user) });
});

// PUT /api/auth/profile
exports.updateProfile = catchAsync(async (req, res) => {
  const { name, currency, language, darkMode, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, currency, language, darkMode, avatarUrl },
  });

  res.json({ success: true, data: sanitizeUser(user) });
});

// PUT /api/auth/change-password
exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  res.json({ success: true, message: 'Password changed successfully' });
});
