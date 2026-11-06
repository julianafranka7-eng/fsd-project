// server/middleware/errorHandler.js - one JSON format for every error
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier.';
  }
  if (err.code === 11000) {
    status = 409;
    message = 'A record with this value already exists.';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
