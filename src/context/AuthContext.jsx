import { createContext, useContext, useState } from 'react'
const AuthContext = createContext()
const API_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api/auth'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vanavas_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('vanavas_token'))

  const persist = (userData, authToken) => {
    localStorage.setItem('vanavas_user', JSON.stringify(userData))
    localStorage.setItem('vanavas_token', authToken)
    setUser(userData)
    setToken(authToken)
  }

  const register = async ({ name, email, password, userType }) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, userType }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Registration failed' }
      persist(data.user, data.token)
      return { success: true, user: data.user }
    } catch {
      return { success: false, error: 'Could not reach the server. Please try again.' }
    }
  }

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Login failed' }
      persist(data.user, data.token)
      return { success: true, user: data.user }
    } catch {
      return { success: false, error: 'Could not reach the server. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('vanavas_user')
    localStorage.removeItem('vanavas_token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
