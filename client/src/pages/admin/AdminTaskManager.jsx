import { useState } from 'react'
import { Search, Edit, Trash2, Eye } from 'lucide-react'
import { Card, Badge, Select } from '../../components/ui'

const mockTasks = [
  { id: 1, title: 'Medical camp setup — Okhla', category: 'Medical', urgency: 5, status: 'open', deadline: '2026-04-28', slotsFilled: 3, slotsNeeded: 8 },
  { id: 2, title: 'Food distribution — Rohini', category: 'Logistics', urgency: 4, status: 'in_progress', deadline: '2026-04-29', slotsFilled: 3, slotsNeeded: 6 },
  { id: 3, title: 'Teaching support — Dwarka', category: 'Teaching', urgency: 3, status: 'open', deadline: '2026-05-01', slotsFilled: 2, slotsNeeded: 4 },
  { id: 4, title: 'Elderly care home — Janakpuri', category: 'Admin', urgency: 2, status: 'completed', deadline: '2026-04-25', slotsFilled: 3, slotsNeeded: 3 },
  { id: 5, title: 'Mobile clinic — Sarojini', category: 'Medical', urgency: 4, status: 'open', deadline: '2026-04-30', slotsFilled: 1, slotsNeeded: 5 },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Admin', label: 'Admin' },
]

export default function AdminTaskManager() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')

  const filteredTasks = mockTasks.filter(task => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
    if (status && task.status !== status) return false
    if (category && task.category !== category) return false
    return true
  })

  const getUrgencyBadge = (urgency) => {
    if (urgency >= 5) return 'critical'
    if (urgency >= 4) return 'high'
    if (urgency >= 3) return 'medium'
    return 'low'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Manage Tasks</h1>
          <p className="text-[#6B6B6B]">View and manage all volunteer tasks.</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-2 focus:border-[#D6CCC2]"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
            className="w-40"
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]">
              <tr>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Task</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Category</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Urgency</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Status</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Volunteers</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Deadline</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1A1A1A]">{task.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{task.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getUrgencyBadge(task.urgency)}>{getUrgencyBadge(task.urgency)}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6B6B]">
                    {task.slotsFilled}/{task.slotsNeeded}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6B6B]">
                    {task.deadline}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-[#EDEDE9] rounded">
                        <Eye size={16} className="text-[#6B6B6B]" />
                      </button>
                      <button className="p-1.5 hover:bg-[#EDEDE9] rounded">
                        <Edit size={16} className="text-[#6B6B6B]" />
                      </button>
                      <button className="p-1.5 hover:bg-[#EDEDE9] rounded">
                        <Trash2 size={16} className="text-red-500" />
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