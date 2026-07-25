import { useWishlistContext } from '../context/WishlistContext'

export function useWishlist(id) {
  const { ids, toggle } = useWishlistContext()
  const isWishlisted = ids.has(id)
  return { isWishlisted, toggle: () => toggle(id) }
}
