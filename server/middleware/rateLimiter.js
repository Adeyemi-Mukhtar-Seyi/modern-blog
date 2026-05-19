const rateLimit = require('express-rate-limit');

exports.commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many comments. Try again later.',
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts.',
});

exports.likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many requests.',
});