import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { socket } from '../lib/socket'
import { Toast, Loader } from '../components/ui'

const API_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api/bookings'

const STATUS_STYLES = {
  pending:   { label: 'Pending',   dot: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmed', dot: 'bg-[#2d7a4f]',  text: 'text-[#2d7a4f]', bg: 'bg-[#e8f5ee]' },
  declined:  { label: 'Declined',  dot: 'bg-red-400',   text: 'text-red-500',   bg: 'bg-red-50' },
  cancelled: { label: 'Cancelled', dot: 'bg-gray-400',  text: 'text-gray-500',  bg: 'bg-gray-50' },
}

export default function HostDashboard() {
  const { user, token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const [pulse, setPulse] = useState(false)
  const [filter, setFilter] = useState('all')

  const showToast = (message, type = 'success') => setToast({ visible: true, message, type })

  const fetchBookings = useCallback(() => {
    setLoading(true)
    fetch(`${API_URL}/host`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { showToast('Failed to load booking requests', 'error'); setLoading(false) })
  }, [token])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  useEffect(() => {
    if (!user?.id) return
    socket.connect()
    socket.emit('join:host', user.id)

    const onNew = booking => {
      setBookings(prev => [booking, ...prev])
      setPulse(true)
      showToast(`New booking request for ${booking.stay?.title || 'your stay'}`, 'success')
      setTimeout(() => setPulse(false), 2000)
    }
    const onUpdate = updated => {
      setBookings(prev => prev.map(b => (b._id === updated._id ? updated : b)))
    }

    socket.on('booking:new', onNew)
    socket.on('booking:statusUpdate', onUpdate)

    return () => {
      socket.off('booking:new', onNew)
      socket.off('booking:statusUpdate', onUpdate)
      socket.disconnect()
    }
  }, [user?.id])

  const respond = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update booking')
      setBookings(prev => prev.map(b => (b._id === id ? data : b)))
      showToast(status === 'confirmed' ? 'Booking confirmed' : 'Booking declined', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="py-10 bg-[#fdf8f2] dark:bg-[#0a1f14] min-h-screen">
      <div className="section-pad max-w-4xl">

        <div className="flex items-center gap-3 mb-2">
          <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white">Host Dashboard</h1>
          <motion.span
            animate={pulse ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.6 }}
            className="w-2.5 h-2.5 rounded-full bg-[#2d7a4f]"
            title="Live"
          />
        </div>
        <p className="text-sm text-[#777] dark:text-white/60 mb-6">
          Real-time booking requests for your properties — connected live via WebSocket.
        </p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'confirmed', 'declined', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors capitalize
                ${filter === f
                  ? 'bg-[#2d7a4f] text-white border-[#2d7a4f]'
                  : 'text-[#666] border-[#e8dfc8] hover:bg-[#e8f5ee]'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#888]">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">No {filter !== 'all' ? filter : ''} booking requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map(b => {
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
                        <p className="text-xs text-[#888] dark:text-white/50">
                          {b.guest?.name} · {b.guest?.email}
                        </p>
                        <p className="text-xs text-[#888] dark:text-white/50 mt-1">
                          {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {nights} night{nights !== 1 ? 's' : ''} · {b.guests} guest{b.guests !== 1 ? 's' : ''}
                        </p>
                        {b.message && (
                          <p className="text-xs text-[#666] dark:text-white/60 italic mt-2 bg-[#f7fdf9] dark:bg-[#0d2b1a] rounded-lg px-3 py-2">
                            "{b.message}"
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[#2d7a4f] font-bold">₹{b.totalPrice?.toLocaleString()}</p>
                        {b.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => respond(b._id, 'confirmed')}
                              className="text-xs font-semibold text-white bg-[#2d7a4f] px-3 py-1.5 rounded-full hover:bg-[#236040] transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => respond(b._id, 'declined')}
                              className="text-xs font-semibold text-red-500 border border-red-400 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            >
                              Decline
                            </button>
                          </div>
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
