import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader, Toast } from '../components/ui'
import { generateTripPDF } from '../lib/tripPdf'

const API_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api/trips'
export default function MyTrips() {
  const { token } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' })

  useEffect(() => {
    fetch(`${API_URL}/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setTrips(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setToast({ visible: true, message: 'Failed to load your trips', type: 'error' })
        setLoading(false)
      })
  }, [token])

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#1a4a31] dark:text-white mb-2">My Trips</h1>
      <p className="text-[#666] dark:text-gray-300 mb-8">Your saved AI-planned trips.</p>

      {loading && <Loader size="lg" text="Loading your trips…" />}

      {!loading && trips.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[#666] dark:text-gray-300 mb-4">You haven't saved any trips yet.</p>
          <Link to="/trip-planner" className="text-[#2d7a4f] font-medium hover:underline">Plan a trip →</Link>
        </div>
      )}

      <div className="space-y-6">
        {trips.map(trip => (
          <div key={trip._id} className="rounded-2xl border border-[#e8dfc8] dark:border-[#1a4a31] p-5 bg-white dark:bg-[#0f2a1c]">
            <p className="text-xs text-[#999] mb-1">{new Date(trip.createdAt).toLocaleDateString()}</p>
            <p className="text-sm italic text-[#444] dark:text-gray-200 mb-3">"{trip.description}"</p>
            <div className="space-y-1 mb-3">
              {trip.picks.map(p => (
                <p key={p.stayId} className="text-sm text-[#1a4a31] dark:text-white">
                  • {p.title} — {p.location} — ₹{p.price}/night
                </p>
              ))}
            </div>
            <button
              onClick={() => generateTripPDF({
                description: trip.description,
                budget: trip.budget,
                travelers: trip.travelers,
                picks: trip.picks,
                itineraryText: trip.itineraryText,
              })}
              className="text-sm font-medium text-[#2d7a4f] hover:underline"
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />
    </div>
  )
}
