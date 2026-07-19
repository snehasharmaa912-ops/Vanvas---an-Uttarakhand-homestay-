import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader, Toast, Button } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { generateTripPDF } from '../lib/tripPdf'

const API_BASE = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api'
const QUICK_REFINEMENTS = ['Make it cheaper', 'More eco-friendly options', 'A different region']

export default function TripPlanner() {
  const { user, token } = useAuth()

  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('')

  const [picksLoading, setPicksLoading] = useState(false)
  const [picks, setPicks] = useState([])

  const [itineraryText, setItineraryText] = useState('')
  const [itineraryStreaming, setItineraryStreaming] = useState(false)

  const [refineInput, setRefineInput] = useState('')
  const [refineLoading, setRefineLoading] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' })
  const showToast = (message, type = 'error') => setToast({ visible: true, message, type })

  const authHeaders = token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }

  const streamItinerary = async matchedPicks => {
    setItineraryStreaming(true)
    setItineraryText('')
    try {
      const res = await fetch(`${API_BASE}/ai/trip-planner/itinerary/stream`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          description: description.trim(),
          ...(budget && { budget: Number(budget) }),
          ...(travelers && { travelers: Number(travelers) }),
          picks: matchedPicks.map(p => ({ title: p.title, location: p.location })),
        }),
      })
      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setItineraryText(text)
      }
    } catch {
      showToast('Could not stream the itinerary. Please try again.')
    } finally {
      setItineraryStreaming(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (description.trim().length < 10) {
      showToast("Tell us a bit more about what you're looking for.")
      return
    }

    setPicksLoading(true)
    setPicks([])
    setItineraryText('')
    setSaved(false)

    try {
      const res = await fetch(`${API_BASE}/ai/trip-planner/picks`, {
        method: 'POST',
        headers: authHeaders,
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
      setPicks(data.picks)
      streamItinerary(data.picks) // fire-and-forget; UI shows the itinerary streaming in below
    } catch {
      showToast('Could not reach the server. Please try again.')
    } finally {
      setPicksLoading(false)
    }
  }

  const handleRefine = async message => {
    const text = message.trim()
    if (!text) return

    setRefineLoading(true)
    try {
      const res = await fetch(`${API_BASE}/ai/trip-planner/refine`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          description: description.trim(),
          ...(budget && { budget: Number(budget) }),
          ...(travelers && { travelers: Number(travelers) }),
          currentItineraryText: itineraryText,
          refinementMessage: text,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Could not refine the trip. Please try again.')
        return
      }
      setPicks(data.picks)
      setItineraryText(data.itineraryText)
      setSaved(false)
      setRefineInput('')
    } catch {
      showToast('Could not reach the server. Please try again.')
    } finally {
      setRefineLoading(false)
    }
  }

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          description: description.trim(),
          ...(budget && { budget: Number(budget) }),
          ...(travelers && { travelers: Number(travelers) }),
          picks,
          itineraryText,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Could not save this trip.')
        return
      }
      setSaved(true)
      showToast('Trip saved to My Trips!', 'success')
    } catch {
      showToast('Could not reach the server. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = () => {
    generateTripPDF({
      description: description.trim(),
      budget: budget ? Number(budget) : null,
      travelers: travelers ? Number(travelers) : null,
      picks,
      itineraryText,
    })
  }

  const hasResults = picks.length > 0
  const itineraryDone = hasResults && !itineraryStreaming && itineraryText.length > 0

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
        <Button type="submit" disabled={picksLoading}>
          {picksLoading ? 'Finding your matches…' : 'Plan my trip'}
        </Button>
        {!user && (
          <p className="text-xs text-[#999]">
            <Link to="/login" className="underline hover:text-[#2d7a4f]">Log in</Link> to save trips and get picks personalized to your booking history.
          </p>
        )}
      </form>

      {picksLoading && <Loader size="lg" text="Asking the AI to match your trip…" />}

      <AnimatePresence>
        {hasResults && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-xl font-semibold text-[#1a4a31] dark:text-white mb-4">Top matches for you</h2>
            <div className="grid gap-4 mb-10">
              {picks.map(stay => (
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

            <h2 className="text-xl font-semibold text-[#1a4a31] dark:text-white mb-4">
              Your itinerary {itineraryStreaming && <span className="inline-block w-2 h-2 rounded-full bg-[#2d7a4f] animate-pulse ml-1" />}
            </h2>
            <div className="rounded-2xl bg-[#fdf8f2] dark:bg-[#0a1f14] border border-[#e8dfc8] dark:border-[#1a4a31] p-5 mb-6 whitespace-pre-wrap text-sm text-[#444] dark:text-gray-200 leading-relaxed min-h-[80px]">
              {itineraryText || (itineraryStreaming ? 'Writing your itinerary…' : '')}
            </div>

            {itineraryDone && (
              <>
                {/* Refinement chat */}
                <div className="rounded-2xl border border-[#e8dfc8] dark:border-[#1a4a31] p-5 mb-6 bg-white dark:bg-[#0f2a1c]">
                  <p className="text-sm font-medium text-[#1a4a31] dark:text-white mb-3">Want to tweak it?</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_REFINEMENTS.map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleRefine(chip)}
                        disabled={refineLoading}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#2d7a4f] text-[#2d7a4f] hover:bg-[#e8f5ee] disabled:opacity-50 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={refineInput}
                      onChange={e => setRefineInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRefine(refineInput)}
                      placeholder="e.g. Add more river-view options"
                      disabled={refineLoading}
                      className="flex-1 rounded-xl border border-[#e8dfc8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] bg-white dark:bg-[#0f2a1c] dark:border-[#1a4a31]"
                    />
                    <button
                      onClick={() => handleRefine(refineInput)}
                      disabled={refineLoading || !refineInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[#2d7a4f] text-white text-sm font-medium disabled:opacity-50"
                    >
                      {refineLoading ? '…' : 'Send'}
                    </button>
                  </div>
                </div>

                {/* Save + Download */}
                <div className="flex flex-wrap gap-3">
                  {user ? (
                    <button
                      onClick={handleSave}
                      disabled={saving || saved}
                      className="px-5 py-2.5 rounded-full bg-[#2d7a4f] text-white text-sm font-medium disabled:opacity-60"
                    >
                      {saved ? '✓ Saved to My Trips' : saving ? 'Saving…' : 'Save to My Trips'}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="px-5 py-2.5 rounded-full border border-[#2d7a4f] text-[#2d7a4f] text-sm font-medium"
                    >
                      Log in to save this trip
                    </Link>
                  )}
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 rounded-full border border-[#e8dfc8] dark:border-[#1a4a31] text-[#444] dark:text-white text-sm font-medium hover:bg-[#e8f5ee] dark:hover:bg-[#0f2a1c] transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  )
      }
