import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal, Button, Input } from './ui'
import { useAuth } from '../context/AuthContext'

const API_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api/bookings'

export default function BookingModal({ stay, isOpen, onClose }) {
  const { token } = useAuth()
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1, message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)))
    : 0
  const total = nights * (stay?.price || 0)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.checkIn || !form.checkOut) {
      setError('Please select both check-in and check-out dates')
      return
    }
    if (nights <= 0) {
      setError('Check-out must be after check-in')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          stayId: stay._id || stay.id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: Number(form.guests) || 1,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking request failed')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setForm({ checkIn: '', checkOut: '', guests: 1, message: '' })
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={success ? 'Request sent!' : `Book ${stay?.title || ''}`}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e8f5ee] flex items-center justify-center text-3xl"
            >
              ✅
            </motion.div>
            <p className="text-[#1c1c1c] font-semibold mb-1">Your request has been sent to the host</p>
            <p className="text-sm text-[#888] mb-5">You'll be notified as soon as they respond.</p>
            <Button variant="primary" size="md" className="w-full" onClick={handleClose}>
              Done
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input label="Check-in" type="date" name="checkIn" value={form.checkIn} onChange={handleChange} />
              <Input label="Check-out" type="date" name="checkOut" value={form.checkOut} onChange={handleChange} />
            </div>
            <Input label="Guests" type="number" name="guests" value={form.guests} onChange={handleChange} />
            <div>
              <label className="block text-xs font-semibold text-[#555] mb-1">Message to host (optional)</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={3}
                placeholder="Anything the host should know?"
                className="w-full border border-[#e8dfc8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2d7a4f] resize-none"
              />
            </div>

            {nights > 0 && (
              <div className="bg-[#f7fdf9] border border-[#e8dfc8] rounded-xl p-3 flex items-center justify-between text-sm">
                <span className="text-[#666]">{nights} night{nights > 1 ? 's' : ''} × ₹{stay.price?.toLocaleString()}</span>
                <span className="font-bold text-[#2d7a4f]">₹{total.toLocaleString()}</span>
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {error}
              </motion.p>
            )}

            <Button variant="primary" size="lg" type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Sending request...' : 'Request to book →'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  )
}
