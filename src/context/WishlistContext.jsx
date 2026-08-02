import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { API_BASE_URL } from '../lib/api'

const API_URL = `${API_BASE_URL}/api/wishlist`
const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user, token } = useAuth()
  const [ids, setIds] = useState(new Set())

  const refresh = useCallback(() => {
    if (!token) {
      setIds(new Set())
      return
    }
    fetch(`${API_URL}/ids`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setIds(new Set(Array.isArray(data) ? data : [])))
      .catch(() => setIds(new Set()))
  }, [token])

  useEffect(() => { refresh() }, [refresh, user?.id])

  const toggle = useCallback(async id => {
    if (!token) return { success: false, error: 'Please sign in to save stays.' }
    const wasWishlisted = ids.has(id)

    setIds(prev => {
      const next = new Set(prev)
      wasWishlisted ? next.delete(id) : next.add(id)
      return next
    })

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: wasWishlisted ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Request failed')
      return { success: true }
    } catch {
      setIds(prev => {
        const next = new Set(prev)
        wasWishlisted ? next.add(id) : next.delete(id)
        return next
      })
      return { success: false, error: 'Could not update your wishlist. Please try again.' }
    }
  }, [ids, token])

  return (
    <WishlistContext.Provider value={{ ids, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlistContext() {
  return useContext(WishlistContext)
}
