import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const destinations = ['Mussoorie', 'Chopta', 'Munsiyari', 'Lansdowne', 'Chakrata', 'Auli']

export default function Hero() {
  const [query,    setQuery]    = useState('')
  const [focused,  setFocused]  = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/explore')
  }

  return (
    <section className="relative overflow-hidden bg-[#fdf8f2] pt-16 pb-24">

      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2d7a4f]/6 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#a96f2b]/6 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="section-pad relative z-10">

        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-[#e8f5ee] text-[#2d7a4f] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#2d7a4f]/20 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d7a4f] animate-pulse" />
            Uttarakhand's #1 Homestay Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="display-font text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1c1c1c] leading-tight mb-6 max-w-3xl mx-auto">
          Sleep where the{' '}
          <span className="text-[#2d7a4f] relative inline-block">
            mountains
            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
              <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#a96f2b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </span>{' '}
          are your hosts
        </h1>

        {/* Subheadline */}
        <p className="text-center text-[#555] text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Discover handpicked rural homestays across Uttarakhand — verified hosts, real experiences, zero middlemen.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className={`max-w-xl mx-auto flex items-center gap-2 bg-white border-2 rounded-full px-3 py-2 shadow-lg transition-all duration-200
            ${focused ? 'border-[#2d7a4f] shadow-[#2d7a4f]/20 shadow-xl' : 'border-[#e8dfc8]'}`}
        >
          <svg className="w-5 h-5 text-[#888] flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L22 21m-4.343-4.343A8 8 0 1 0 5.343 5.343a8 8 0 0 0 12.314 12.314z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search by location, e.g. Chopta, Mussoorie…"
            className="flex-1 bg-transparent outline-none text-sm text-[#1c1c1c] placeholder-[#aaa] py-1"
          />
          <button type="submit" className="btn-primary text-sm py-2 px-5 flex-shrink-0">
            Search
          </button>
        </form>

        {/* Quick destination pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          <span className="text-xs text-[#888] self-center">Popular:</span>
          {destinations.map(d => (
            <button
              key={d}
              onClick={() => navigate('/explore')}
              className="text-xs bg-white border border-[#e8dfc8] hover:border-[#2d7a4f] hover:text-[#2d7a4f] text-[#555] px-3 py-1 rounded-full transition-all duration-150"
            >
              {d}
            </button>
          ))}
        </div>

        {/* Trust stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-14">
          {[
            { value: '120+', label: 'Verified homestays' },
            { value: '4.8★', label: 'Average rating' },
            { value: '12',   label: 'Districts covered' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="display-font text-2xl font-bold text-[#2d7a4f]">{value}</div>
              <div className="text-xs text-[#888] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
