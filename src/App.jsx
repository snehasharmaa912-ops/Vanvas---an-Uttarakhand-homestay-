import { Routes, Route, useLocation } from 'react-router-dom'
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

const PAGE_TITLES = {
  '/':               'VanaVas — Uttarakhand Homestays',
  '/explore':        'Explore Homestays | VanaVas',
  '/about':          'About | VanaVas',
  '/login':          'Sign In | VanaVas',
  '/faqs':           'FAQs | VanaVas',
  '/booking-policy': 'Booking Policy | VanaVas',
  '/cancellations':  'Cancellations | VanaVas',
  '/privacy-policy': 'Privacy Policy | VanaVas',
  '/wishlist':       'Your Wishlist | VanaVas',
}
export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = PAGE_TITLES[pathname] || 'Page Not Found | VanaVas'
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f2] dark:bg-[#0a1f14] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 page-enter">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/explore"        element={<Explore />} />
          <Route path="/about"          element={<About />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/faqs"           element={<FAQs />} />
          <Route path="/booking-policy" element={<BookingPolicy />} />
          <Route path="/cancellations"  element={<Cancellations />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/wishlist"       element={<Wishlist />} />
          <Route path="*"                element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
