import { useState } from 'react'
import { Camera, MapPin, Clock, Mail, Phone, User } from 'lucide-react'
import { Card, Button, Input, Avatar } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../contexts/ToastContext'
import { volunteers } from '../api/client'

const skills = ['Medical', 'Logistics', 'Teaching', 'Construction', 'Tech', 'Admin', 'Cooking', 'Driving']

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm] = useState({
    name: user?.displayName || 'Jane Doe',
    email: user?.email || 'jane@example.com',
    phone: '+91 98765 43210',
    city: 'Delhi',
    district: 'Central Delhi',
    skills: ['Medical', 'Teaching'],
    availability: ['Saturday', 'Sunday'],
  })
  const [loading, setLoading] = useState(false)

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

  const handleSave = async () => {
    setLoading(true)
    try {
      await volunteers.update('me', form)
      showToast('Profile saved successfully!', 'success')
    } catch (err) {
      console.error('Failed to save profile:', err)
      showToast('Failed to save profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'skills', label: 'Skills' },
    { id: 'availability', label: 'Availability' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="relative inline-block">
          <Avatar name={form.name} size="xl" className="w-24 h-24 text-3xl" />
          <button className="absolute bottom-0 right-0 p-2 bg-white border border-[#E5E5E5] rounded-full shadow">
            <Camera size={16} className="text-[#6B6B6B]" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] mt-4">{form.name}</h1>
        <p className="text-[#6B6B6B]">{form.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E5E5]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-[#D6CCC2] text-[#1A1A1A]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card padding="lg">
          <div className="space-y-5">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Input
              label="District / Area"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </div>
        </Card>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Your Skills</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Select the skills you're comfortable with:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill}
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
        </Card>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Your Availability</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">When are you available to volunteer?</p>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
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
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}