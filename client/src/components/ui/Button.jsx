import { forwardRef } from 'react'

const variants = {
  primary: 'bg-[#D6CCC2] text-[#1A1A1A] hover:bg-[#BFB5A7] hover:scale-[1.02]',
  secondary: 'bg-transparent border border-[#D6CCC2] text-[#1A1A1A] hover:bg-[#EDEDE9]',
  ghost: 'bg-transparent text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#EDEDE9]',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button