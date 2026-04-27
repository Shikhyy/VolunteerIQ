import { useState } from 'react'
import { Layers, Search, Filter, X } from 'lucide-react'
import { Button, Badge } from '../../components/ui'

const mockTasks = [
  { id: 1, title: 'Medical camp', category: 'Medical', urgency: 'critical', lat: 28.6139, lng: 77.2090 },
  { id: 2, title: 'Food distribution', category: 'Logistics', urgency: 'high', lat: 28.5355, lng: 77.2910 },
  { id: 3, title: 'Teaching support', category: 'Teaching', urgency: 'medium', lat: 28.6692, lng: 77.4538 },
  { id: 4, title: 'Elderly care', category: 'Admin', urgency: 'low', lat: 28.6500, lng: 77.3400 },
]

const mockVolunteers = [
  { id: 1, name: 'Priya Sharma', lat: 28.6200, lng: 77.2100 },
  { id: 2, name: 'Amit Kumar', lat: 28.5400, lng: 77.2900 },
  { id: 3, name: 'Neha Gupta', lat: 28.6600, lng: 77.4500 },
]

export default function MapView() {
  const [selectedTask, setSelectedTask] = useState(null)
  const [layers, setLayers] = useState({
    tasks: true,
    volunteers: true,
    heatmap: false,
    coverage: false,
  })
  const [filters, setFilters] = useState({
    category: '',
    urgency: '',
  })

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  // Note: In production, use @react-google-maps/api
  // This is the UI shell with mock data
  return (
    <div className="relative h-[calc(100vh-8rem)] flex">
      {/* Sidebar */}
      <div className={`
        w-80 bg-white border-r border-[#E5E5E5] flex flex-col
        transition-all duration-300
        ${selectedTask ? 'translate-x-0' : 'translate-x-0'}
      `}>
        <div className="p-4 border-b border-[#E5E5E5]">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Map View</h2>
          <p className="text-sm text-[#6B6B6B]">Visualize tasks and volunteers</p>
        </div>

        {/* Layer Toggles */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-[#6B6B6B]" />
            <span className="text-sm font-medium text-[#1A1A1A]">Layers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleLayer('tasks')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.tasks ? 'bg-[#D6CCC2] text-[#1A1A1A]' : 'bg-[#F5F5F5] text-[#6B6B6B]'}
              `}
            >
              Tasks
            </button>
            <button
              onClick={() => toggleLayer('volunteers')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.volunteers ? 'bg-[#D6CCC2] text-[#1A1A1A]' : 'bg-[#F5F5F5] text-[#6B6B6B]'}
              `}
            >
              Volunteers
            </button>
            <button
              onClick={() => toggleLayer('heatmap')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.heatmap ? 'bg-[#D6CCC2] text-[#1A1A1A]' : 'bg-[#F5F5F5] text-[#6B6B6B]'}
              `}
            >
              Heatmap
            </button>
            <button
              onClick={() => toggleLayer('coverage')}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${layers.coverage ? 'bg-[#D6CCC2] text-[#1A1A1A]' : 'bg-[#F5F5F5] text-[#6B6B6B]'}
              `}
            >
              Coverage Gaps
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">
            {mockTasks.length} Tasks
          </h3>
          <div className="space-y-2">
            {mockTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`
                  w-full p-3 rounded-lg text-left transition-colors
                  ${selectedTask?.id === task.id 
                    ? 'bg-[#EDEDE9] border border-[#D6CCC2]' 
                    : 'bg-[#FAFAFA] hover:bg-[#EDEDE9]'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={task.urgency} className="text-[10px]">{task.urgency}</Badge>
                  <Badge className="text-[10px]">{task.category}</Badge>
                </div>
                <p className="text-sm font-medium text-[#1A1A1A]">{task.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#F5F5F5]">
        {/* Map placeholder - replace with GoogleMap in production */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#D6CCC2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Map loads here</p>
            <p className="text-sm text-[#9CA3AF] mt-1">Configure Google Maps API key</p>
          </div>
        </div>

        {/* Task Detail Panel */}
        {selectedTask && (
          <div className="absolute bottom-4 left-4 w-80 bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-2">
                <Badge variant={selectedTask.urgency}>{selectedTask.urgency}</Badge>
                <Badge>{selectedTask.category}</Badge>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-[#F5F5F5] rounded">
                <X size={16} />
              </button>
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-[#6B6B6B] mb-3">Location: {selectedTask.lat}, {selectedTask.lng}</p>
            <Button variant="primary" size="sm" className="w-full">View Details</Button>
          </div>
        )}

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white rounded-lg shadow hover:bg-[#EDEDE9]">
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}