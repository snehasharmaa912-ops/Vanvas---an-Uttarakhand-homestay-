import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Modal, Button } from './ui'
import { useWishlist } from '../hooks/useWishlist'

export default function HomestayCard({ stay }) {
  const {
    id       = 1,
    title    = 'Mountain View Homestay',
    location = 'Mussoorie, Uttarakhand',
    price    = 1200,
    rating   = 4.8,
    reviews  = 24,
    tags     = ['Forest view', 'Trekking'],
    image    = null,
    host     = 'Ramesh Ji',
    eco      = true,
  } = stay || {}
  const { isWishlisted, toggle } = useWishlist(id)
  const [quickView, setQuickView] = useState(false)
  const gradients = [
    'from-[#2d7a4f]/30 to-[#a96f2b]/20',
    'from-[#a96f2b]/30 to-[#2d7a4f]/20',
    'from-[#1a4a31]/30 to-[#c8924a]/20',
  ]
  const grad = gradients[id % gradients.length]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-2xl border border-[#e8dfc8] overflow-hidden group"
      >

        {/* Image area */}
        <div className="relative h-52 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
              <svg className="w-12 h-12 text-[#2d7a4f]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}

          {/* Eco badge */}
          {eco && (
            <span className="absolute top-3 left-3 bg-[#2d7a4f] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>🌿</span> Eco-certified
            </span>
          )}

          <motion.button
            onClick={toggle}
            aria-label="Add to wishlist"
            whileTap={{ scale: 0.85 }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors duration-150"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg
                key={isWishlisted ? 'filled' : 'empty'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-[#666]'}`}
                viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </motion.svg>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map(t => (
              <span key={t} className="text-[10px] font-medium bg-[#e8f5ee] text-[#2d7a4f] px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {/* Title & location */}
          <button
            onClick={() => setQuickView(true)}
            className="text-left w-full"
          >
            <h3 className="font-semibold text-[#1c1c1c] text-base leading-snug mb-1 group-hover:text-[#2d7a4f] transition-colors">
              {title}
            </h3>
          </button>
          <p className="text-xs text-[#888] flex items-center gap-1 mb-3">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>

          {/* Rating + price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-xs font-semibold text-[#1c1c1c]">{rating}</span>
              <span className="text-xs text-[#aaa]">({reviews})</span>
            </div>
            <div className="text-right">
              <span className="text-[#2d7a4f] font-bold text-base">₹{price.toLocaleString()}</span>
              <span className="text-[#aaa] text-xs">/night</span>
            </div>
          </div>

          {/* Host + Book row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0e8d8]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[#2d7a4f] text-[10px] font-bold">
                {host.charAt(0)}
              </div>
              <span className="text-xs text-[#666]">Hosted by {host}</span>
            </div>
            <Link
              to="/explore"
              className="text-xs font-semibold text-[#2d7a4f] hover:underline"
            >
              Book now →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
      {/* Quick view modal */}
      <Modal isOpen={quickView} onClose={() => setQuickView(false)} title={title}>
        <div className="space-y-3">
          {image && (
            <img src={image} alt={title} className="w-full h-40 object-cover rounded-xl" />
          )}
          <p className="text-[#666]">{location}</p>
          <div className="flex items-center justify-between">
            <span className="text-[#1c1c1c] font-medium">⭐ {rating} ({reviews} reviews)</span>
            <span className="text-[#2d7a4f] font-bold">₹{price.toLocaleString()}/night</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map(t => (
              <span key={t} className="text-[10px] font-medium bg-[#e8f5ee] text-[#2d7a4f] px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#888]">Hosted by {host}</p>
          <Link to="/explore">
            <Button variant="primary" size="md" className="w-full">
              View full details →
            </Button>
          </Link>
        </div>
      </Modal>
    </>
  )
              }
