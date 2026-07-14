import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

function VanaVasLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <svg width="38" height="38" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <circle cx="40" cy="40" r="38" fill="#1a4a31"/>
        <polygon points="40,10 58,38 22,38" fill="#e8f5ee" opacity="0.5"/>
        <polygon points="40,13 60,42 20,42" fill="#2d7a4f"/>
        <polygon points="40,13 48,26 32,26" fill="#ffffff" opacity="0.9"/>
        <polygon points="25,55 30,42 35,55" fill="#1D6B3E"/>
        <polygon points="33,55 40,40 47,55" fill="#236040"/>
        <polygon points="45,55 50,42 55,55" fill="#1D6B3E"/>
        <ellipse cx="40" cy="57" rx="28" ry="6" fill="#236040"/>
        <circle cx="22" cy="22" r="5" fill="#f5c842" opacity="0.9"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span style={{ fontFamily: "Georgia, serif" }} className="text-xl font-bold text-[#1a4a31] tracking-tight">
          Vana<span className="text-[#2d7a4f]">Vas</span>
        </span>
        <span className="text-[9px] tracking-[2px] text-[#a96f2b] uppercase font-medium mt-0.5">
          Uttarakhand
        </span>
      </div>
    </Link>
  )
}
const links = [
  { to: '/',             label: 'Home' },
  { to: '/explore',      label: 'Explore' },
  { to: '/trip-planner', label: 'AI Trip Planner' },
  { to: '/about',        label: 'About' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { dark, setDark } = useTheme()
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-[#fdf8f2]/95 backdrop-blur-sm border-b border-[#e8dfc8]
        transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}
    >
      <nav className="section-pad py-0">
        <div className="flex items-center justify-between h-16">

          <VanaVasLogo />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {links.map(({ to, label }) => {
              const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className="relative px-4 py-2 rounded-full text-sm font-medium"
                >
                  {isActive && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 bg-[#2d7a4f] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-150 ${isActive ? 'text-white' : 'text-[#444] hover:text-[#2d7a4f]'}`}>
                    {label}
                  </span>
                </NavLink>
              )
            })}
          </div>
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(d => !d)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e8dfc8] hover:bg-[#e8f5ee] transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {/* Wishlist link */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e8dfc8] hover:bg-[#e8f5ee] transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-none stroke-[#444]" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {user?.userType === 'host' && (
              <Link to="/host-dashboard" className="text-sm font-medium text-[#444] hover:text-[#2d7a4f] transition-colors">
                Host dashboard
              </Link>
            )}
            {user && user.userType !== 'host' && user.role !== 'admin' && (
              <Link to="/my-bookings" className="text-sm font-medium text-[#444] hover:text-[#2d7a4f] transition-colors">
                My bookings
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-[#444] hover:text-[#2d7a4f] transition-colors">
                Admin panel
              </Link>
            )}
            <span className="text-xs text-[#999] hidden lg:block max-w-[140px] truncate">
              {user?.name}
            </span>
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-[#444] hover:text-red-500 transition-colors"
              >
                Log out
              </button>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 p-1"
          >
            <span className={`block h-0.5 bg-[#1c1c1c] rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-[#1c1c1c] rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-[#1c1c1c] rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#e8dfc8] py-4 flex flex-col gap-2">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'bg-[#2d7a4f] text-white' : 'text-[#444] hover:bg-[#e8f5ee]'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-[#2d7a4f] text-white' : 'text-[#444] hover:bg-[#e8f5ee]'}`
              }
            >
              Wishlist
            </NavLink>
            {user?.userType === 'host' && (
              <NavLink
                to="/host-dashboard"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'bg-[#2d7a4f] text-white' : 'text-[#444] hover:bg-[#e8f5ee]'}`
                }
              >
                Host dashboard
              </NavLink>
            )}
            {user && user.userType !== 'host' && user.role !== 'admin' && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'bg-[#2d7a4f] text-white' : 'text-[#444] hover:bg-[#e8f5ee]'}`
                }
              >
                My bookings
              </NavLink>
            )}
            <div className="pt-2 border-t border-[#e8dfc8] flex flex-col gap-2">
              {user?.role === 'admin' && (
                <Link to="/admin" className="px-4 py-2.5 text-sm font-medium text-[#444]">Admin panel</Link>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 text-sm font-medium text-left text-red-500"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
