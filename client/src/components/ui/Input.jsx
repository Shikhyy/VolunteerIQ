import { forwardRef, useState } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/60 tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full h-12 px-4 py-2
          bg-white/[0.03] border border-white/[0.1] rounded-lg
          text-white placeholder-white/30
          focus:outline-none focus:border-2 focus:border-[#D6CCC2]
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input