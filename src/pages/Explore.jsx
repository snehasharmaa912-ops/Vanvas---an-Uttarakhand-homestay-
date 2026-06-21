import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import HomestayCard from '../components/HomestayCard'
import { Loader } from '../components/ui'
import { ALL_STAYS } from '../data/stays'

const FILTERS = ['All', 'Eco-certified', 'Under ₹1000', 'Mountain view', 'Forest', 'Farm stay']

export default function Explore() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const filterParam = searchParams.get('filter')
  const [active,  setActive]  = useState(filterParam && FILTERS.includes(filterParam) ? filterParam : 'All')
  const [sort,    setSort]    = useState('rating')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (filterParam && FILTERS.includes(filterParam)) {
      setActive(filterParam)
    }
  }, [filterParam])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [active, sort, searchQuery])

  const filtered = ALL_STAYS
    .filter(s => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!s.title.toLowerCase().includes(q) && !s.location.toLowerCase().includes(q)) {
          return false
        }
      }
      if (active === 'All')           return true
      if (active === 'Eco-certified') return s.eco
      if (active === 'Under ₹1000')   return s.price < 1000
      return s.tags.some(t => t.toLowerCase().includes(active.toLowerCase()))
    })
    .sort((a, b) => sort === 'price' ? a.price - b.price : b.rating - a.rating)

  return (
    <div className="py-12 bg-[#fdf8f2] dark:bg-[#0a1f14] min-h-screen">
      <div className="section-pad">
        {/* Header */}
        <div className="mb-8">
          <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white mb-1">Explore Homestays</h1>
          <p className="text-[#777] text-sm">
            {filtered.length} stays found across Uttarakhand
            {searchQuery && <span> for "<span className="font-medium text-[#2d7a4f]">{searchQuery}</span>"</span>}
          </p>
        </div>
        {/* Filter + Sort row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all duration-150
                  ${active === f
                    ? 'bg-[#2d7a4f] border-[#2d7a4f] text-white'
                    : 'bg-white dark:bg-[#1a4a31] border-[#e8dfc8] dark:border-[#2d7a4f]/30 text-[#555] dark:text-white/70 hover:border-[#2d7a4f] hover:text-[#2d7a4f]'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-[#e8dfc8] dark:border-[#2d7a4f]/30 bg-white dark:bg-[#1a4a31] text-[#555] dark:text-white px-4 py-1.5 rounded-full outline-none focus:border-[#2d7a4f] cursor-pointer"
          >
            <option value="rating">Sort: Top rated</option>
            <option value="price">Sort: Price low to high</option>
          </select>
        </div>
        {/* Grid / Loader / Empty state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Loader key={i} type="skeleton" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(stay => (
              <HomestayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#aaa]">
            <div className="text-5xl mb-4">🏔️</div>
            <p className="text-lg font-medium text-[#666]">No stays found for this filter.</p>
            <button onClick={() => setActive('All')} className="mt-4 text-sm text-[#2d7a4f] hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
