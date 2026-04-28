import { forwardRef } from 'react'

const variants = {
  primary: 'bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] active:scale-[0.98] shadow-lg hover:shadow-xl',
  secondary: 'bg-transparent border border-white/20 text-white hover:bg-white/10 active:scale-[0.98]',
  ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.08] active:scale-[0.98] border border-transparent',
  danger: 'bg-red-500/90 text-white hover:bg-red-600 active:scale-[0.98]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs tracking-wider',
  md: 'px-4 py-2 text-sm tracking-wide',
  lg: 'px-6 py-3 text-base tracking-wide',
}

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled,
  loading,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-[#D6CCC2]/40 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {Icon && !loading && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button