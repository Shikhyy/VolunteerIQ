import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Clock, CheckCircle, TrendingUp, FileText, Upload, 
  ArrowRight, Search, Filter, Plus, Calendar
} from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'
import { useTaskStore } from '../../store/taskStore'
import { useVolunteerStore } from '../../store/volunteerStore'

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

export default function AdminDashboard() {
  const { tasks } = useTaskStore()
  const { volunteers } = useVolunteerStore()

  const statsData = [
    { label: 'TOTAL TASKS', value: tasks.length, icon: FileText },
    { label: 'OPEN', value: tasks.filter(t => t.status === 'open').length, icon: Clock },
    { label: 'VOLUNTEERS', value: volunteers.length, icon: Users },
    { label: 'COMPLETED', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle },
  ]

  const categoryData = [
    { name: 'Medical', value: tasks.filter(t => t.category === 'Medical').length },
    { name: 'Logistics', value: tasks.filter(t => t.category === 'Logistics').length },
    { name: 'Teaching', value: tasks.filter(t => t.category === 'Teaching').length },
    { name: 'Construction', value: tasks.filter(t => t.category === 'Construction').length },
    { name: 'Tech', value: tasks.filter(t => t.category === 'Tech').length },
    { name: 'Admin', value: tasks.filter(t => t.category === 'Admin').length },
  ]

  const recentActivity = [
    { id: 1, action: 'New volunteer signup', name: 'Priya Sharma', time: '2 min ago' },
    { id: 2, action: 'Task completed', name: 'Medical camp — Okhla', time: '15 min ago' },
    { id: 3, action: 'Task created', name: 'Food distribution — Rohini', time: '1 hour ago' },
    { id: 4, action: 'Volunteer assigned', name: 'Amit Kumar', time: '2 hours ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard<span className="text-[#D6CCC2]">.</span></h1>
        <p className="text-white/50 mt-1">Overview of your organization's volunteer activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="group p-6 bg-[#0A0A0A] hover:bg-[#111] transition-all duration-500">
              <Icon size={20} className="text-[#D6CCC2] mb-4" />
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs tracking-[0.15em] text-white/40 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card padding="lg">
          <h2 className="text-sm font-medium tracking-wider text-white/60 mb-6">TASKS BY CATEGORY</h2>
          <div className="space-y-4">
            {categoryData.filter(c => c.value > 0).map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-20 text-xs text-white/50 tracking-wide">{cat.name}</span>
                <div className="flex-1 h-6 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D6CCC2] rounded-full transition-all"
                    style={{ width: `${(cat.value / tasks.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-white/60 w-6">{cat.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium tracking-wider text-white/60">RECENT ACTIVITY</h2>
            <Link to="/admin/tasks" className="text-xs text-[#D6CCC2] hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D6CCC2]" />
                <div className="flex-1">
                  <p className="text-sm text-white/80">{activity.action}</p>
                  <p className="text-xs text-white/40">
                    {activity.name} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/tasks/create">
          <Card className="p-4 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2]/20 rounded-lg flex items-center justify-center">
                <Plus size={20} className="text-[#D6CCC2]" />
              </div>
              <div>
                <p className="font-medium text-white">Create Task</p>
                <p className="text-xs text-white/40">Add new opportunity</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/admin/import">
          <Card className="p-4 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2]/20 rounded-lg flex items-center justify-center">
                <Upload size={20} className="text-[#D6CCC2]" />
              </div>
              <div>
                <p className="font-medium text-white">Import CSV</p>
                <p className="text-xs text-white/40">Bulk upload</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/admin/volunteers">
          <Card className="p-4 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2]/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-[#D6CCC2]" />
              </div>
              <div>
                <p className="font-medium text-white">Volunteers</p>
                <p className="text-xs text-white/40">Manage team</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/map">
          <Card className="p-4 hover:bg-white/[0.03] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2]/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-[#D6CCC2]" />
              </div>
              <div>
                <p className="font-medium text-white">View Map</p>
                <p className="text-xs text-white/40">Coverage</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}