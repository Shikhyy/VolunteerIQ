const urgencyColors = {
  critical: 'bg-red-900/60 text-red-200 border border-red-700/30',
  high: 'bg-amber-900/60 text-amber-200 border border-amber-700/30', 
  medium: 'bg-blue-900/60 text-blue-200 border border-blue-700/30',
  low: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/30',
}

const statusColors = {
  open: 'bg-white/10 text-white/80 border border-white/10',
  in_progress: 'bg-blue-900/60 text-blue-200 border border-blue-700/30',
  completed: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/30',
  cancelled: 'bg-white/5 text-white/40 border border-white/5',
}

const categoryColors = {
  Medical: 'bg-red-900/30 text-red-300 border border-red-700/20',
  Logistics: 'bg-blue-900/30 text-blue-300 border border-blue-700/20',
  Teaching: 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/20',
  Construction: 'bg-orange-900/30 text-orange-300 border border-orange-700/20',
  Tech: 'bg-purple-900/30 text-purple-300 border border-purple-700/20',
  Admin: 'bg-white/10 text-white/70 border border-white/10',
}

const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
}) => {
  const colorClass = urgencyColors[variant] || statusColors[variant] || categoryColors[variant] || 'bg-white/10 text-white/70 border border-white/10'
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase ${colorClass} ${className}`}>
      {children}
    </span>
  )
}

export default Badge