const urgencyColors = {
  critical: 'bg-red-500 text-white',
  high: 'bg-amber-500 text-white',
  medium: 'bg-blue-500 text-white',
  low: 'bg-green-500 text-white',
}

const statusColors = {
  open: 'bg-[#EDEDE9] text-[#6B6B6B]',
  in_progress: 'bg-blue-500 text-white',
  completed: 'bg-green-500 text-white',
  cancelled: 'bg-gray-400 text-white',
}

const categoryColors = {
  Medical: 'bg-red-100 text-red-700',
  Logistics: 'bg-blue-100 text-blue-700',
  Teaching: 'bg-green-100 text-green-700',
  Construction: 'bg-orange-100 text-orange-700',
  Tech: 'bg-purple-100 text-purple-700',
  Admin: 'bg-gray-100 text-gray-700',
}

const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
}) => {
  const colorClass = urgencyColors[variant] || statusColors[variant] || categoryColors[variant] || 'bg-[#EDEDE9] text-[#6B6B6B]'
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {children}
    </span>
  )
}

export default Badge