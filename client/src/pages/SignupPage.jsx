import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { useAuthStore } from '../store/authStore'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [textProgress, setTextProgress] = useState(0)
  const { signup } = useAuthStore()
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

  const passwordRequirements = [
    { met: form.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(form.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(form.password), text: 'One number' },
  ]

  const allMet = passwordRequirements.every(r => r.met)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allMet) {
      setError('Password does not meet requirements')
      return
    }
    if (!agreed) {
      setError('Please agree to the terms')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signup(form.email, form.password, form.name)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Signup failed'
      setError(msg)
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
            Join<span className="text-[#D6CCC2]">.</span>
          </h2>
          <p className="text-white/40 text-center mb-10 tracking-wide">
            Start making a difference
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              label="Full Name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {form.password && (
              <div className="space-y-2">
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-[#D6CCC2]' : 'bg-white/10'}`}>
                      {req.met && <Check size={10} className="text-[#0A0A0A]" />}
                    </div>
                    <span className={req.met ? 'text-white' : 'text-white/30'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 text-[#D6CCC2] focus:ring-[#D6CCC2] bg-[#0A0A0A]"
              />
              <span className="text-sm text-white/40">
                I agree to the{' '}
                <Link to="#" className="text-[#D6CCC2] hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="#" className="text-[#D6CCC2] hover:underline">Privacy</Link>
              </span>
            </label>

            <Button 
              type="submit" 
              className="w-full bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA]"
              disabled={loading || !allMet}
              loading={loading}
            >
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <p className="mt-10 text-center text-white/40 text-sm tracking-wide">
            Already have an account?{' '}
            <Link to="/login" className="text-[#D6CCC2] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}