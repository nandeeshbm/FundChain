const errorHandler = (err, req, res, _next) => {
  // Enhanced logging for debugging
  console.error('--- INTERNAL SERVER ERROR ---');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request Body:', JSON.stringify(req.body, null, 2));
  console.error('-----------------------------');

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Max size is 5MB per file.',
    });
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded. Please limit evidence files.',
    });
  }
  if (err.message && err.message.includes('Unsupported file type')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  // Custom AppError
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Default 500
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

// Custom error class for throwing in controllers/services
class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = { errorHandler, AppError };
