import passport from '../config/passport.js'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { validate, registerSchema, loginSchema, requestOtpSchema, verifyOtpSchema } from '../middleware/validate.js'

const router = Router()

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
const RESEND_API_KEY = process.env.RESEND_API_KEY
const OTP_FROM_EMAIL = process.env.OTP_FROM_EMAIL || 'VanaVas <onboarding@resend.dev>'
const OTP_TTL_MINUTES = 10

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    role: user.role,
  }
}

async function sendOtpEmail(email, otp) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: OTP_FROM_EMAIL,
      to: email,
      subject: 'Your VanaVas admin sign-in code',
      html: `
        <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto;">
          <h2 style="color:#1a4a31;">VanaVas Admin Panel</h2>
          <p>Your one-time sign-in code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color:#2d7a4f;">${otp}</p>
          <p style="color:#888; font-size: 13px;">This code expires in ${OTP_TTL_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend API error: ${res.status} ${body}`)
  }
}

router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password, userType } = req.body
    const normalizedEmail = email.toLowerCase().trim()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      userType: userType === 'host' ? 'host' : 'traveler',
      role: 'viewer',
    })

    const token = signToken(user)
    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = signToken(user)
    res.status(200).json({ token, user: toPublicUser(user) })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.status(200).json({ user: toPublicUser(user) })
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.post('/admin/request-otp', authLimiter, validate(requestOtpSchema), async (req, res) => {
  try {
    const { email } = req.body
    const normalizedEmail = (email || '').toLowerCase().trim()
    const genericResponse = { message: 'If that email is authorized, a code has been sent.' }

    if (!normalizedEmail || !ADMIN_EMAIL || normalizedEmail !== ADMIN_EMAIL) {
      return res.status(200).json(genericResponse)
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)) // 6-digit code
    const otpCodeHash = await bcrypt.hash(otp, 10)
    const otpExpires = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000)

    await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        role: 'admin',
        userType: 'admin',
        otpCodeHash,
        otpExpires,
        $setOnInsert: { name: 'Admin' },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    await sendOtpEmail(normalizedEmail, otp)
    res.status(200).json(genericResponse)
  } catch (err) {
    console.error('OTP request failed:', err.message)
    res.status(500).json({ error: 'Could not send the code. Please try again.' })
  }
})

router.post('/admin/verify-otp', authLimiter, validate(verifyOtpSchema), async (req, res) => {
  try {
    const { email, otp } = req.body
    const normalizedEmail = (email || '').toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail, role: 'admin' })
    if (!user || !user.otpCodeHash || !user.otpExpires) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    if (user.otpExpires < new Date()) {
      return res.status(401).json({ error: 'This code has expired. Please request a new one.' })
    }

    const match = await bcrypt.compare(String(otp), user.otpCodeHash)
    if (!match) {
      return res.status(401).json({ error: 'Incorrect code' })
    }

    user.otpCodeHash = null
    user.otpExpires = null
    await user.save()

    const token = signToken(user)
    res.status(200).json({ token, user: toPublicUser(user) })
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' })
  }
})

router.get('/google', (req, res, next) => {
  const state = req.query.userType === 'host' ? 'host' : 'traveler'
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state,
  })(req, res, next)
})

router.get('/google/callback', (req, res, next) => {
  const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim()
  passport.authenticate('google', { session: false, failureRedirect: `${frontendBase}/login?error=oauth_failed` }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${frontendBase}/login?error=oauth_failed`)
    }
    const token = signToken(user)
    res.redirect(`${frontendBase}/oauth/callback?token=${token}`)
  })(req, res, next)
})
export default router
