import { useState } from 'react'
import HomestayCard from '../components/HomestayCard'
const ALL_STAYS = [
  { id: 1, title: 'Himalayan Pine Cottage',      location: 'Chopta, Rudraprayag',     price: 1400, rating: 4.9, reviews: 38, tags: ['Forest view', 'Trekking'],      host: 'Ramesh Ji',   eco: true,  image: 'https://picsum.photos/seed/chopta/400/300' },
  { id: 2, title: 'Valley View Family Stay',      location: 'Munsiyari, Pithoragarh',  price: 1100, rating: 4.7, reviews: 21, tags: ['Mountain view', 'Farm meals'],  host: 'Sunita Devi', eco: true,  image: 'https://picsum.photos/seed/munsiyari/400/300' },
  { id: 3, title: 'Riverside Bamboo Cottage',     location: 'Lansdowne, Pauri',        price: 950,  rating: 4.6, reviews: 15, tags: ['Riverside', 'Bird watching'],   host: 'Mohan Das',   eco: false, image: 'https://picsum.photos/seed/lansdowne/400/300' },
  { id: 4, title: 'Deodar Forest Homestay',       location: 'Chakrata, Dehradun',      price: 1250, rating: 4.8, reviews: 29, tags: ['Forest', 'Waterfall'],          host: 'Geeta Ji',    eco: true,  image: 'https://picsum.photos/seed/chakrata/400/300' },
  { id: 5, title: 'Old Tehri Heritage Bungalow',  location: 'Tehri, Uttarakhand',      price: 1600, rating: 5.0, reviews: 12, tags: ['Heritage', 'Lake view'],        host: 'Arjun Singh', eco: false, image: 'https://picsum.photos/seed/tehri/400/300' },
  { id: 6, title: 'Kumaoni Village Farmstay',     location: 'Binsar, Almora',          price: 800,  rating: 4.5, reviews: 44, tags: ['Farm stay', 'Village walk'],    host: 'Rekha Ji',    eco: true,  image: 'https://picsum.photos/seed/almora/400/300' },
  { id: 7, title: 'Auli Ski Chalet',              location: 'Auli, Chamoli',           price: 2200, rating: 4.9, reviews: 18, tags: ['Snow view', 'Skiing nearby'],   host: 'Deepak Ji',   eco: false, image: 'https://picsum.photos/seed/auli/400/300' },
  { id: 8, title: 'Jim Corbett Edge Cottage',     location: 'Ramnagar, Nainital',      price: 1350, rating: 4.6, reviews: 31, tags: ['Jungle safari', 'Wildlife'],    host: 'Priya Devi',  eco: true,  image: 'https://picsum.photos/seed/corbett/400/300' },
]

const FILTERS = ['All', 'Eco-certified', 'Under ₹1000', 'Mountain view', 'Forest', 'Farm stay']

export default function Explore() {
  const [active, setActive]   = useState('All')
  const [sort,   setSort]     = useState('rating')

  const filtered = ALL_STAYS
    .filter(s => {
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
          <p className="text-[#777] text-sm">{filtered.length} stays found across Uttarakhand</p>
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

        {/* Grid */}
        {filtered.length > 0 ? (
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
