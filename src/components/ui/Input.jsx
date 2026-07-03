/**
 * Input Component
 * @param {string} label - input label text
 * @param {string} placeholder - placeholder text
 * @param {string} type - text | email | password | number
 * @param {string} name - input name attribute
 * @param {string} value - input value
 * @param {function} onChange - change handler
 * @param {string} error - error message to display
 */

export default function Input({
  label,
  placeholder = '',
  type = 'text',
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-[#1c1c1c]">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200
          ${error
            ? 'border-red-400 focus:border-red-500 bg-red-50'
            : 'border-[#e8dfc8] focus:border-[#2d7a4f] focus:shadow-[0_0_0_3px_rgba(45,122,79,0.15)] bg-white'
          }`}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
