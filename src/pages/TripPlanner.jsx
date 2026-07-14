import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader, Toast, Button } from '../components/ui'

const API_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api/ai/trip-planner'

export default function TripPlanner() {
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' })

  const showToast = (message, type = 'error') => setToast({ visible: true, message, type })

  const handleSubmit = async e => {
    e.preventDefault()
    if (description.trim().length < 10) {
      showToast("Tell us a bit more about what you're looking for.")
      return
    }

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          ...(budget && { budget: Number(budget) }),
          ...(travelers && { travelers: Number(travelers) }),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Something went wrong. Please try again.')
        return
      }
      setResult(data)
    } catch {
      showToast('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#1a4a31] dark:text-white mb-2">AI Trip Planner</h1>
      <p className="text-[#666] dark:text-gray-300 mb-8">
        Describe your ideal Uttarakhand getaway and we'll match you with the best homestays and a 3-day itinerary.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. A quiet mountain retreat for 2, we love trekking and bonfires, budget around ₹1500/night"
          rows={4}
          className="w-full rounded-2xl border border-[#e8dfc8] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] bg-white dark:bg-[#0f2a1c] dark:border-[#1a4a31]"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            placeholder="Budget per night (₹, optional)"
            className="flex-1 rounded-xl border border-[#e8dfc8] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] bg-white dark:bg-[#0f2a1c] dark:border-[#1a4a31]"
          />
          <input
            type="number"
            value={travelers}
            onChange={e => setTravelers(e.target.value)}
            placeholder="Travelers (optional)"
            className="flex-1 rounded-xl border border-[#e8dfc8] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] bg-white dark:bg-[#0f2a1c] dark:border-[#1a4a31]"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Planning your trip…' : 'Plan my trip'}
        </Button>
      </form>

      {loading && <Loader size="lg" text="Asking the AI to plan your trip…" />}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold text-[#1a4a31] dark:text-white mb-4">Top matches for you</h2>
            <div className="grid gap-4 mb-10">
              {result.picks.map(stay => (
                <div key={stay._id} className="rounded-2xl border border-[#e8dfc8] dark:border-[#1a4a31] p-5 bg-white dark:bg-[#0f2a1c]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-[#1a4a31] dark:text-white">{stay.title}</h3>
                    <span className="text-sm text-[#2d7a4f] font-medium">₹{stay.price}/night</span>
                  </div>
                  <p className="text-sm text-[#666] dark:text-gray-300 mb-2">{stay.location}</p>
                  <p className="text-sm italic text-[#a96f2b] mb-3">{stay.reason}</p>
                  <Link to={`/explore?q=${encodeURIComponent(stay.title)}`} className="text-sm font-medium text-[#2d7a4f] hover:underline">
                    View & book →
                  </Link>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-[#1a4a31] dark:text-white mb-4">Your 3-day itinerary</h2>
            <div className="space-y-4">
              {result.itinerary.map(day => (
                <div key={day.day} className="rounded-2xl bg-[#fdf8f2] dark:bg-[#0a1f14] border border-[#e8dfc8] dark:border-[#1a4a31] p-5">
                  <p className="text-xs font-semibold text-[#2d7a4f] mb-1">DAY {day.day}</p>
                  <h3 className="font-semibold text-[#1a4a31] dark:text-white mb-1">{day.title}</h3>
                  <p className="text-sm text-[#666] dark:text-gray-300">{day.plan}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  )
}
