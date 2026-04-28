import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Filter, MapPin, Clock, Users, X, Layers, ChevronRight,
  Calendar, CheckCircle, AlertCircle
} from 'lucide-react'
import { Card, Badge, Button, Input, Select } from '../../components/ui'
import { useTaskStore } from '../../store/taskStore'

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

export default function TaskBrowser() {
  const { tasks, filters, setFilter, clearFilters } = useTaskStore()
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [filters.category, filters.urgency, search])

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Teaching', label: 'Teaching' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Tech', label: 'Tech' },
    { value: 'Admin', label: 'Admin' },
  ]

  const urgencyOptions = [
    { value: '', label: 'All Urgencies' },
    { value: '5', label: 'Critical' },
    { value: '4', label: 'High' },
    { value: '3', label: 'Medium' },
    { value: '2', label: 'Low' },
  ]

  const filteredTasks = tasks.filter(task => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.category && task.category !== filters.category) return false
    if (filters.urgency && task.urgency !== parseInt(filters.urgency)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Tasks<span className="text-[#D6CCC2]">.</span>
        </h1>
        <p className="text-white/50 mt-1 tracking-wide">
          Find opportunities that match your skills and availability
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="SEARCH TASKS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-4 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6CCC2]/50 uppercase tracking-wider"
          />
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 text-white/60 hover:text-white"
        >
          <Filter size={16} />
          FILTERS
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium tracking-wide">FILTERS</h3>
            <button onClick={clearFilters} className="text-xs text-[#D6CCC2] hover:underline">
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="CATEGORY"
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              options={categoryOptions}
            />
            <Select
              label="URGENCY"
              value={filters.urgency}
              onChange={(e) => setFilter('urgency', e.target.value)}
              options={urgencyOptions}
            />
          </div>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40 tracking-wide">
          {filteredTasks.length} TASK{filteredTasks.length !== 1 ? 'S' : ''} FOUND
        </p>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 bg-white/[0.02] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <Search size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-4">No tasks match your filters</p>
          <Button variant="ghost" onClick={clearFilters} className="text-[#D6CCC2]">
            Clear filters
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`}>
              <Card className="h-full hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge variant={urgencyVariant[task.urgency]}>{urgencyVariant[task.urgency]}</Badge>
                    <Badge>{task.category}</Badge>
                  </div>
                  <span className="text-xs text-white/30">
                    {task.priorityScore ? `${Math.round(task.priorityScore * 100)}%` : ''}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[#D6CCC2] transition-colors">
                  {task.title}
                </h3>
                <p className="text-sm text-white/50 mb-4 line-clamp-2">
                  {task.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-xs text-white/40 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {task.location?.city}, {task.location?.district}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-white/40" />
                    <span className="text-sm text-white/50">
                      {task.slotsFilled}/{task.slotsNeeded}
                    </span>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D6CCC2] rounded-full"
                        style={{ width: `${(task.slotsFilled / task.slotsNeeded) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/60 group-hover:text-white">
                    APPLY <ChevronRight size={14} />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}