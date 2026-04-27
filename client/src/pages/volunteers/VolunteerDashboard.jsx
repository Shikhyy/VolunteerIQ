import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'

const statsData = [
  { label: 'Active Tasks', value: 12, change: '+12%', icon: Clock, color: 'bg-[#D6CCC2]' },
  { label: 'Tasks Completed', value: 8, change: '+24%', icon: CheckCircle, color: 'bg-[#D6CCC2]' },
  { label: 'Hours Volunteered', value: 24, change: '+8%', icon: TrendingUp, color: 'bg-[#D6CCC2]' },
  { label: 'Team Members', value: 5, change: '+2', icon: Users, color: 'bg-[#D6CCC2]' },
]

const mockTasks = [
  {
    id: 1,
    title: 'Medical camp setup — Okhla',
    category: 'Medical',
    urgency: 'critical',
    location: 'Okhla, Delhi',
    deadline: 'Today, 6:00 PM',
    slotsFilled: 5,
    slotsNeeded: 8,
    status: 'in_progress',
  },
  {
    id: 2,
    title: 'Food distribution — Rohini',
    category: 'Logistics',
    urgency: 'high',
    location: 'Rohini, Delhi',
    deadline: 'Tomorrow, 10:00 AM',
    slotsFilled: 3,
    slotsNeeded: 6,
    status: 'open',
  },
  {
    id: 3,
    title: 'Teaching support — Dwarka',
    category: 'Teaching',
    urgency: 'medium',
    location: 'Dwarka, Delhi',
    deadline: 'Mar 1, 9:00 AM',
    slotsFilled: 2,
    slotsNeeded: 4,
    status: 'open',
  },
]

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState('active')

  const tabs = [
    { id: 'active', label: 'Active (3)' },
    { id: 'pending', label: 'Pending (0)' },
    { id: 'completed', label: 'Completed (8)' },
  ]

  const filterTasks = () => {
    switch (activeTab) {
      case 'active': return mockTasks.filter(t => t.status === 'in_progress')
      case 'pending': return []
      case 'completed': return mockTasks.filter(t => t.status === 'completed')
      default: return mockTasks
    }
  }

  const tasks = filterTasks()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome back!</h1>
        <p className="text-[#6B6B6B]">Here's what's happening with your volunteer work.</p>
      </div>

      {/* Stats */}
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

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link to="/tasks">
          <Button variant="secondary" size="sm">
            <Clock size={16} className="mr-2" />
            Browse Tasks
          </Button>
        </Link>
        <Link to="/map">
          <Button variant="secondary" size="sm">
            View Map
          </Button>
        </Link>
      </div>

      {/* Tasks */}
      <Card padding="none">
        <div className="border-b border-[#E5E5E5]">
          <div className="flex gap-6 px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-[#D6CCC2] text-[#1A1A1A]'
                    : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B6B6B]">No tasks found</p>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="mt-2">
                  Browse available tasks <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-[#FAFAFA] rounded-lg hover:bg-[#EDEDE9] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge variant={task.urgency}>{task.urgency}</Badge>
                      <Badge>{task.category}</Badge>
                    </div>
                    <span className="text-sm text-[#9CA3AF]">{task.deadline}</span>
                  </div>
                  <h3 className="font-medium text-[#1A1A1A] mb-1">{task.title}</h3>
                  <p className="text-sm text-[#6B6B6B] mb-3">{task.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D6CCC2] rounded-full"
                          style={{ width: `${(task.slotsFilled / task.slotsNeeded) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#6B6B6B]">
                        {task.slotsFilled}/{task.slotsNeeded} volunteers
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}