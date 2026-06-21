import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const destinations = ['Mussoorie', 'Chopta', 'Munsiyari', 'Lansdowne', 'Chakrata', 'Auli']
const WORDS = ['mountains', 'forests', 'rivers', 'valleys', 'peaks']

export default function Hero() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    const word = WORDS[wordIdx]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 60)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIdx])
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(interval)
  }, [])
  const handleSearch = (e) => {
  e.preventDefault()
  navigate(query.trim() ? `/explore?q=${encodeURIComponent(query.trim())}` : '/explore')
  }
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a1f14]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#1a4a31] to-[#0d2b1a]" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2d7a4f]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#a96f2b]/15 blur-[100px] animate-pulse" style={{animationDelay:'1s'}} />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#2d7a4f]/10 blur-[80px] animate-pulse" style={{animationDelay:'2s'}} />
        {/* Mountain silhouette */}
        <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#2d7a4f" d="M0,320 L0,200 L120,120 L240,180 L360,80 L480,160 L600,60 L720,140 L840,40 L960,130 L1080,70 L1200,150 L1320,90 L1440,160 L1440,320 Z"/>
          <path fill="#1a4a31" d="M0,320 L0,240 L180,160 L300,220 L420,140 L540,200 L660,120 L780,190 L900,110 L1020,180 L1140,130 L1260,200 L1380,150 L1440,180 L1440,320 Z" opacity="0.7"/>
        </svg>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `floatP ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
        {/* Grid */}
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize:'60px 60px'}} />
      </div>
      {/* Main Content */}
      <div className="relative z-10 section-pad py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-5 py-2 rounded-full mb-8 hf1">
          <span className="w-2 h-2 rounded-full bg-[#4aab72] animate-pulse" />
          Uttarakhand's #1 Homestay Platform
          <span className="w-2 h-2 rounded-full bg-[#4aab72] animate-pulse" />
        </div>
        {/* Headline */}
        <h1 className="display-font text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 hf2">
          Sleep where the
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4aab72] via-[#a8e6c1] to-[#4aab72]"
            style={{backgroundSize:'200% auto', animation:'shimmerText 3s linear infinite'}}>
            {displayed}
          </span>
          <span className={`inline-block w-[3px] h-[0.8em] bg-[#4aab72] ml-1 align-middle transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
          <br />
          <span className="text-white">are your hosts</span>
        </h1>
        {/* Subtext */}
        <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed hf3">
          Discover handpicked rural homestays across Uttarakhand —
          <span className="text-[#a8e6c1]"> verified hosts</span>,
          <span className="text-[#a8e6c1]"> real experiences</span>,
          <span className="text-[#a8e6c1]"> zero middlemen</span>.
        </p>
        {/* Search */}
        <form onSubmit={handleSearch}
          className={`max-w-2xl mx-auto flex items-center gap-2 backdrop-blur-md border-2 rounded-2xl px-4 py-3 transition-all duration-300 hf4
            ${focused ? 'bg-white/15 border-[#4aab72] shadow-[0_0_30px_rgba(74,171,114,0.3)]' : 'bg-white/10 border-white/20'}`}>
          <svg className="w-5 h-5 text-white/60 flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L22 21m-4.343-4.343A8 8 0 1 0 5.343 5.343a8 8 0 0 0 12.314 12.314z" />
          </svg>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Search by location, e.g. Chopta, Mussoorie…"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40 py-1" />
          <button type="submit"
            className="bg-[#2d7a4f] hover:bg-[#4aab72] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,171,114,0.5)] flex-shrink-0">
            Search →
          </button>
        </form>
        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5 hf5">
          <span className="text-xs text-white/40 self-center">Popular:</span>
          {destinations.map(d => (
  <button key={d} onClick={() => navigate(`/explore?q=${encodeURIComponent(d)}`)}
              className="text-xs bg-white/10 hover:bg-[#2d7a4f]/60 border border-white/20 hover:border-[#4aab72] text-white/70 hover:text-white px-3 py-1.5 rounded-full transition-all duration-200">
              {d}
            </button>
          ))}
        </div>
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-16 hf5">
          {[
            { value: '30+', label: 'Verified Homestays', icon: '🏡' },
            { value: '4.8★', label: 'Average Rating', icon: '⭐' },
            { value: '12', label: 'Districts Covered', icon: '🗺️' },
          ].map(({ value, label, icon }) => (
            <div key={label} className="text-center group cursor-default">
              <div className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-200">{icon}</div>
              <div className="display-font text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4aab72] to-[#a8e6c1]">{value}</div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hf5">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </div>
      <style>{`
        @keyframes floatP {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .hf1 { animation: hFadeUp 0.7s ease forwards 0.1s; opacity: 0; }
        .hf2 { animation: hFadeUp 0.7s ease forwards 0.3s; opacity: 0; }
        .hf3 { animation: hFadeUp 0.7s ease forwards 0.5s; opacity: 0; }
        .hf4 { animation: hFadeUp 0.7s ease forwards 0.7s; opacity: 0; }
        .hf5 { animation: hFadeUp 0.7s ease forwards 0.9s; opacity: 0; }
        @keyframes hFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
      }
