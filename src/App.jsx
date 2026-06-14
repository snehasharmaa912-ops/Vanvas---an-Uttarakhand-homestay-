import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import About from './pages/About'
import Login from './pages/Login'
export default function App() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 page-enter">
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about"   element={<About />} />
          <Route path="/login"   element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
