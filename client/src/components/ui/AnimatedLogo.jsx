import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AnimatedLogo({ size = 'md' }) {
  const [progress, setProgress] = useState(0)
  const fullText = "VolunteerIQ"
  
  useEffect(() => {
    let interval
    let p = 0
    interval = setInterval(() => {
      p += 1
      setProgress(p)
      if (p >= fullText.length) clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [])

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  const heights = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-6'
  }

  return (
    <Link to="/" className="flex items-center gap-2">
      <span className={`font-bold text-white tracking-[0.1em] ${textSizes[size]}`}>
        {fullText.slice(0, progress)}
        <span className={`inline-block w-1 ${heights[size]} bg-[#D6CCC2] ml-0.5 animate-pulse`} />
      </span>
    </Link>
  )
}