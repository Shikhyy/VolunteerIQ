import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ChevronLeft, Plus, X } from 'lucide-react'
import { Card, Button, Input, Select, Textarea } from '../../components/ui'
import { useTaskStore } from '../../store/taskStore'

const categoryOptions = [
  { value: 'Medical', label: 'Medical' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Tech', label: 'Tech' },
  { value: 'Admin', label: 'Admin' },
]

const urgencyOptions = [
  { value: 5, label: 'Critical - 5' },
  { value: 4, label: 'High - 4' },
  { value: 3, label: 'Medium - 3' },
  { value: 2, label: 'Low - 2' },
  { value: 1, label: 'Minimal - 1' },
]

const skillOptions = [
  'Medical', 'Logistics', 'Teaching', 'Construction', 'Tech', 'Admin', 'Cooking', 'Driving'
]

export default function TaskCreate() {
  const navigate = useNavigate()
  const { addTask } = useTaskStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 3,
    location: { address: '', city: '', district: '' },
    requiredSkills: [],
    slotsNeeded: 1,
    deadline: '',
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
      form.location.address &&
      form.location.city &&
      form.requiredSkills.length > 0 &&
      form.slotsNeeded > 0 &&
      form.deadline
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    addTask({
      ...form,
      status: 'open',
      slotsFilled: 0,
      priorityScore: (form.urgency / 5) * 0.4,
    })
    navigate('/admin/tasks')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Task<span className="text-[#D6CCC2]">.</span></h1>
          <p className="text-white/50 mt-1">Add a new volunteer opportunity</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card padding="lg" className="space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-sm font-medium tracking-wider text-white/60 mb-4">BASIC INFORMATION</h2>
            <div className="space-y-4">
              <Input
                label="TASK TITLE"
                placeholder="e.g., Medical camp setup — Okhla"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                label="DESCRIPTION"
                placeholder="Describe the task, requirements, and what volunteers will do..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          {/* Category & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="CATEGORY"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={categoryOptions}
            />
            <Select
              label="URGENCY"
              value={form.urgency}
              onChange={(e) => setForm({ ...form, urgency: parseInt(e.target.value) })}
              options={urgencyOptions}
            />
          </div>

          {/* Location */}
          <div>
            <h2 className="text-sm font-medium tracking-wider text-white/60 mb-4">LOCATION</h2>
            <div className="space-y-4">
              <Input
                label="ADDRESS"
                placeholder="Full address"
                value={form.location.address}
                onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="CITY"
                  placeholder="Delhi"
                  value={form.location.city}
                  onChange={(e) => setForm({ ...form, location: { ...form.location, city: e.target.value } })}
                />
                <Input
                  label="DISTRICT / AREA"
                  placeholder="South Delhi"
                  value={form.location.district}
                  onChange={(e) => setForm({ ...form, location: { ...form.location, district: e.target.value } })}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-sm font-medium tracking-wider text-white/60 mb-4">REQUIRED SKILLS</h2>
            <p className="text-xs text-white/40 mb-3">Select skills needed for this task:</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-medium transition-all
                    ${form.requiredSkills.includes(skill)
                      ? 'bg-[#D6CCC2] text-[#0A0A0A]'
                      : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'
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
              label="VOLUNTEERS NEEDED"
              type="number"
              min="1"
              value={form.slotsNeeded}
              onChange={(e) => setForm({ ...form, slotsNeeded: parseInt(e.target.value) })}
            />
            <Input
              label="DEADLINE"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              CANCEL
            </Button>
            <Button type="submit" disabled={!canSubmit() || loading} className="bg-[#D6CCC2] text-[#0A0A0A]">
              {loading ? 'CREATING...' : 'CREATE TASK'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}