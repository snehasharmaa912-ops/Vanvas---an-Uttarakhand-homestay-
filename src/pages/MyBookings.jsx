import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { socket } from '../lib/socket'
import { Toast, Loader } from '../components/ui'
import { API_BASE_URL } from '../lib/api'

const API_URL = `${API_BASE_URL}/api/bookings`

const STATUS_STYLES = {
  pending:   { label: 'Awaiting host response', dot: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmed',               dot: 'bg-[#2d7a4f]', text: 'text-[#2d7a4f]', bg: 'bg-[#e8f5ee]' },
  declined:  { label: 'Declined',                dot: 'bg-red-400',   text: 'text-red-500',   bg: 'bg-red-50' },
  cancelled: { label: 'Cancelled',                dot: 'bg-gray-400',  text: 'text-gray-500',  bg: 'bg-gray-50' },
}

export default function MyBookings() {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => setToast({ visible: true, message, type })

  const fetchBookings = useCallback(() => {
    setLoading(true)
    fetch(`${API_URL}/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { showToast('Failed to load your bookings', 'error'); setLoading(false) })
  }, [token])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  useEffect(() => {
    if (!user?.id) return
    socket.connect()
    socket.emit('join:guest', user.id)

    const onUpdate = updated => {
      setBookings(prev => prev.map(b => (b._id === updated._id ? updated : b)))
      showToast(
        updated.status === 'confirmed'
          ? `${updated.stay?.title || 'Your booking'} was confirmed!`
          : `${updated.stay?.title || 'Your booking'} was ${updated.status}`,
        updated.status === 'confirmed' ? 'success' : 'error'
      )
    }

    socket.on('booking:statusUpdate', onUpdate)
    return () => {
      socket.off('booking:statusUpdate', onUpdate)
      socket.disconnect()
    }
  }, [user?.id])

  const cancelBooking = async id => {
    if (!window.confirm('Cancel this booking request?')) return
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to cancel')
      setBookings(prev => prev.map(b => (b._id === id ? data : b)))
      showToast('Booking cancelled')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="py-10 bg-[#fdf8f2] dark:bg-[#0a1f14] min-h-screen">
      <div className="section-pad max-w-4xl">
        <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white mb-1">My Bookings</h1>
        <p className="text-sm text-[#777] dark:text-white/60 mb-6">
          Status updates arrive live the moment your host responds.
        </p>

        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-[#888]">
            <p className="text-4xl mb-3">🧳</p>
            <p className="text-sm">You haven't requested any stays yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {bookings.map(b => {
                const s = STATUS_STYLES[b.status] || STATUS_STYLES.pending
                const nights = Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24))
                return (
                  <motion.div
                    key={b._id}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#1c1c1c] dark:text-white">{b.stay?.title || 'Stay'}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${s.bg} ${s.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </div>
                        <p className="text-xs text-[#888] dark:text-white/50">{b.stay?.location}</p>
                        <p className="text-xs text-[#888] dark:text-white/50 mt-1">
                          {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {nights} night{nights !== 1 ? 's' : ''} · {b.guests} guest{b.guests !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[#2d7a4f] font-bold">₹{b.totalPrice?.toLocaleString()}</p>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(b._id)}
                            className="text-xs font-semibold text-red-500 border border-red-400 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors mt-2"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
    </div>
  )
}
