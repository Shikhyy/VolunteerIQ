import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Users, MapPin, Sparkles, Shield, Clock, CheckCircle, Zap, Target, TrendingUp, Globe, Award, Calendar } from 'lucide-react'
import { Button, Card } from '../components/ui'
import AnimatedLogo from '../components/ui/AnimatedLogo'

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
  },
  {
    icon: TrendingUp,
    title: 'Impact Analytics',
    description: 'Visualize your contribution with detailed insights and progress tracking.'
  },
  {
    icon: Globe,
    title: 'Location-Based Tasks',
    description: 'Find opportunities near you with interactive maps and local filters.'
  }
]

const stats = [
  { value: '10K+', label: 'Volunteers', icon: Users },
  { value: '50K+', label: 'Tasks Completed', icon: Target },
  { value: '200+', label: 'Organizations', icon: Globe },
  { value: '98%', label: 'Satisfaction', icon: Award }
]

const steps = [
  { num: '01', title: 'Create Profile', desc: 'Sign up and list your skills, availability, and location.', icon: Users },
  { num: '02', title: 'Get Matched', desc: 'Our AI finds the perfect tasks based on your profile.', icon: Sparkles },
  { num: '03', title: 'Start Volunteering', desc: 'Begin your journey and track your impact.', icon: Heart }
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Medical Volunteer',
    quote: 'VolunteerIQ made it so easy to find meaningful work near me. The AI matching is incredible!',
    avatar: 'PS'
  },
  {
    name: 'Raj Patel',
    role: 'NGO Coordinator',
    quote: 'Managing 500+ volunteers was chaos. Now it\'s effortless. Highly recommended.',
    avatar: 'RP'
  },
  {
    name: 'Anita Desai',
    role: 'Community Lead',
    quote: 'The impact tracking feature keeps our team motivated. We can see our contribution grow!',
    avatar: 'AD'
  }
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-x-hidden page-enter">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-15" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#D6CCC2]/8 blur-[120px] float-slow" />
      <div className="pointer-events-none absolute right-0 top-[30rem] h-[600px] w-[600px] rounded-full bg-white/[0.03] blur-[100px] float-slower" />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.4)]' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <AnimatedLogo size="md" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-white/50 hover:text-white transition-colors text-sm tracking-wider cursor-pointer">Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-white/50 hover:text-white transition-colors text-sm tracking-wider cursor-pointer">How It Works</a>
            <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="text-white/50 hover:text-white transition-colors text-sm tracking-wider cursor-pointer">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
              Sign In
            </Link>
            <Link to="/signup">
              <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] hover:shadow-[0_0_30px_rgba(214,204,194,0.3)] transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D6CCC2]/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#D6CCC2]/4 blur-[80px]" />
        
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-full mb-10 animate-fade-in">
            <Zap size={14} className="text-[#D6CCC2]" />
            <span className="text-xs tracking-widest text-white/50 uppercase">AI-Powered</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-[1.1] animate-slide-up">
            Volunteer.<span className="text-[#D6CCC2]">Connect.</span><br />
            <span className="text-white/70">Impact.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '80ms' }}>
            The intelligent platform that matches volunteers with meaningful opportunities. 
            Save time, increase engagement, and maximize your social impact.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '140ms' }}>
            <Link to="/signup">
              <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] text-lg px-10 py-4 hover:shadow-[0_0_40px_rgba(214,204,194,0.25)] transition-all">
                Start Volunteering <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/login" className="text-white/50 hover:text-white text-lg px-10 py-4 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Icon size={24} className="text-[#D6CCC2]/60 mx-auto mb-3" />
                <p className="text-4xl font-bold text-[#D6CCC2] mb-2">{stat.value}</p>
                <p className="text-sm tracking-widest text-white/40">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need<span className="text-[#D6CCC2]">.</span></h2>
            <p className="text-white/40 max-w-xl mx-auto">Powerful features designed for modern volunteer coordination and community building.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:bg-white/[0.04] hover:border-[#D6CCC2]/20 transition-all duration-300 cursor-pointer">
                  <div className="w-12 h-12 bg-[#D6CCC2]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[#D6CCC2]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works<span className="text-[#D6CCC2]">.</span></h2>
            <p className="text-white/40">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="text-center cursor-pointer">
                  <div className="w-16 h-16 bg-[#D6CCC2]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon size={28} className="text-[#D6CCC2]" />
                  </div>
                  <p className="text-5xl font-bold text-[#D6CCC2]/20 mb-4">{step.num}</p>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/40">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by volunteers<span className="text-[#D6CCC2]">.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <p className="text-white/70 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D6CCC2]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D6CCC2] font-semibold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#D6CCC2]/5 to-[#D6CCC2]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to make an impact?</h2>
          <p className="text-white/50 mb-10 text-lg">Join thousands of volunteers already creating change in their communities.</p>
          <Link to="/signup">
            <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] text-lg px-12 py-4 hover:shadow-[0_0_40px_rgba(214,204,194,0.25)] transition-all">
              Get Started Free <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <AnimatedLogo size="sm" />
          <p className="text-sm text-white/30">© 2026 VolunteerIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}