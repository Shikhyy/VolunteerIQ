import { useState } from 'react'
import { Search, Download, MoreVertical, Edit, Trash2, Mail, Phone } from 'lucide-react'
import { Card, Badge, Select } from '../../components/ui'
import Avatar from '../../components/ui/Avatar'

const mockVolunteers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543210', skills: ['Medical', 'Teaching'], status: 'active', tasksCompleted: 12, joinedAt: '2026-03-01' },
  { id: 2, name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 9876543211', skills: ['Logistics', 'Driving'], status: 'active', tasksCompleted: 8, joinedAt: '2026-03-15' },
  { id: 3, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 9876543212', skills: ['Tech', 'Admin'], status: 'active', tasksCompleted: 5, joinedAt: '2026-03-20' },
  { id: 4, name: 'Raj Patel', email: 'raj@example.com', phone: '+91 9876543213', skills: ['Medical'], status: 'inactive', tasksCompleted: 3, joinedAt: '2026-02-15' },
  { id: 5, name: 'Sita Devi', email: 'sita@example.com', phone: '+91 9876543214', skills: ['Cooking', 'Logistics'], status: 'active', tasksCompleted: 15, joinedAt: '2026-01-20' },
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const skillOptions = [
  { value: '', label: 'All Skills' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'Teaching', label: 'Teaching' },
  { value: 'Tech', label: 'Tech' },
]

export default function AdminVolunteerTable() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [skill, setSkill] = useState('')

  const filteredVolunteers = mockVolunteers.filter(vol => {
    if (search && !vol.name.toLowerCase().includes(search.toLowerCase())) return false
    if (status && vol.status !== status) return false
    if (skill && !vol.skills.includes(skill)) return false
    return true
  })

  const handleExport = () => {
    const csv = 'Name,Email,Phone,Skills,Status,Tasks Completed\n' +
      filteredVolunteers.map(v => `${v.name},${v.email},${v.phone},"${v.skills.join(', ')}",${v.status},${v.tasksCompleted}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'volunteers.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Volunteers</h1>
          <p className="text-[#6B6B6B]">Manage your volunteer team.</p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <Download size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-2 focus:border-[#D6CCC2]"
            />
          </div>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
            className="w-36"
          />
          <Select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            options={skillOptions}
            className="w-36"
          />
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA] border-b border-[#E5E5E5]">
              <tr>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Volunteer</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Skills</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Status</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Tasks</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3">Joined</th>
                <th className="text-left text-sm font-medium text-[#6B6B6B] px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={vol.name} size="sm" />
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{vol.name}</p>
                        <p className="text-sm text-[#6B6B6B]">{vol.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={vol.status}>{vol.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6B6B]">
                    {vol.tasksCompleted}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B6B6B]">
                    {vol.joinedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-[#EDEDE9] rounded" title="Email">
                        <Mail size={16} className="text-[#6B6B6B]" />
                      </button>
                      <button className="p-1.5 hover:bg-[#EDEDE9] rounded" title="Call">
                        <Phone size={16} className="text-[#6B6B6B]" />
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