import { forwardRef } from 'react'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  className = '',
  placeholder = 'Select an option',
  ...props 
}, ref) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/60 tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full h-11 px-4 py-2
          bg-white/[0.03] border border-white/[0.1] rounded-lg
          text-white
          focus:outline-none focus:border-[#D6CCC2]
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50' : ''}
        `}
        {...props}
      >
        <option value="" className="text-white/40">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#111]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select