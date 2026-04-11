/**
 * Lightweight in-memory rate limiter.
 * Returns Express middleware that limits requests per IP.
 *
 * @param {number} windowMinutes  – time window in minutes
 * @param {number} maxRequests    – max requests per window
 */
function rateLimit(windowMinutes = 15, maxRequests = 100) {
    const store = new Map(); // ip -> { count, resetAt }
    const windowMs = windowMinutes * 60 * 1000;

    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const entry = store.get(ip);

        if (!entry || now > entry.resetAt) {
            store.set(ip, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count++;
        if (entry.count > maxRequests) {
            res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
            return res.status(429).json({
                success: false,
                message: `Too many requests from this IP. Please try again after ${windowMinutes} minutes.`
            });
        }
        next();
    };
}

module.exports = rateLimit;
