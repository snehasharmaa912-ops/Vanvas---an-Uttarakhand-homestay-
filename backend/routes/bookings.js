import { Router } from 'express'
import Booking from '../models/Booking.js'
import Stay from '../models/Stay.js'
import { requireAuth } from '../middleware/auth.js'
import { validate, bookingSchema, bookingStatusSchema } from '../middleware/validate.js'

const router = Router()

// Traveler creates a booking request → notifies host in real time
router.post('/', requireAuth, validate(bookingSchema), async (req, res) => {
  try {
    const { stayId, checkIn, checkOut, guests, message } = req.body
    const stay = await Stay.findById(stayId)
    if (!stay) return res.status(404).json({ error: 'Stay not found' })
    if (!stay.hostId) {
      return res.status(400).json({ error: 'This property is not yet available for booking requests' })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Please provide a valid check-in and check-out date' })
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const totalPrice = nights * stay.price

    const booking = await Booking.create({
      stay: stay._id,
      guest: req.userId,
      host: stay.hostId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || 1,
      totalPrice,
      message: message || '',
    })

    const populated = await booking.populate([
      { path: 'stay', select: 'title location image price' },
      { path: 'guest', select: 'name email' },
    ])

    req.app.get('io').to(`host:${stay.hostId}`).emit('booking:new', populated)

    res.status(201).json(populated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// Traveler's own bookings
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.userId })
      .populate('stay', 'title location image price')
      .sort('-createdAt')
    res.status(200).json(bookings)
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// Host's incoming requests
router.get('/host', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.userId })
      .populate('stay', 'title location image price')
      .populate('guest', 'name email')
      .sort('-createdAt')
    res.status(200).json(bookings)
  } catch {
    res.status(500).json({ error: 'Failed to fetch booking requests' })
  }
})

// Host confirms/declines · guest cancels → both sides notified live
router.patch('/:id/status', requireAuth, validate(bookingStatusSchema), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ error: 'Booking not found' })

    const { status } = req.body
    const isHost = booking.host.toString() === req.userId
    const isGuest = booking.guest.toString() === req.userId

    if (status === 'cancelled' && !isGuest) {
      return res.status(403).json({ error: 'Only the guest can cancel this booking' })
    }
    if ((status === 'confirmed' || status === 'declined') && !isHost) {
      return res.status(403).json({ error: 'Only the host can respond to this booking' })
    }

    booking.status = status
    await booking.save()

    const populated = await booking.populate([
      { path: 'stay', select: 'title location image price' },
      { path: 'guest', select: 'name email' },
    ])

    const io = req.app.get('io')
    io.to(`guest:${booking.guest}`).emit('booking:statusUpdate', populated)
    io.to(`host:${booking.host}`).emit('booking:statusUpdate', populated)

    res.status(200).json(populated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' })
  }
})

export default router
