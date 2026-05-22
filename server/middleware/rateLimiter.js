const rateLimit = require(
  'express-rate-limit'
);



// SHARED CONFIG
const commonConfig = {

  standardHeaders: true,

  legacyHeaders: false,
};



// GLOBAL API LIMITER
exports.globalLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 300,

    message: {
      message:
        'Too many requests. Please try again later.',
    },

    ...commonConfig,
  });



// AUTH LIMITER
exports.authLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 10,

    message: {
      message:
        'Too many login attempts. Try again later.',
    },

    ...commonConfig,
  });



// COMMENT LIMITER
exports.commentLimiter =
  rateLimit({

    windowMs:
      60 * 1000,

    max: 10,

    message: {
      message:
        'Too many comments. Try again later.',
    },

    ...commonConfig,
  });



// LIKE LIMITER
exports.likeLimiter =
  rateLimit({

    windowMs:
      60 * 1000,

    max: 30,

    message: {
      message:
        'Too many like requests.',
    },

    ...commonConfig,
  });



// WRITE ACTION LIMITER
exports.writeLimiter =
  rateLimit({

    windowMs:
      5 * 60 * 1000,

    max: 20,

    message: {
      message:
        'Too many write actions. Slow down.',
    },

    ...commonConfig,
  });