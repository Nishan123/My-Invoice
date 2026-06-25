const rateLimit = require('express-rate-limit');

// General limiter for all routes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: {
        status: 'error',
        code: 429,
        message: 'You have exceeded the request limit. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth limiter — strict, to slow credential-stuffing/brute force
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: {
        status: 'error',
        code: 429,
        message: 'Too many login attempts. For security reasons, please try again in 1 hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Only count failed auth attempts so a successful login doesn't burn the budget.
    skipSuccessfulRequests: true,
});

// API routes limiter (for /api endpoints)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // a single SPA page often fires many API calls; 50 throttled normal use
    message: {
        status: 'error',
        code: 429,
        message: 'API rate limit exceeded. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter, apiLimiter };
