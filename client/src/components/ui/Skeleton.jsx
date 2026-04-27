const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'w-10 h-10 rounded-full',
    card: 'h-32 w-full',
    button: 'h-10 w-24',
  }

  return (
    <div className={`animate-pulse bg-[#E5E5E5] rounded ${variants[variant]} ${className}`} />
  )
}

export default Skeleton