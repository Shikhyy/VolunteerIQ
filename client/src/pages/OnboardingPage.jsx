import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, MapPin, Clock, User } from 'lucide-react'
import { Button, Input, Card } from '../components/ui'

const skills = [
  'Medical', 'Logistics', 'Teaching', 'Construction', 'Tech', 'Admin', 'Cooking', 'Driving', 'Counseling', 'Translation'
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Skills', icon: Check },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Availability', icon: Clock },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    skills: [],
    city: '',
    district: '',
    availability: [],
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter(d => d !== day)
        : [...prev.availability, day]
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    navigate('/dashboard')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return form.name.length > 0 && form.phone.length > 0
      case 2: return form.skills.length > 0
      case 3: return form.city.length > 0
      case 4: return form.availability.length > 0
      default: return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        )
      case 2:
        return (
          <div>
            <p className="text-[#6B6B6B] mb-4">Select the skills you're comfortable with:</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${form.skills.includes(skill)
                      ? 'bg-[#D6CCC2] text-[#1A1A1A]'
                      : 'bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#EDEDE9]'
                    }
                  `}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-5">
            <Input
              label="City"
              placeholder="Delhi"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Input
              label="District / Area"
              placeholder="Central Delhi"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </div>
        )
      case 4:
        return (
          <div>
            <p className="text-[#6B6B6B] mb-4">When are you available to volunteer?</p>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${form.availability.includes(day)
                      ? 'bg-[#D6CCC2] text-[#1A1A1A]'
                      : 'bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#EDEDE9]'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Complete Your Profile</h1>
      <p className="text-[#6B6B6B] mb-8">Help us match you with the right opportunities</p>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = currentStep >= step.id
          const isComplete = currentStep > step.id
          return (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-colors
                ${isActive ? 'bg-[#D6CCC2]' : 'bg-[#F5F5F5]'}
              `}>
                {isComplete ? <Check size={16} className="text-[#1A1A1A]" /> : <Icon size={16} className={isActive ? 'text-[#1A1A1A]' : 'text-[#9CA3AF]'} />}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-2 ${isComplete ? 'bg-[#D6CCC2]' : 'bg-[#E5E5E5]'}`} />
              )}
            </div>
          )
        })}
      </div>

      <Card padding="lg">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{steps[currentStep - 1].title}</h2>
        </div>
        
        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </Button>
          {currentStep < 4 ? (
            <Button variant="primary" onClick={handleNext} disabled={!canProceed()}>
              Next <ChevronRight size={18} className="ml-1" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleComplete} disabled={!canProceed() || loading}>
              {loading ? 'Saving...' : 'Complete'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}