const Card = ({ children, className = '', padding = 'lg', hover, onClick }) => {
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
        ${hover ? 'hover:border-white/[0.12] transition-all duration-300 cursor-pointer' : ''}
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