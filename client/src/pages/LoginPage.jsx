import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Menu, X } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('demo@volunteeriq.org')
  const [password, setPassword] = useState('demo123456')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [textProgress, setTextProgress] = useState(0)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const fullText = "VolunteerIQ"

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      setTextProgress(progress)
      if (progress >= fullText.length) clearInterval(interval)
    }, 60)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      await login('demo@volunteeriq.org', 'demo123456')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Minimal Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-[0.2em]">
              {fullText.slice(0, textProgress)}
              <span className="inline-block w-2 h-5 bg-[#D6CCC2] ml-0.5 animate-pulse" />
            </span>
          </Link>
          <Link to="/" className="text-sm tracking-[0.1em] text-white/50 hover:text-white transition-colors">
            BACK
          </Link>
        </div>
      </nav>

      {/* Centered Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-center mb-2 tracking-tight">
            Welcome<span className="text-[#D6CCC2]">.</span>
          </h2>
          <p className="text-white/40 text-center mb-10 tracking-wide">
            Sign in to continue
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/30 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA]"
              loading={loading}
            >
              SIGN IN
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0A0A0A] text-white/30">or</span>
            </div>
          </div>

          <Button 
            variant="ghost"
            className="w-full border border-white/10 text-white/60 hover:text-white hover:border-white/30"
            onClick={handleDemoLogin}
            loading={loading}
          >
            TRY DEMO ACCOUNT
          </Button>

          <p className="mt-10 text-center text-white/40 text-sm tracking-wide">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#D6CCC2] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}