/**
 * Button Component
 * @param {string} variant - primary | secondary | outline
 * @param {string} size - sm | md | lg
 * @param {boolean} disabled - disables the button
 * @param {function} onClick - click handler
 * @param {ReactNode} children - button text
 */

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200'

  const variants = {
    primary: 'bg-[#2d7a4f] hover:bg-[#1a4a31] text-white shadow-md hover:shadow-lg',
    secondary: 'bg-[#a96f2b] hover:bg-[#8a5a22] text-white shadow-md hover:shadow-lg',
    outline: 'border border-[#2d7a4f] text-[#2d7a4f] hover:bg-[#2d7a4f] hover:text-white',
  }

  const sizes = {
    sm: 'text-xs px-4 py-1.5',
    md: 'text-sm px-6 py-2.5',
    lg: 'text-base px-8 py-3.5',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
    >
      {children}
    </button>
  )
}
