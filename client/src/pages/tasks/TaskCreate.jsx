import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ChevronLeft } from 'lucide-react'
import { Card, Button, Input, Select, Textarea } from '../../components/ui'

const categoryOptions = [
  { value: 'Medical', label: 'Medical' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Tech', label: 'Tech' },
  { value: 'Admin', label: 'Admin' },
]

const urgencyOptions = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium-Low' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Critical' },
]

const skillOptions = [
  'Medical', 'Logistics', 'Teaching', 'Construction', 'Tech', 'Admin', 'Cooking', 'Driving'
]

export default function TaskCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 3,
    address: '',
    city: '',
    district: '',
    requiredSkills: [],
    slotsNeeded: 1,
    deadlineDate: '',
    deadlineTime: '',
  })

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }))
  }

  const canSubmit = () => {
    return (
      form.title &&
      form.description &&
      form.category &&
      form.address &&
      form.city &&
      form.requiredSkills.length > 0 &&
      form.slotsNeeded > 0 &&
      form.deadlineDate &&
      form.deadlineTime
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    navigate('/admin/tasks')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#EDEDE9] rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Create New Task</h1>
          <p className="text-[#6B6B6B]">Add a new volunteer opportunity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card padding="lg" className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="e.g., Medical camp setup — Okhla"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                placeholder="Describe the task, requirements, and what volunteers will do..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                required
              />
            </div>
          </div>

          {/* Category & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={categoryOptions}
              required
            />
            <Select
              label="Urgency"
              value={form.urgency}
              onChange={(e) => setForm({ ...form, urgency: parseInt(e.target.value) })}
              options={urgencyOptions}
              required
            />
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Location</h2>
            <div className="space-y-4">
              <Input
                label="Address"
                placeholder="Full address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="Delhi"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
                <Input
                  label="District / Area"
                  placeholder="South Delhi"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Required Skills</h2>
            <p className="text-sm text-[#6B6B6B] mb-3">Select skills needed for this task:</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${form.requiredSkills.includes(skill)
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

          {/* Slots & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Volunteers Needed"
              type="number"
              min="1"
              value={form.slotsNeeded}
              onChange={(e) => setForm({ ...form, slotsNeeded: parseInt(e.target.value) })}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Deadline Date"
                type="date"
                value={form.deadlineDate}
                onChange={(e) => setForm({ ...form, deadlineDate: e.target.value })}
                required
              />
              <Input
                label="Deadline Time"
                type="time"
                value={form.deadlineTime}
                onChange={(e) => setForm({ ...form, deadlineTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!canSubmit() || loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}