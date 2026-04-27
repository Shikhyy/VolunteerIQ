const Avatar = ({ 
  src, 
  name, 
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className={`${sizes[size]} rounded-full bg-[#D6CCC2] flex items-center justify-center overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-[#1A1A1A]">{initials}</span>
      )}
    </div>
  )
}

export default Avatar