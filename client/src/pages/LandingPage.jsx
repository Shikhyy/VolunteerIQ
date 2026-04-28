import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Users, MapPin, Sparkles, Shield, Clock, CheckCircle } from 'lucide-react'
import { Button, Card } from '../components/ui'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description: 'Smart algorithms match volunteers with tasks based on skills, location, and availability.'
  },
  {
    icon: MapPin,
    title: 'Real-Time Coordination',
    description: 'Track tasks, volunteers, and impact across all locations in one dashboard.'
  },
  {
    icon: Users,
    title: 'Volunteer Management',
    description: 'Build your team with profiles, skill tracking, and performance metrics.'
  },
  {
    icon: Shield,
    title: 'Reliability Scoring',
    description: 'Trust-based system tracks volunteer commitment and task completion.'
  }
]

const stats = [
  { value: '10K+', label: 'Volunteers' },
  { value: '50K+', label: 'Tasks Completed' },
  { value: '200+', label: 'Organizations' },
  { value: '98%', label: 'Satisfaction' }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Medical Volunteer',
    quote: 'VolunteerIQ made it so easy to find meaningful work near me. The AI matching is incredible!'
  },
  {
    name: 'Raj Patel',
    role: 'NGO Coordinator',
    quote: 'Managing 500+ volunteers was chaos. Now it\'s effortless. Highly recommended.'
  }
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/[0.06]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#D6CCC2] rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-[#0A0A0A]">V</span>
            </div>
            <span className="font-bold text-xl tracking-[0.1em] text-white">VolunteerIQ</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-white/50 hover:text-white transition-colors text-sm tracking-wide">Features</Link>
            <Link to="/#about" className="text-white/50 hover:text-white transition-colors text-sm tracking-wide">About</Link>
            <Link to="/#testimonials" className="text-white/50 hover:text-white transition-colors text-sm tracking-wide">Testimonials</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white/70">LOGIN</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA]">GET STARTED</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D6CCC2]/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D6CCC2]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D6CCC2]/5 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full mb-8">
            <Sparkles size={14} className="text-[#D6CCC2]" />
            <span className="text-xs tracking-widest text-white/60">AI-POWERED VOLUNTEER COORDINATION</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Connect. Contribute.<span className="text-[#D6CCC2]">Impact.</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The intelligent platform that matches volunteers with meaningful opportunities. 
            Save time, increase engagement, and maximize your social impact.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] text-lg px-8 py-4">
                START FOR FREE <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="text-white/60 hover:text-white text-lg px-8 py-4">
                VIEW DEMO
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-bold text-[#D6CCC2] mb-2">{stat.value}</p>
              <p className="text-sm tracking-widest text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Everything you need<span className="text-[#D6CCC2]">.</span></h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Powerful features designed for modern volunteer coordination
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="p-8 hover:bg-white/[0.03] transition-colors group">
                  <div className="w-14 h-14 bg-[#D6CCC2]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D6CCC2]/20 transition-colors">
                    <Icon size={28} className="text-[#D6CCC2]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How it works<span className="text-[#D6CCC2]">.</span></h2>
            <p className="text-white/50">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Profile', desc: 'Sign up and list your skills, availability, and location.' },
              { step: '02', title: 'Get Matched', desc: 'Our AI finds the perfect tasks based on your profile.' },
              { step: '03', title: 'Make Impact', desc: 'Volunteer, track hours, and see your contribution grow.' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-6xl font-bold text-[#D6CCC2]/20 mb-4">{item.step}</p>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by volunteers<span className="text-[#D6CCC2]">.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-8">
                <p className="text-lg text-white/70 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#D6CCC2]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D6CCC2] font-bold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-white/40">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#D6CCC2]/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-white/50 mb-10 text-lg">Join thousands of volunteers already creating impact.</p>
          <Link to="/signup">
            <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] text-lg px-10 py-4">
              GET STARTED FREE <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
              <span className="font-bold text-[#0A0A0A]">V</span>
            </div>
            <span className="font-bold tracking-[0.1em] text-white">VolunteerIQ</span>
          </div>
          <p className="text-sm text-white/30">© 2026 VolunteerIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
