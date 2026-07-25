import express from 'express'
import wishlistRoutes from './routes/wishlist.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import passport from './config/passport.js'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Stay from './models/Stay.js'
import User from './models/User.js'
import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import aiRoutes from './routes/ai.js'
import tripRoutes from './routes/trips.js'
import { requireAuth } from './middleware/auth.js'

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  console.error('⚠️  GEMINI_API_KEY is missing — AI trip planner routes will fail until this is set in .env')
}

const app = express()
app.set('trust proxy', 1)
const httpServer = createServer(app)
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error(`CORS: origin ${origin} is not allowed`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(passport.initialize())
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message))

// --- Socket.io setup ---
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

io.on('connection', socket => {
  socket.on('join:host', hostId => {
    if (hostId) socket.join(`host:${hostId}`)
  })
  socket.on('join:guest', guestId => {
    if (guestId) socket.join(`guest:${guestId}`)
  })
  socket.on('disconnect', () => {})
})

app.set('io', io)
// --- end Socket.io setup ---

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/trips', tripRoutes)

app.get('/api/stays', async (req, res) => {
  try {
    const { q } = req.query
    if (q) {
      const regex = new RegExp(q, 'i')
      const results = await Stay.find({ $or: [{ title: regex }, { location: regex }] })
      return res.status(200).json(results)
    }
    const stays = await Stay.find()
    res.status(200).json(stays)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stays' })
  }
})
app.get('/api/stays/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' })
    }
    const regex = new RegExp(q, 'i')
    const results = await Stay.find({ $or: [{ title: regex }, { location: regex }] })
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ error: 'Search failed' })
  }
})
app.get('/api/stays/mine', requireAuth, async (req, res) => {
  try {
    const stays = await Stay.find({ hostId: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(stays)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your stays' })
  }
})
app.get('/api/stays/:id', async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id)
    if (!stay) {
      return res.status(404).json({ error: `Stay with id ${req.params.id} not found` })
    }
    res.status(200).json(stay)
  } catch (err) {
    res.status(404).json({ error: 'Invalid stay id' })
  }
})
app.post('/api/stays', requireAuth, async (req, res) => {
  try {
    const requester = await User.findById(req.userId)
    if (!requester) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    let payload = req.body
    if (requester.role !== 'admin') {
      payload = { ...req.body, hostId: requester._id, host: requester.name }
    }

    const { title, location, price, host } = payload
    if (!title || !location || !price || !host) {
      return res.status(400).json({ error: 'title, location, price and host are required' })
    }
    const newStay = await Stay.create(payload)
    req.app.get('io').emit('stay:created', newStay)
    res.status(201).json(newStay)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stay' })
  }
})
app.put('/api/stays/:id', requireAuth, async (req, res) => {
  try {
    const requester = await User.findById(req.userId)
    if (!requester) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const existing = await Stay.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: `Stay with id ${req.params.id} not found` })
    }

    const isOwner = existing.hostId && existing.hostId.toString() === req.userId
    if (requester.role !== 'admin' && !isOwner) {
      return res.status(403).json({ error: 'You can only edit your own stays' })
    }

    const payload = requester.role === 'admin'
      ? req.body
      : { ...req.body, hostId: existing.hostId, host: requester.name }

    const updated = await Stay.findByIdAndUpdate(req.params.id, payload, { new: true })
    req.app.get('io').emit('stay:updated', updated)
    res.status(200).json(updated)
  } catch (err) {
    res.status(404).json({ error: 'Invalid stay id or update failed' })
  }
})
app.delete('/api/stays/:id', requireAuth, async (req, res) => {
  try {
    const requester = await User.findById(req.userId)
    if (!requester) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const existing = await Stay.findById(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: `Stay with id ${req.params.id} not found` })
    }

    const isOwner = existing.hostId && existing.hostId.toString() === req.userId
    if (requester.role !== 'admin' && !isOwner) {
      return res.status(403).json({ error: 'You can only delete your own stays' })
    }

    await Stay.findByIdAndDelete(req.params.id)
    req.app.get('io').emit('stay:deleted', { id: req.params.id })
    res.status(204).send()
  } catch (err) {
    res.status(404).json({ error: 'Invalid stay id' })
  }
})
app.get('/', (req, res) => {
  res.status(200).json({ message: 'VanaVas API is running' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on the server' })
})
httpServer.listen(PORT, () => {
  console.log(`VanaVas backend running on port ${PORT}`)
})
