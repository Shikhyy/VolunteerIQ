import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, MapPin, Users, Clock, ChevronRight } from 'lucide-react'
import { Card, Badge, Button, Input, Select } from '../../components/ui'
import { tasks as tasksApi } from '../../api/client'

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

export default function TaskBrowser() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [urgency, setUrgency] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await tasksApi.list()
      setTasks(data || [])
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (search && !task.title?.toLowerCase().includes(search.toLowerCase())) return false
    if (category && task.category !== category) return false
    if (urgency && task.urgency !== parseInt(urgency)) return false
    return true
  })

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Teaching', label: 'Teaching' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Admin', label: 'Admin' },
  ]

  const urgencyOptions = [
    { value: '', label: 'All Urgencies' },
    { value: '5', label: 'Critical' },
    { value: '4', label: 'High' },
    { value: '3', label: 'Medium' },
    { value: '2', label: 'Low' },
  ]

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setUrgency('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
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
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          className="w-40"
        />
        <Select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          options={urgencyOptions}
          className="w-40"
        />
        {(search || category || urgency) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            CLEAR
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40 tracking-wide">
          {filteredTasks.length} TASK{filteredTasks.length !== 1 ? 'S' : ''} FOUND
        </p>
        <Link to="/map">
          <Button variant="ghost" size="sm" className="gap-2">
            MAP VIEW <MapPin size={14} />
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <Card className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchTasks}>RETRY</Button>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-48 bg-white/[0.02] rounded-xl animate-pulse animate-slide-up" style={{animationDelay: `${(i-1) * 100}ms`}} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTasks.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-white/40 mb-4">No tasks match your filters</p>
          <Button variant="ghost" onClick={clearFilters}>CLEAR FILTERS</Button>
        </Card>
      )}

      {/* Task Grid */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
          {filteredTasks.map((task, idx) => (
            <Link key={task.id} to={`/tasks/${task.id}`}>
              <Card hover className="h-full animate-slide-up" style={{animationDelay: `${idx * 50}ms`}}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={urgencyVariant[task.urgency]}>{urgencyVariant[task.urgency]}</Badge>
                  <Badge>{task.category}</Badge>
                </div>
                <h3 className="font-semibold mb-2">{task.title}</h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-4">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-white/40 mt-auto">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {task.city || 'Delhi'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    {task.slots_needed - (task.slots_filled || 0)} spots
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/40 mt-2">
                  <Clock size={12} />
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Flexible'}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}