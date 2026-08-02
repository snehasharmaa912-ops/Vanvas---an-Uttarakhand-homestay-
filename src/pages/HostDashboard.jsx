import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { socket } from '../lib/socket'
import { Toast, Loader } from '../components/ui'
import { API_BASE_URL } from '../lib/api'

const BOOKINGS_URL = `${API_BASE_URL}/api/bookings`
const STAYS_URL = `${API_BASE_URL}/api/stays`

const STATUS_STYLES = {
  pending:   { label: 'Pending',   dot: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmed', dot: 'bg-[#2d7a4f]',  text: 'text-[#2d7a4f]', bg: 'bg-[#e8f5ee]' },
  declined:  { label: 'Declined',  dot: 'bg-red-400',   text: 'text-red-500',   bg: 'bg-red-50' },
  cancelled: { label: 'Cancelled', dot: 'bg-gray-400',  text: 'text-gray-500',  bg: 'bg-gray-50' },
}

const EMPTY_STAY_FORM = {
  title: '', location: '', price: '', rating: '', reviews: '', eco: false, image: '', tags: '',
}

export default function HostDashboard() {
  const { user, token } = useAuth()
  const [tab, setTab] = useState('bookings')

  // --- Bookings state ---
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const [pulse, setPulse] = useState(false)
  const [filter, setFilter] = useState('all')

  // --- My Stays state ---
  const [stays, setStays] = useState([])
  const [staysLoading, setStaysLoading] = useState(true)
  const [stayForm, setStayForm] = useState(EMPTY_STAY_FORM)
  const [editingStayId, setEditingStayId] = useState(null)
  const [showStayForm, setShowStayForm] = useState(false)
  const [stayPulse, setStayPulse] = useState(false)

  const showToast = (message, type = 'success') => setToast({ visible: true, message, type })

  // --- Bookings: fetch + realtime ---
  const fetchBookings = useCallback(() => {
    setLoading(true)
    fetch(`${BOOKINGS_URL}/host`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { showToast('Failed to load booking requests', 'error'); setLoading(false) })
  }, [token])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  // --- My Stays: fetch ---
  const fetchMyStays = useCallback(() => {
    setStaysLoading(true)
    fetch(`${STAYS_URL}/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setStays(Array.isArray(data) ? data : []); setStaysLoading(false) })
      .catch(() => { showToast('Failed to load your stays', 'error'); setStaysLoading(false) })
  }, [token])

  useEffect(() => { fetchMyStays() }, [fetchMyStays])

  // --- Single shared socket connection for both bookings and stays ---
  useEffect(() => {
    if (!user?.id) return
    socket.connect()
    socket.emit('join:host', user.id)

    const onNewBooking = booking => {
      setBookings(prev => [booking, ...prev])
      setPulse(true)
      showToast(`New booking request for ${booking.stay?.title || 'your stay'}`, 'success')
      setTimeout(() => setPulse(false), 2000)
    }
    const onUpdateBooking = updated => {
      setBookings(prev => prev.map(b => (b._id === updated._id ? updated : b)))
    }

    // Real-time sync for this host's own stay listings — if this host (or an
    // admin) creates/edits/deletes a stay linked to this account, reflect it
    // immediately without needing a page refresh.
    const isMine = stay => stay?.hostId === user.id || stay?.hostId?._id === user.id
    const onStayCreated = stay => {
      if (!isMine(stay)) return
      setStays(prev => [stay, ...prev])
      setStayPulse(true)
      showToast(`"${stay.title}" is now live`, 'success')
      setTimeout(() => setStayPulse(false), 2000)
    }
    const onStayUpdated = stay => {
      if (!isMine(stay)) return
      setStays(prev => prev.map(s => (s._id === stay._id ? stay : s)))
    }
    const onStayDeleted = ({ id }) => {
      setStays(prev => prev.filter(s => s._id !== id))
    }

    socket.on('booking:new', onNewBooking)
    socket.on('booking:statusUpdate', onUpdateBooking)
    socket.on('stay:created', onStayCreated)
    socket.on('stay:updated', onStayUpdated)
    socket.on('stay:deleted', onStayDeleted)

    return () => {
      socket.off('booking:new', onNewBooking)
      socket.off('booking:statusUpdate', onUpdateBooking)
      socket.off('stay:created', onStayCreated)
      socket.off('stay:updated', onStayUpdated)
      socket.off('stay:deleted', onStayDeleted)
      socket.disconnect()
    }
  }, [user?.id])

  const respond = async (id, status) => {
    try {
      const res = await fetch(`${BOOKINGS_URL}/${id}/status`, {
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

  // --- My Stays: form handlers ---
  const handleStayChange = e => {
    const { name, value, type, checked } = e.target
    setStayForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleStaySubmit = async e => {
    e.preventDefault()
    const payload = {
      ...stayForm,
      price: Number(stayForm.price),
      rating: Number(stayForm.rating) || 0,
      reviews: Number(stayForm.reviews) || 0,
      tags: stayForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    const url = editingStayId ? `${STAYS_URL}/${editingStayId}` : STAYS_URL
    const method = editingStayId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      showToast(editingStayId ? 'Stay updated' : 'Stay added — it\'s now live on Explore')
      setStayForm(EMPTY_STAY_FORM)
      setEditingStayId(null)
      setShowStayForm(false)
      // The socket event will patch state in real time for this session, but
      // refetch as a fallback in case the socket connection dropped.
      fetchMyStays()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleEditStay = stay => {
    setStayForm({
      title: stay.title || '',
      location: stay.location || '',
      price: stay.price || '',
      rating: stay.rating || '',
      reviews: stay.reviews || '',
      eco: stay.eco || false,
      image: stay.image || '',
      tags: (stay.tags || []).join(', '),
    })
    setEditingStayId(stay._id)
    setShowStayForm(true)
  }

  const handleDeleteStay = async id => {
    if (!window.confirm('Delete this stay? This cannot be undone.')) return
    try {
      const res = await fetch(`${STAYS_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status !== 204) throw new Error('Delete failed')
      showToast('Stay deleted')
      setStays(prev => prev.filter(s => s._id !== id))
    } catch {
      showToast('Delete failed', 'error')
    }
  }

  const handleCancelStayForm = () => {
    setStayForm(EMPTY_STAY_FORM)
    setEditingStayId(null)
    setShowStayForm(false)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="py-10 bg-[#fdf8f2] dark:bg-[#0a1f14] min-h-screen">
      <div className="section-pad max-w-4xl">

        <div className="flex items-center gap-3 mb-2">
          <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white">Host Dashboard</h1>
          <motion.span
            animate={(pulse || stayPulse) ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.6 }}
            className="w-2.5 h-2.5 rounded-full bg-[#2d7a4f]"
            title="Live"
          />
        </div>
        <p className="text-sm text-[#777] dark:text-white/60 mb-6">
          Manage your listings and booking requests — everything here updates live via WebSocket.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'bookings', label: 'Booking requests' },
            { key: 'stays', label: 'My stays' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm font-semibold px-5 py-2 rounded-full border transition-colors
                ${tab === t.key
                  ? 'bg-[#2d7a4f] text-white border-[#2d7a4f]'
                  : 'text-[#666] border-[#e8dfc8] hover:bg-[#e8f5ee]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <>
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
          </>
        )}

        {tab === 'stays' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#777] dark:text-white/60">
                {stays.length} stay{stays.length !== 1 ? 's' : ''} listed under your account
              </p>
              {!showStayForm && (
                <button onClick={() => setShowStayForm(true)} className="btn-primary text-sm py-2 px-5">
                  + Add new stay
                </button>
              )}
            </div>

            {showStayForm && (
              <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold text-[#1c1c1c] dark:text-white mb-4">
                  {editingStayId ? 'Edit stay' : 'Add new stay'}
                </h2>
                <form onSubmit={handleStaySubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'title', label: 'Title', placeholder: 'Himalayan Pine Cottage' },
                    { name: 'location', label: 'Location', placeholder: 'Chopta, Rudraprayag' },
                    { name: 'price', label: 'Price per night (₹)', placeholder: '1400', type: 'number' },
                    { name: 'rating', label: 'Rating', placeholder: '4.9', type: 'number' },
                    { name: 'reviews', label: 'Reviews count', placeholder: '38', type: 'number' },
                    { name: 'image', label: 'Image URL', placeholder: 'https://picsum.photos/seed/name/400/300' },
                    { name: 'tags', label: 'Tags (comma separated)', placeholder: 'Forest view, Trekking' },
                  ].map(({ name, label, placeholder, type = 'text' }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-[#555] dark:text-white/70 mb-1">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={stayForm[name]}
                        onChange={handleStayChange}
                        placeholder={placeholder}
                        className="w-full border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#0d2b1a] text-[#1c1c1c] dark:text-white outline-none focus:border-[#2d7a4f]"
                      />
                    </div>
                  ))}

                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="checkbox"
                      name="eco"
                      id="eco"
                      checked={stayForm.eco}
                      onChange={handleStayChange}
                      className="w-4 h-4 accent-[#2d7a4f]"
                    />
                    <label htmlFor="eco" className="text-sm text-[#555] dark:text-white/70 font-medium">Eco-certified</label>
                  </div>

                  <div className="sm:col-span-2 flex gap-3 mt-2">
                    <button type="submit" className="btn-primary text-sm py-2 px-6">
                      {editingStayId ? 'Update stay' : 'Create stay'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelStayForm}
                      className="btn-outline text-sm py-2 px-6"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {staysLoading ? (
              <Loader />
            ) : stays.length === 0 ? (
              <div className="text-center py-16 text-[#888]">
                <p className="text-4xl mb-3">🏡</p>
                <p className="text-sm">You haven't listed any stays yet. Add your first one above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {stays.map(stay => (
                    <motion.div
                      key={stay._id}
                      layout
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between gap-4 bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl px-5 py-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {stay.image && (
                          <img src={stay.image} alt={stay.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1c1c1c] dark:text-white text-sm truncate">{stay.title}</p>
                          <p className="text-xs text-[#888] dark:text-white/50 truncate">{stay.location}</p>
                          <p className="text-xs text-[#2d7a4f] font-medium">₹{stay.price?.toLocaleString()}/night</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditStay(stay)}
                          className="text-xs font-semibold text-[#2d7a4f] border border-[#2d7a4f] px-3 py-1.5 rounded-full hover:bg-[#2d7a4f] hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStay(stay._id)}
                          className="text-xs font-semibold text-red-500 border border-red-400 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
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
