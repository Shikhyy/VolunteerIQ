const Card = ({ children, className = '', padding = 'lg', hover = false, onClick }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    none: 'p-0',
  }

  return (
    <div 
      className={`
        bg-[#111] rounded-xl border border-white/[0.06]
        ${paddingClasses[padding]}
        ${hover ? 'hover:border-white/[0.15] hover:bg-[#151515] transition-all duration-300 cursor-pointer group' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card