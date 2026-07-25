import { Router } from 'express'
import Wishlist from '../models/Wishlist.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/ids', requireAuth, async (req, res) => {
  try {
    const entries = await Wishlist.find({ user: req.userId }).select('stay')
    res.status(200).json(entries.map(e => e.stay.toString()))
  } catch {
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const entries = await Wishlist.find({ user: req.userId })
      .populate('stay')
      .sort('-createdAt')
    const stays = entries.filter(e => e.stay).map(e => e.stay)
    res.status(200).json(stays)
  } catch {
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
})

router.post('/:stayId', requireAuth, async (req, res) => {
  try {
    const entry = await Wishlist.findOneAndUpdate(
      { user: req.userId, stay: req.params.stayId },
      { user: req.userId, stay: req.params.stayId },
      { upsert: true, new: true }
    )
    res.status(201).json({ stayId: entry.stay })
  } catch {
    res.status(500).json({ error: 'Failed to add to wishlist' })
  }
})

router.delete('/:stayId', requireAuth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.userId, stay: req.params.stayId })
    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Failed to remove from wishlist' })
  }
})
export default router
