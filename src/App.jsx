import Admin from './pages/Admin'
import OAuthCallback from './pages/OAuthCallback'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import About from './pages/About'
import Login from './pages/Login'
import FAQs from './pages/FAQs'
import BookingPolicy from './pages/BookingPolicy'
import Cancellations from './pages/Cancellations'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import HostDashboard from './pages/HostDashboard'
import MyBookings from './pages/MyBookings'
import TripPlanner from './pages/TripPlanner'
import MyTrips from './pages/MyTrips'

const PAGE_TITLES = {
  '/':               'VanaVas — Uttarakhand Homestays',
  '/explore':        'Explore Homestays | VanaVas',
  '/trip-planner':   'AI Trip Planner | VanaVas',
  '/my-trips':       'My Trips | VanaVas',
  '/about':          'About | VanaVas',
  '/login':          'Sign In | VanaVas',
  '/faqs':           'FAQs | VanaVas',
  '/booking-policy': 'Booking Policy | VanaVas',
  '/cancellations':  'Cancellations | VanaVas',
  '/privacy-policy': 'Privacy Policy | VanaVas',
  '/wishlist':       'Your Wishlist | VanaVas',
  '/admin':          'Admin Panel | VanaVas',
  '/host-dashboard': 'Host Dashboard | VanaVas',
  '/my-bookings':    'My Bookings | VanaVas',
}

export default function App() {
  const location = useLocation()
  const { pathname, hash } = location

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
    document.title = PAGE_TITLES[pathname] || 'Page Not Found | VanaVas'
  }, [pathname, hash])

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={pathname}>
            <Route path="/"               element={<PageTransition><Home /></PageTransition>} />
            <Route path="/explore"        element={<PageTransition><Explore /></PageTransition>} />
            <Route path="/trip-planner"   element={<PageTransition><TripPlanner /></PageTransition>} />
            <Route path="/about"          element={<PageTransition><About /></PageTransition>} />
            <Route path="/login"          element={<PageTransition><Login /></PageTransition>} />
            <Route path="/faqs"           element={<PageTransition><FAQs /></PageTransition>} />
            <Route path="/booking-policy" element={<PageTransition><BookingPolicy /></PageTransition>} />
            <Route path="/cancellations"  element={<PageTransition><Cancellations /></PageTransition>} />
            <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
            <Route path="/oauth/callback" element={<PageTransition><OAuthCallback /></PageTransition>} />
            <Route
              path="/wishlist"
              element={<ProtectedRoute><PageTransition><Wishlist /></PageTransition></ProtectedRoute>}
            />
            <Route
              path="/my-bookings"
              element={<ProtectedRoute><PageTransition><MyBookings /></PageTransition></ProtectedRoute>}
            />
            <Route
              path="/my-trips"
              element={<ProtectedRoute><PageTransition><MyTrips /></PageTransition></ProtectedRoute>}
            />
            <Route
              path="/host-dashboard"
              element={<ProtectedRoute hostOnly><PageTransition><HostDashboard /></PageTransition></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute adminOnly><PageTransition><Admin /></PageTransition></ProtectedRoute>}
            />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
