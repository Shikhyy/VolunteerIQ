import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import { Button, Input } from '../components/ui'
import { useAuthStore } from '../store/authStore'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const { signup } = useAuthStore()
  const navigate = useNavigate()

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
      navigate('/onboarding')
    } catch (err) {
      setError('Failed to create account. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-[#D6CCC2] rounded-xl flex items-center justify-center">
            <span className="font-bold text-xl text-[#1A1A1A]">V</span>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A] text-center mb-2">
            Create your account
          </h2>
          <p className="text-[#6B6B6B] text-center mb-8">
            Start making a difference in your community
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
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
                className="absolute right-3 top-9 text-[#9CA3AF] hover:text-[#6B6B6B]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {form.password && (
              <div className="space-y-2">
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-[#E5E5E5]'}`}>
                      {req.met && <Check size={10} className="text-white" />}
                    </div>
                    <span className={req.met ? 'text-[#1A1A1A]' : 'text-[#9CA3AF]'}>
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
                className="mt-1 w-4 h-4 rounded border-[#E5E5E5] text-[#D6CCC2] focus:ring-[#D6CCC2]"
              />
              <span className="text-sm text-[#6B6B6B]">
                I agree to the{' '}
                <Link to="#" className="text-[#1A1A1A] underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="#" className="text-[#1A1A1A] underline">Privacy Policy</Link>
              </span>
            </label>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={loading || !allMet}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[#6B6B6B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1A1A1A] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}