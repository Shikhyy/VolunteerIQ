import { Link } from 'react-router-dom'
import { 
  Users, Clock, CheckCircle, TrendingUp, FileText, Upload, 
  Plus, Search, Download, Edit, Trash2, Eye, MoreVertical
} from 'lucide-react'
import { Card, Badge, Button, Input, Select } from '../../components/ui'
import { useTaskStore } from '../../store/taskStore'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

export default function AdminTaskManager() {
  const { tasks } = useTaskStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const filteredTasks = tasks.filter(task => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
    if (status && task.status !== status) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks<span className="text-[#D6CCC2]">.</span></h1>
          <p className="text-white/50 mt-1">Manage all volunteer tasks</p>
        </div>
        <Link to="/tasks/create">
          <Button className="bg-[#D6CCC2] text-[#0A0A0A] gap-2">
            <Plus size={16} /> CREATE
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="SEARCH TASKS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6CCC2]/50 uppercase tracking-wider"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">TASK</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">CATEGORY</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">URGENCY</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">STATUS</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">TEAM</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">DEADLINE</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{task.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{task.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={urgencyVariant[task.urgency]}>{urgencyVariant[task.urgency]}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/50">
                    {task.slotsFilled}/{task.slotsNeeded}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/50">
                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <Eye size={14} className="text-white/50" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <Edit size={14} className="text-white/50" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}