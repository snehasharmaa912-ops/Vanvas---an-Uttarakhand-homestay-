import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message)
  },
})

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 50, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI request limit reached. Please try again in an hour.' },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message)
  },
})
