import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Clock, CheckCircle, TrendingUp, FileText, ArrowRight } from 'lucide-react'
import { Card } from '../../components/ui'

const statsData = [
  { label: 'Total Tasks', value: 24, change: '+12%', icon: FileText, color: 'bg-[#D6CCC2]' },
  { label: 'Open Tasks', value: 12, change: '+8%', icon: Clock, color: 'bg-[#D6CCC2]' },
  { label: 'Active Volunteers', value: 47, change: '+24%', icon: Users, color: 'bg-[#D6CCC2]' },
  { label: 'Completed', value: 156, change: '+32%', icon: CheckCircle, color: 'bg-[#D6CCC2]' },
]

const categoryData = [
  { name: 'Medical', value: 8 },
  { name: 'Logistics', value: 6 },
  { name: 'Teaching', value: 4 },
  { name: 'Construction', value: 3 },
  { name: 'Tech', value: 2 },
  { name: 'Admin', value: 1 },
]

const recentActivity = [
  { id: 1, action: 'New volunteer signup', name: 'Priya Sharma', time: '2 min ago', type: 'volunteer' },
  { id: 2, action: 'Task completed', name: 'Medical camp — Okhla', time: '15 min ago', type: 'task' },
  { id: 3, action: 'Task created', name: 'Food distribution — Rohini', time: '1 hour ago', type: 'task' },
  { id: 4, action: 'Volunteer assigned', name: 'Amit Kumar', time: '2 hours ago', type: 'volunteer' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#6B6B6B]">Overview of your organization's volunteer activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={20} className="text-[#1A1A1A]" />
                </div>
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] mt-3">{stat.value}</p>
              <p className="text-sm text-[#6B6B6B]">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions & Category Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Tasks by Category</h2>
          <div className="space-y-3">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-20 text-sm text-[#6B6B6B]">{cat.name}</span>
                <div className="flex-1 h-6 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D6CCC2] rounded-full"
                    style={{ width: `${(cat.value / 24) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[#1A1A1A] w-6">{cat.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Recent Activity</h2>
            <Link to="/admin/tasks" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D6CCC2]" />
                <div className="flex-1">
                  <p className="text-sm text-[#1A1A1A]">{activity.action}</p>
                  <p className="text-xs text-[#6B6B6B]">
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
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-[#1A1A1A]" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">Create Task</p>
                <p className="text-xs text-[#6B6B6B]">Add new opportunity</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/admin/import">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-[#1A1A1A]" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">Import CSV</p>
                <p className="text-xs text-[#6B6B6B]">Bulk upload</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/admin/volunteers">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
                <Users size={20} className="text-[#1A1A1A]" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">Volunteers</p>
                <p className="text-xs text-[#6B6B6B]">Manage team</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/map">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-[#1A1A1A]" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">View Map</p>
                <p className="text-xs text-[#6B6B6B]">Coverage</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}