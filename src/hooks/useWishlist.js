import { useState, useEffect, useCallback } from 'react'
const STORAGE_KEY = 'vanavas_wishlist'
function readWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
export function useWishlist(id) {
  const [wishlist, setWishlistState] = useState(() => readWishlist())
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])
  const isWishlisted = wishlist.includes(id)
  const toggle = useCallback(() => {
    setWishlistState(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    )
  }, [id])
  return { isWishlisted, toggle }
}
