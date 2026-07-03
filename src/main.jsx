import { AuthProvider } from './context/AuthContext'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-logo animate-float">
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" fill="#236040"/>
          <polygon points="40,10 58,38 22,38" fill="#e8f5ee" opacity="0.5"/>
          <polygon points="40,13 60,42 20,42" fill="#4aab72"/>
          <polygon points="40,13 48,26 32,26" fill="#ffffff" opacity="0.9"/>
          <polygon points="25,55 30,42 35,55" fill="#1D6B3E"/>
          <polygon points="33,55 40,40 47,55" fill="#2d7a4f"/>
          <polygon points="45,55 50,42 55,55" fill="#1D6B3E"/>
          <ellipse cx="40" cy="57" rx="28" ry="6" fill="#236040"/>
          <circle cx="22" cy="22" r="5" fill="#f5c842" opacity="0.9"/>
        </svg>
      </div>
      <div className="splash-title">VanaVas</div>
      <div className="splash-sub">Uttarakhand</div>
      <div className="splash-dots">
        <div className="splash-dot"></div>
        <div className="splash-dot"></div>
        <div className="splash-dot"></div>
      </div>
    </div>
  )
}
function Root() {
  const [showSplash, setShowSplash] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3400)
    return () => clearTimeout(timer)
  }, [])
  return (
    <AuthProvider>
  <ThemeProvider>
    {showSplash && <SplashScreen />}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
</AuthProvider>
)}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

