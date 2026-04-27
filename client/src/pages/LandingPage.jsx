import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ChevronDown, Play, Menu, X } from 'lucide-react'
import { Button } from '../components/ui'

const words = [
  { word: 'IMPACT', color: '#D6CCC2' },
  { word: 'PURPOSE', color: '#D5BDAF' },
  { word: 'COMMUNITY', color: '#E3D5CA' },
  { word: 'CHANGE', color: '#D6CCC2' },
  { word: 'CONNECTION', color: '#D5BDAF' },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [textProgress, setTextProgress] = useState(0)
  const heroRef = useRef(null)

  const fullText = "VolunteerIQ"

  useEffect(() => {
    setIsLoaded(true)
    
    const wordInterval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % words.length)
    }, 3000)
    
    return () => clearInterval(wordInterval)
  }, [])

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      setTextProgress(progress)
      if (progress >= fullText.length) clearInterval(interval)
    }, 80)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Minimal Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between px-6 py-5">
          {/* Logo Text */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-[0.2em]">
              {fullText.slice(0, textProgress)}
              <span className="inline-block w-2 h-5 bg-[#D6CCC2] ml-0.5 animate-pulse" />
            </span>
          </Link>

          {/* Hamburger Menu */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-6 h-px bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-px bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-px bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-[#0A0A0A] transition-all duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {['Home', 'Explore', 'About', 'Contact'].map((item, idx) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : '#'}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-[0.2em] hover:text-[#D6CCC2] transition-colors"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {item.toUpperCase()}
            </Link>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="text-white mt-8">Sign In</Button>
          </Link>
        </div>
      </div>

      {/* Hero Section - Full Screen */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#151515] to-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#D6CCC2] rounded-full blur-[200px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#D5BDAF] rounded-full blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Rotating Word */}
          <div className="mb-12">
            <div className="h-16 sm:h-20 flex items-center justify-center overflow-hidden">
              {words.map((item, idx) => (
                <span 
                  key={idx}
                  className={`absolute text-5xl sm:text-7xl font-bold tracking-[0.15em] transition-all duration-700 ${
                    idx === currentWord 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-105'
                  }`}
                  style={{ color: item.color, letterSpacing: '0.2em' }}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold mb-8 tracking-[0.1em]">
            for <span className="text-[#D6CCC2]">communities</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-12 tracking-wide font-light">
            AI-powered platform that intelligently maps volunteers to the highest-priority tasks and regions worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] gap-3 px-10 tracking-[0.1em] text-base">
                START <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="ghost" className="text-white/70 hover:text-white gap-3 tracking-[0.1em]">
                <Play size={18} /> WATCH
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.3em] text-white/30 uppercase">Scroll</span>
          <ChevronDown size={20} className="text-white/20 animate-bounce" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06]">
            {[
              { value: '2,500+', label: 'VOLUNTEERS', icon: '👤' },
              { value: '850+', label: 'TASKS', icon: '🎯' },
              { value: '150+', label: 'NGOs', icon: '🏠' },
              { value: '50K+', label: 'HOURS', icon: '⏱️' },
            ].map((stat, idx) => (
              <div key={idx} className="group p-10 bg-[#0A0A0A] hover:bg-[#111] transition-all duration-500">
                <span className="text-4xl block mb-4">{stat.icon}</span>
                <p className="text-4xl sm:text-5xl font-bold text-[#D6CCC2] mb-2 tracking-tight">{stat.value}</p>
                <p className="text-xs tracking-[0.2em] text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-[#0A0A0A] border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] text-[#D6CCC2] uppercase">What We Do</span>
            <h2 className="text-5xl sm:text-6xl font-bold mt-4 tracking-tight">EVERYTHING YOU NEED</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
            {[
              { icon: '✨', title: 'AI Matching', desc: 'Gemini intelligently matches volunteers to tasks based on skills, location, and availability.' },
              { icon: '🗺️', title: 'Live Maps', desc: 'Visualize task density and volunteer coverage gaps on interactive maps.' },
              { icon: '📊', title: 'Priority', desc: 'Multi-factor algorithm scores tasks by urgency, deadline, and regional need.' },
              { icon: '👥', title: 'Volunteers', desc: 'Self-service profiles with skill tracking and availability calendar.' },
              { icon: '🔒', title: 'Secure', desc: 'Role-based access with Firebase authentication.' },
              { icon: '📁', title: 'Import', desc: 'CSV bulk import for field data ingestion.' },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group p-10 bg-[#0A0A0A] hover:bg-[#111] transition-all duration-500"
              >
                <span className="text-4xl block mb-6">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-[#0A0A0A] border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] text-[#D6CCC2] uppercase">Process</span>
          <h2 className="text-5xl sm:text-6xl font-bold mt-4 mb-16 tracking-tight">HOW IT WORKS</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'CREATE', desc: 'NGOs create tasks or import from CSV' },
              { step: '02', title: 'MATCH', desc: 'AI ranks best volunteers' },
              { step: '03', title: 'TRACK', desc: 'Monitor impact live' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="w-16 h-16 border border-[#D6CCC2]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-[#D6CCC2]">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-[0.15em]">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 bg-[#0A0A0A] border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            Ready to make an <span className="text-[#D6CCC2]">impact</span>?
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Join thousands of volunteers already helping their communities.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] px-12 tracking-[0.1em]">
              GET STARTED <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D6CCC2] rounded-full flex items-center justify-center">
              <span className="font-bold text-sm text-[#0A0A0A]">V</span>
            </div>
            <span className="text-white/60 tracking-wide">VolunteerIQ</span>
          </div>
          <p className="text-sm text-white/30">
            © 2026 VolunteerIQ. Built for Good.
          </p>
        </div>
      </footer>
    </div>
  )
}