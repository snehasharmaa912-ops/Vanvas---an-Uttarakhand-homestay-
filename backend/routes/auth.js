import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    const normalizedEmail = email.toLowerCase().trim()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const role = ADMIN_EMAIL && normalizedEmail === ADMIN_EMAIL ? 'admin' : 'viewer'

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      userType: userType === 'host' ? 'host' : 'traveler',
      role,
    })

    const token = signToken(user)
    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
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

export default router
