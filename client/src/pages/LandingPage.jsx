import { Link } from 'react-router-dom'
import { ArrowRight, Users, MapPin, TrendingUp, Shield, Clock, Heart } from 'lucide-react'
import { Button } from '../components/ui'

const features = [
  {
    icon: TrendingUp,
    title: 'AI-Powered Matching',
    description: 'Google Gemini intelligently matches volunteers to tasks based on skills, location, and availability.'
  },
  {
    icon: MapPin,
    title: 'Live Map Visualization',
    description: 'See task density and volunteer coverage gaps on interactive Google Maps with heatmap layers.'
  },
  {
    icon: Clock,
    title: 'Priority Scoring',
    description: 'Multi-factor algorithm scores tasks by urgency, deadline, volunteer gap, and regional need.'
  },
  {
    icon: Users,
    title: 'Volunteer Management',
    description: 'Self-service profiles with skill tracking and availability calendar.'
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Secure Firebase authentication with admin and volunteer roles.'
  },
  {
    icon: Heart,
    title: 'Field Data Ingestion',
    description: 'CSV import for bulk task creation from offline field reports.'
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5] z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#D6CCC2] rounded-xl flex items-center justify-center">
                <span className="font-bold text-lg text-[#1A1A1A]">V</span>
              </div>
              <span className="font-semibold text-[#1A1A1A] text-lg">VolunteerIQ</span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EDEDE9] rounded-full mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-[#6B6B6B]">Google Solution Challenge 2026</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
            Smart Resource Allocation<br />
            <span className="text-[#8B7E74]">for Communities</span>
          </h1>
          
          <p className="text-xl text-[#6B6B6B] mb-10 max-w-2xl mx-auto">
            AI-powered coordination platform that consolidates local need signals and 
            intelligently maps volunteers to the highest-priority tasks and regions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="primary" className="gap-2">
                Start Volunteering
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="secondary">
                NGO Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              Everything you need to coordinate volunteers
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              Built for NGOs and community organizations to collect field data, 
              prioritize needs, and match the right volunteers to the right tasks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="p-6 bg-[#FAFAFA] rounded-xl hover:bg-[#EDEDE9] transition-colors">
                  <div className="w-12 h-12 bg-[#D6CCC2] rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
            Ready to make an impact?
          </h2>
          <p className="text-lg text-[#6B6B6B] mb-8">
            Join thousands of volunteers already helping their communities.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="primary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm text-[#1A1A1A]">V</span>
              </div>
              <span className="text-[#6B6B6B]">VolunteerIQ</span>
            </div>
            <p className="text-sm text-[#9CA3AF]">
              © 2026 VolunteerIQ. Built for Good.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}