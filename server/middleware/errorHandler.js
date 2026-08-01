// Centralized error handler. Any `next(err)` call or thrown error inside an
// async route wrapped with catchAsync lands here.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'A record with this value already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

// Wraps async route handlers so rejected promises are forwarded to errorHandler
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = { errorHandler, catchAsync };
