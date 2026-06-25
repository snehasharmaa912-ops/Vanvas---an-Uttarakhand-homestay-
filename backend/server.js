import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import stays from './data/stays.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

let nextId = stays.length + 1
app.get('/api/stays', (req, res) => {
  const { q } = req.query
  if (q) {
    const query = q.toLowerCase()
    const results = stays.filter(s =>
      s.title.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
    )
    return res.status(200).json(results)
  }
  res.status(200).json(stays)
})

app.get('/api/stays/search', (req, res) => {
  const { q } = req.query
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }
  const query = q.toLowerCase()
  const results = stays.filter(s =>
    s.title.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)
  )
  res.status(200).json(results)
})

app.get('/api/stays/:id', (req, res) => {
  const id = Number(req.params.id)
  const stay = stays.find(s => s.id === id)
  if (!stay) {
    return res.status(404).json({ error: `Stay with id ${id} not found` })
  }
  res.status(200).json(stay)
})

app.post('/api/stays', (req, res) => {
  const { title, location, price, host } = req.body
  if (!title || !location || !price || !host) {
    return res.status(400).json({ error: 'title, location, price and host are required' })
  }
  const newStay = {
    id: nextId++,
    title,
    location,
    price: Number(price),
    rating: req.body.rating || 0,
    reviews: req.body.reviews || 0,
    tags: req.body.tags || [],
    host,
    eco: req.body.eco || false,
    image: req.body.image || `https://picsum.photos/seed/new${nextId}/400/300`,
  }

  stays.push(newStay)
  res.status(201).json(newStay)
})

// PUT /api/stays/:id — update an existing stay
app.put('/api/stays/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = stays.findIndex(s => s.id === id)

  if (index === -1) {
    return res.status(404).json({ error: `Stay with id ${id} not found` })
  }

  stays[index] = { ...stays[index], ...req.body, id }
  res.status(200).json(stays[index])
})

// DELETE /api/stays/:id — delete a stay
app.delete('/api/stays/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = stays.findIndex(s => s.id === id)

  if (index === -1) {
    return res.status(404).json({ error: `Stay with id ${id} not found` })
  }

  stays.splice(index, 1)
  res.status(204).send()
})

// Health check root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'VanaVas API is running' })
})

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong on the server' })
})

app.listen(PORT, () => {
  console.log(`VanaVas backend running on port ${PORT}`)
})
