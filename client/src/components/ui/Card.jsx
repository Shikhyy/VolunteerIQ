const Card = ({ children, className = '', padding = 'lg', hover, onClick }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6',
    none: 'p-0',
  }

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
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