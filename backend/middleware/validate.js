import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
  userType: z.enum(['traveler', 'host']).optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const requestOtpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
})

export const verifyOtpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  otp: z.string().trim().length(6, 'Code must be 6 digits'),
})

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      return res.status(400).json({ error: errors[0]?.message || 'Invalid request', errors })
    }
    req.body = result.data
    next()
  }
}
