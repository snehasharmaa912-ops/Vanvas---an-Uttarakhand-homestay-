import Hero from '../components/Hero'
import HomestayCard from '../components/HomestayCard'
const SAMPLE_STAYS = [
  { id: 1, title: 'Himalayan Pine Cottage',      location: 'Chopta, Rudraprayag',     price: 1400, rating: 4.9, reviews: 38, tags: ['Forest view', 'Trekking', 'Bonfire'], host: 'Ramesh Ji',   eco: true,  image: 'https://picsum.photos/seed/1/400/300' },
  { id: 2, title: 'Valley View Family Stay',      location: 'Munsiyari, Pithoragarh',  price: 1100, rating: 4.7, reviews: 21, tags: ['Mountain view', 'Farm fresh meals'],  host: 'Sunita Devi', eco: true,  image: 'https://picsum.photos/seed/2/400/300' },
  { id: 3, title: 'Riverside Bamboo Cottage',     location: 'Lansdowne, Pauri Garhwal',price: 950,  rating: 4.6, reviews: 15, tags: ['Riverside', 'Bird watching'],          host: 'Mohan Das',   eco: false, image: 'https://picsum.photos/seed/3/400/300' },
  { id: 4, title: 'Deodar Forest Homestay',       location: 'Chakrata, Dehradun',      price: 1250, rating: 4.8, reviews: 29, tags: ['Dense forest', 'Waterfall nearby'],   host: 'Geeta Ji',    eco: true,  image: 'https://picsum.photos/seed/4/400/300' },
  { id: 5, title: 'Old Tehri Heritage Bungalow',  location: 'Tehri, Uttarakhand',      price: 1600, rating: 5.0, reviews: 12, tags: ['Heritage', 'Lake view', 'Kayaking'],  host: 'Arjun Singh', eco: false, image: 'https://picsum.photos/seed/5/400/300' },
  { id: 6, title: 'Kumaoni Village Farmstay',     location: 'Binsar, Almora',          price: 800,  rating: 4.5, reviews: 44, tags: ['Farm stay', 'Village walk', 'Organic'],host: 'Rekha Ji',    eco: true,  image: 'https://picsum.photos/seed/6/400/300' },
]

const WHY = [
  { icon: '🏡', title: 'Direct from host',   desc: 'No middlemen. Book directly and support local families.' },
  { icon: '✅', title: 'Verified stays',      desc: 'Every listing is personally reviewed for quality and safety.' },
  { icon: '🌿', title: 'Eco-certified',       desc: 'Stays rated on sustainability — waste, energy, local sourcing.' },
  { icon: '🗣️', title: 'Local experiences', desc: 'Trek, cook, farm — genuine Uttarakhand culture, not touristy.' },
]

export default function Home() {
  return (
    <>
      <Hero />

      {/* Featured stays */}
      <section className="py-16 bg-white">
        <div className="section-pad">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-1">Handpicked for you</p>
              <h2 className="display-font text-3xl font-bold text-[#1c1c1c]">Featured Homestays</h2>
            </div>
            <a href="/explore" className="text-sm font-medium text-[#2d7a4f] hover:underline hidden sm:block">
              View all →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_STAYS.map(stay => (
              <HomestayCard key={stay.id} stay={stay} />
            ))}
          </div>
        </div>
      </section>

      {/* Why VanaVas */}
      <section className="py-16 bg-[#fdf8f2]">
        <div className="section-pad">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-1">Why travelers love us</p>
            <h2 className="display-font text-3xl font-bold text-[#1c1c1c]">The VanaVas difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#e8dfc8] p-6 text-center hover:border-[#2d7a4f]/30 transition-colors">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-[#1c1c1c] mb-2">{title}</h3>
                <p className="text-sm text-[#777] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Trip Planner teaser */}
      <section className="py-16 bg-[#1a4a31] text-white">
        <div className="section-pad text-center">
          <span className="inline-block bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Coming in Week 7
          </span>
          <h2 className="display-font text-3xl font-bold mb-4">
            Let AI plan your perfect Uttarakhand trip ✨
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
            Just tell us your vibe — budget, duration, what you love — and our AI will suggest the best homestays and a full itinerary.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 bg-white/10 text-white/40 border border-white/20 font-medium px-8 py-3 rounded-full cursor-not-allowed"
          >
            Try AI Trip Planner — Coming Soon
          </button>
        </div>
      </section>
    </>
  )
}
