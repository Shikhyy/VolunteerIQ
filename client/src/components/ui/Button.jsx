import { forwardRef } from 'react'

const variants = {
  primary: 'bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] shadow-[0_16px_40px_rgba(214,204,194,0.18)] hover:shadow-[0_20px_48px_rgba(214,204,194,0.24)]',
  secondary: 'bg-white/[0.03] border border-white/12 text-white hover:bg-white/[0.08]',
  ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.08] border border-transparent',
  danger: 'bg-red-500/90 text-white hover:bg-red-600 shadow-[0_16px_40px_rgba(220,38,38,0.18)]',
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
        transition-all duration-[250ms] ease-out relative overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-[#D6CCC2]/40 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100
        before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.14),transparent)] before:translate-x-[-140%] before:transition-transform before:duration-700 hover:before:translate-x-[140%]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {Icon && !loading && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
      </span>
    </button>
  )
})

Button.displayName = 'Button'

export default Button