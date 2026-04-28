import { useState, useEffect } from 'react'
import { Layers, Search, Filter, X, MapPin, Users, Clock } from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'
import { useTaskStore } from '../../store/taskStore'

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

export default function MapView() {
  const { tasks, fetchTasks } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [layers, setLayers] = useState({
    tasks: true,
    volunteers: true,
    heatmap: false,
  })
  const [filters, setFilters] = useState({
    category: '',
    urgency: '',
  })

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false))
  }, [])

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="relative h-[calc(100vh-8rem)] flex -mx-6 -mb-6">
      {/* Sidebar */}
      <div className="w-80 bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold tracking-wide">Map View</h2>
          <p className="text-sm text-white/50">Visualize tasks and volunteers</p>
        </div>

        {/* Layer Toggles */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} className="text-white/50" />
            <span className="text-xs font-medium text-white/60 tracking-wider uppercase">Layers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleLayer('tasks')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.tasks ? 'bg-[#D6CCC2] text-[#0A0A0A]' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}
              `}
            >
              Tasks
            </button>
            <button
              onClick={() => toggleLayer('volunteers')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.volunteers ? 'bg-[#D6CCC2] text-[#0A0A0A]' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}
              `}
            >
              Volunteers
            </button>
            <button
              onClick={() => toggleLayer('heatmap')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.heatmap ? 'bg-[#D6CCC2] text-[#0A0A0A]' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}
              `}
            >
              Heatmap
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-medium text-white/50 tracking-wider uppercase mb-3">
            {tasks.length} Tasks
          </h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`
                  w-full p-3 rounded-lg text-left transition-colors text-left
                  ${selectedTask?.id === task.id 
                    ? 'bg-[#D6CCC2]/10 border border-[#D6CCC2]/30' 
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={urgencyVariant[task.urgency]} className="text-[9px]">{urgencyVariant[task.urgency]}</Badge>
                  <Badge className="text-[9px]">{task.category}</Badge>
                </div>
                <p className="text-sm font-medium text-white truncate">{task.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#111]">
        {/* Map placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#D6CCC2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-[#D6CCC2]" />
            </div>
            <p className="text-white/60 mb-2">Map loads here</p>
            <p className="text-xs text-white/40">Configure Google Maps API key</p>
          </div>
        </div>

        {/* Task Detail Panel */}
        {selectedTask && (
          <Card className="absolute bottom-4 left-4 w-80 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2">
                <Badge variant={urgencyVariant[selectedTask.urgency]}>{urgencyVariant[selectedTask.urgency]}</Badge>
                <Badge>{selectedTask.category}</Badge>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-white/10 rounded">
                <X size={14} />
              </button>
            </div>
            <h3 className="font-semibold mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-white/50 mb-3 line-clamp-2">{selectedTask.description}</p>
            <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                {selectedTask.location?.city}
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                {selectedTask.slotsFilled}/{selectedTask.slotsNeeded}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(selectedTask.deadline).toLocaleDateString()}
              </div>
            </div>
            <Button className="w-full bg-[#D6CCC2] text-[#0A0A0A] text-sm">VIEW DETAILS</Button>
          </Card>
        )}

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-3 bg-[#111] border border-white/10 rounded-lg hover:bg-white/5">
            <Search size={18} />
          </button>
          <button className="p-3 bg-[#111] border border-white/10 rounded-lg hover:bg-white/5">
            <Filter size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}