import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import HomestayCard from '../components/HomestayCard'
import { ALL_STAYS } from '../data/stays'

const FEATURED_STAYS = ALL_STAYS.slice(0, 6)
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
      <section className="py-16 bg-white dark:bg-[#0d2b1a]">
        <div className="section-pad">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#2d7a4f] uppercase tracking-widest mb-1">Handpicked for you</p>
              <h2 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white">Featured Homestays</h2>
            </div>
            <Link to="/explore" className="text-sm font-medium text-[#2d7a4f] hover:underline hidden sm:block">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_STAYS.map(stay => (
              <HomestayCard key={stay.id} stay={stay} />
            ))}
          </div>
        </div>
      </section>

      {/* Why VanaVas */}
      <section className="py-16 bg-[#fdf8f2] dark:bg-[#0a1f14]">
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
            Currently in progess 
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
