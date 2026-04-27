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
        <label className="block text-sm font-medium text-[#1A1A1A]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full h-12 px-4 py-2
          bg-white border border-[#E5E5E5] rounded-lg
          text-[#1A1A1A]
          focus:outline-none focus:border-2 focus:border-[#D6CCC2]
          transition-colors
          disabled:bg-[#F5F5F5] disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select