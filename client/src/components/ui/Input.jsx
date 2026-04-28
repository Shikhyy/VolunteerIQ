import { forwardRef, useState } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white/60 tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full h-12 px-4 py-2
          bg-white/[0.03] border rounded-lg
          text-white placeholder-white/30
          transition-all duration-200
          focus:outline-none
          ${focused ? 'border-[#D6CCC2] shadow-[0_0_0_3px_rgba(214,204,194,0.1)]' : 'border-white/[0.1]'}
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