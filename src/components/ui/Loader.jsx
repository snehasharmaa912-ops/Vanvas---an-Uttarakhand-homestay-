/**
 * Loader Component
 * @param {string} size - sm | md | lg
 * @param {string} type - spinner | skeleton
 * @param {string} text - optional loading text
 */

export default function Loader({ size = 'md', type = 'spinner', text }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  if (type === 'skeleton') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-52 bg-[#e8dfc8] rounded-2xl" />
        <div className="h-4 bg-[#e8dfc8] rounded-full w-3/4" />
        <div className="h-4 bg-[#e8dfc8] rounded-full w-1/2" />
        <div className="h-4 bg-[#e8dfc8] rounded-full w-2/3" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-[#e8dfc8] border-t-[#2d7a4f] animate-spin`}
      />
      {text && (
        <p className="text-sm text-[#888] animate-pulse">{text}</p>
      )}
    </div>
  )
}
