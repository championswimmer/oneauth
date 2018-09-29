const rateLimit = require('express-rate-limit')

module.exports = {
    pageLimiter: rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 1000 // 1000 per ip
    }),
    apiLimiter: rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 200 // 200 per ip
    }),
    authLimiter: rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 50 // 50 per ip
    }),
}