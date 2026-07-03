import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Stay from './models/Stay.js'
import authRoutes from './routes/auth.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message))

app.use('/api/auth', authRoutes)

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
app.post('/api/stays', async (req, res) => {
  try {
    const { title, location, price, host } = req.body
    if (!title || !location || !price || !host) {
      return res.status(400).json({ error: 'title, location, price and host are required' })
    }
    const newStay = await Stay.create(req.body)
    res.status(201).json(newStay)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create stay' })
  }
})
app.put('/api/stays/:id', async (req, res) => {
  try {
    const updated = await Stay.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) {
      return res.status(404).json({ error: `Stay with id ${req.params.id} not found` })
    }
    res.status(200).json(updated)
  } catch (err) {
    res.status(404).json({ error: 'Invalid stay id or update failed' })
  }
})
app.delete('/api/stays/:id', async (req, res) => {
  try {
    const deleted = await Stay.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: `Stay with id ${req.params.id} not found` })
    }
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
app.listen(PORT, () => {
  console.log(`VanaVas backend running on port ${PORT}`)
})
