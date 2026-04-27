import { useState } from 'react'
import { Search, Filter, MapPin, Clock, Users, X } from 'lucide-react'
import { Card, Badge, Button, Select } from '../../components/ui'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Tech', label: 'Tech' },
]

const urgencies = [
  { value: '', label: 'All Urgencies' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const mockTasks = [
  {
    id: 1,
    title: 'Medical camp setup — Okhla',
    description: 'Set up a 50-bed medical camp for flood relief. Need people with medical training and physical fitness.',
    category: 'Medical',
    urgency: 'critical',
    location: 'Okhla Industrial Area, Delhi',
    deadline: '2026-04-28T18:00:00Z',
    slotsFilled: 3,
    slotsNeeded: 8,
    distance: '2.3 km',
  },
  {
    id: 2,
    title: 'Food packet distribution — Rohini',
    description: 'Distribute food packets to flood-affected families in the Rohini area.',
    category: 'Logistics',
    urgency: 'high',
    location: 'Rohini Sector 15, Delhi',
    deadline: '2026-04-29T10:00:00Z',
    slotsFilled: 3,
    slotsNeeded: 6,
    distance: '5.1 km',
  },
  {
    id: 3,
    title: 'Teaching support — Dwarka',
    description: 'Help students with their studies in the community center.',
    category: 'Teaching',
    urgency: 'medium',
    location: 'Dwarka, Delhi',
    deadline: '2026-05-01T09:00:00Z',
    slotsFilled: 2,
    slotsNeeded: 4,
    distance: '8.2 km',
  },
  {
    id: 4,
    title: 'Elderly care home — Janakpuri',
    description: 'Assist with daily activities at the elderly care home.',
    category: 'Admin',
    urgency: 'low',
    location: 'Janakpuri, Delhi',
    deadline: '2026-05-05T14:00:00Z',
    slotsFilled: 1,
    slotsNeeded: 3,
    distance: '6.7 km',
  },
]

export default function TaskBrowser() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [urgency, setUrgency] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredTasks = mockTasks.filter(task => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
    if (category && task.category !== category) return false
    if (urgency && task.urgency !== urgency) return false
    return true
  })

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setUrgency('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Browse Tasks</h1>
        <p className="text-[#6B6B6B]">Find opportunities that match your skills and availability.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-2 focus:border-[#D6CCC2]"
          />
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter size={18} />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#1A1A1A]">Filters</h3>
            <button onClick={clearFilters} className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
            />
            <Select
              label="Urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              options={urgencies}
            />
          </div>
        </Card>
      )}

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B6B6B]">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-[#6B6B6B]">No tasks match your filters</p>
          <Button variant="ghost" onClick={clearFilters} className="mt-2">
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <Badge variant={task.urgency}>{task.urgency}</Badge>
                  <Badge>{task.category}</Badge>
                </div>
                <span className="text-sm text-[#9CA3AF]">
                  {task.distance} away
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {task.title}
              </h3>
              <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">
                {task.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-[#6B6B6B] mb-4">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  {task.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#6B6B6B]" />
                  <span className="text-sm text-[#6B6B6B]">
                    {task.slotsFilled}/{task.slotsNeeded} volunteers
                  </span>
                  <div className="w-24 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D6CCC2] rounded-full"
                      style={{ width: `${(task.slotsFilled / task.slotsNeeded) * 100}%` }}
                    />
                  </div>
                </div>
                <Button variant="primary" size="sm">Apply</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}