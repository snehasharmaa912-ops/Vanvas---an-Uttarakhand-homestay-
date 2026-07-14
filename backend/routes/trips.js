import { Router } from 'express'
import Trip from '../models/Trip.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, async (req, res) => {
  try {
    const { description, budget, travelers, picks, itineraryText } = req.body
    if (!description || !Array.isArray(picks) || picks.length === 0 || !itineraryText) {
      return res.status(400).json({ error: 'description, picks and itineraryText are required' })
    }

    const trip = await Trip.create({
      user: req.userId,
      description,
      budget,
      travelers,
      picks: picks.map(p => ({
        stayId: p._id?.toString() || p.stayId,
        title: p.title,
        location: p.location,
        price: p.price,
        image: p.image,
        reason: p.reason,
      })),
      itineraryText,
    })

    res.status(201).json(trip)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save trip' })
  }
})

router.get('/mine', requireAuth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort('-createdAt')
    res.status(200).json(trips)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your trips' })
  }
})

export default router
