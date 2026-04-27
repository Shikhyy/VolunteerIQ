import { forwardRef } from 'react'

const Textarea = forwardRef(({ 
  label, 
  error, 
  className = '',
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#1A1A1A]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-white border border-[#E5E5E5] rounded-lg
          text-[#1A1A1A] placeholder-[#9CA3AF]
          focus:outline-none focus:border-2 focus:border-[#D6CCC2]
          transition-colors resize-none
          disabled:bg-[#F5F5F5] disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea