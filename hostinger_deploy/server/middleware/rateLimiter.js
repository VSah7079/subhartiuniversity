/**
 * Production In-Memory Rate Limiter
 * Protects login and auth endpoints against brute force credential stuffing.
 */
const ipHits = new Map();

// Periodic cleanup of stale IPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of ipHits.entries()) {
    if (now > data.resetTime) {
      ipHits.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 5 * 60 * 1000; // 5 minutes default
  const maxHits = options.max || 15; // 15 attempts per window
  const message = options.message || 'Too many authentication attempts. Please try again after 5 minutes.';

  return (req, res, next) => {
    // Determine client identifier (proxy-aware IP or direct IP)
    const clientIp = (
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown-ip'
    ).split(',')[0].trim();

    const now = Date.now();
    let record = ipHits.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      ipHits.set(clientIp, record);
      return next();
    }

    record.count += 1;

    if (record.count > maxHits) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message: `${message} (Retry after ${retryAfterSeconds}s)`
      });
    }

    return next();
  };
};

// Default auth rate limiter instance
const authRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts on Subharti Student Portal.'
});

module.exports = {
  createRateLimiter,
  authRateLimiter
};
