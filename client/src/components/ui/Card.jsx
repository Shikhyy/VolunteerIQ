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
        surface-panel rounded-2xl relative overflow-hidden
        ${paddingClasses[padding]}
        ${hover ? 'hover:border-white/[0.15] hover:shadow-[0_24px_80px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(214,204,194,0.07),transparent_35%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default Card