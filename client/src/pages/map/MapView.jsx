import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Search, Filter, X, MapPin, Users, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'
import { useAuthStore } from '../../store/authStore'
import { tasks as tasksApi } from '../../api/client'

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

export default function MapView() {
  const { user } = useAuthStore()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [layers, setLayers] = useState({
    tasks: true,
    volunteers: true,
    heatmap: false,
  })

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

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Map<span className="text-[#D6CCC2]">.</span>
          </h1>
          <p className="text-white/50 mt-1 tracking-wide">
            Explore opportunities near you
          </p>
        </div>
        <Link to="/tasks">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} /> LIST VIEW
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length },
          { label: 'Urgent', value: tasks.filter(t => t.urgency >= 4).length },
          { label: 'Open', value: tasks.filter(t => t.status === 'open').length },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
        ].map((stat, i) => (
          <Card key={i} padding="sm" className="text-center">
            <p className="text-2xl font-bold text-[#D6CCC2]">{stat.value}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Map Area */}
      <Card padding="none" className="h-[500px] relative overflow-hidden">
        {/* Map placeholder - shows when no Google Maps */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-[#D6CCC2]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={40} className="text-[#D6CCC2]/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Map</h3>
            <p className="text-white/40 mb-6">
              Tasks are shown by location. Configure Google Maps API to enable the full map experience.
            </p>
            
            {tasks.length > 0 && (
              <div className="text-left bg-[#111] rounded-lg p-4 max-h-48 overflow-y-auto">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Nearby Tasks</p>
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-white/[0.02] rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant={urgencyVariant[task.urgency]} className="text-[9px]">{task.urgency}</Badge>
                        <span className="text-sm text-white">{task.title}</span>
                      </div>
                      <span className="text-xs text-white/40">{task.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Task Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Opportunities</h2>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-32 bg-white/[0.02] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <Card className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchTasks}>RETRY</Button>
          </Card>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-white/40 mb-4">No tasks found</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} hover onClick={() => setSelectedTask(task)} className="cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={urgencyVariant[task.urgency]}>{urgencyVariant[task.urgency]}</Badge>
                  <Badge>{task.category}</Badge>
                </div>
                <h3 className="font-semibold mb-2">{task.title}</h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-4">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {task.city || 'Delhi'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    {task.slots_needed - (task.slots_filled || 0)} spots
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <Badge variant={urgencyVariant[selectedTask.urgency]}>{urgencyVariant[selectedTask.urgency]}</Badge>
                <Badge>{selectedTask.category}</Badge>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-white/10 rounded">
                <X size={18} />
              </button>
            </div>
            <h3 className="text-xl font-semibold mb-2">{selectedTask.title}</h3>
            <p className="text-white/60 mb-4">{selectedTask.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-white/40 text-xs uppercase">Location</p>
                <p className="text-white">{selectedTask.city || 'Delhi'}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase">Spots</p>
                <p className="text-white">{selectedTask.slots_needed - (selectedTask.slots_filled || 0)} available</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase">Status</p>
                <p className="text-white capitalize">{selectedTask.status}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase">Required Skills</p>
                <p className="text-white">{selectedTask.required_skills?.join(', ') || 'None'}</p>
              </div>
            </div>
            
            <Link to={`/tasks/${selectedTask.id}`}>
              <Button className="w-full">VIEW DETAILS</Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  )
}