import { useState } from 'react'
import { Search, Download, Mail, Phone, Edit, Trash2 } from 'lucide-react'
import { Card, Badge, Button, Input, Select } from '../../components/ui'
import Avatar from '../../components/ui/Avatar'
import { useVolunteerStore } from '../../store/volunteerStore'

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
  const { volunteers } = useVolunteerStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [skill, setSkill] = useState('')

  const filteredVolunteers = volunteers.filter(vol => {
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
          <h1 className="text-2xl font-bold tracking-tight">Volunteers<span className="text-[#D6CCC2]">.</span></h1>
          <p className="text-white/50 mt-1">Manage your volunteer team</p>
        </div>
        <Button variant="ghost" onClick={handleExport} className="gap-2 text-white/60 hover:text-white">
          <Download size={16} /> EXPORT
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="SEARCH VOLUNTEERS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6CCC2]/50 uppercase tracking-wider"
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
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">VOLUNTEER</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">SKILLS</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">STATUS</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">TASKS</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3">JOINED</th>
                <th className="text-left text-xs font-medium text-white/50 tracking-wider px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredVolunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={vol.name} size="sm" />
                      <div>
                        <p className="font-medium text-white">{vol.name}</p>
                        <p className="text-sm text-white/50">{vol.email}</p>
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
                  <td className="px-6 py-4 text-sm text-white/50">
                    {vol.tasksCompleted}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/50">
                    {vol.joinedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-white/10 rounded" title="Email">
                        <Mail size={14} className="text-white/50" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded" title="Call">
                        <Phone size={14} className="text-white/50" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <Edit size={14} className="text-white/50" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <Trash2 size={14} className="text-red-400" />
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