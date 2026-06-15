/**
 * Toast Component
 * @param {string} message - toast message text
 * @param {string} type - success | error | warning | info
 * @param {boolean} isVisible - controls visibility
 * @param {function} onClose - close handler
 */

import { useEffect } from 'react'

export default function Toast({ message, type = 'success', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => onClose(), 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const types = {
    success: 'bg-[#2d7a4f] text-white',
    error:   'bg-red-500 text-white',
    warning: 'bg-[#a96f2b] text-white',
    info:    'bg-blue-500 text-white',
  }

  const icons = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${types[type]}`}>
      <span>{icons[type]}</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  )
}
