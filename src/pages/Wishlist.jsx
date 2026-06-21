import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomestayCard from '../components/HomestayCard'
import { ALL_STAYS } from '../data/stays'

const STORAGE_KEY = 'vanavas_wishlist'
export default function Wishlist() {
  const [savedIds, setSavedIds] = useState([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setSavedIds(raw ? JSON.parse(raw) : [])
    } catch {
      setSavedIds([])
    }
  }, [])
  const savedStays = ALL_STAYS.filter(stay => savedIds.includes(stay.id))

  return (
    <div className="py-12 bg-[#fdf8f2] dark:bg-[#0a1f14] min-h-screen">
      <div className="section-pad">
        <div className="mb-8">
          <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white mb-1">Your Wishlist</h1>
          <p className="text-[#777] dark:text-white/60 text-sm">
            {savedStays.length > 0
              ? `${savedStays.length} ${savedStays.length === 1 ? 'stay' : 'stays'} saved`
              : 'Stays you heart will show up here'}
          </p>
        </div>

        {savedStays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedStays.map(stay => (
              <HomestayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#aaa]">
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-lg font-medium text-[#666] dark:text-white/60">No saved stays yet.</p>
            <p className="text-sm text-[#999] dark:text-white/40 mt-1 mb-5">
              Tap the heart icon on any homestay to save it here.
            </p>
            <Link to="/explore" className="text-sm font-semibold text-[#2d7a4f] hover:underline">
              Explore homestays →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
