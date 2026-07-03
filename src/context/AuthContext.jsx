import { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext()
const ADMIN_EMAIL = 'snehasharmaa912@gmail.com'
const ADMIN_PASSWORD = 'VanaVas@2026'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vanavas_admin')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = { email, role: 'admin' }
      localStorage.setItem('vanavas_admin', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    localStorage.removeItem('vanavas_admin')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
