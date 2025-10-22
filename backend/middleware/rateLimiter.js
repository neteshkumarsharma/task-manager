const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    headers: true,
});

module.exports = apiRateLimiter;
