import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Clock, Users, TrendingUp, CheckCircle, ArrowRight, MapPin, 
  Plus, Bell, Search, Settings, LogOut, ChevronRight,
  Heart, Target, Star, Award, Calendar, Activity
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

export default function VolunteerDashboard() {
  const { tasks, myTasks } = useTaskStore()
  const { myProfile } = useVolunteerStore()
  const [activeTab, setActiveTab] = useState('active')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [activeTab])

  const statsData = [
    { label: 'MY TASKS', value: myTasks.length, icon: CheckCircle, color: 'text-[#D6CCC2]' },
    { label: 'COMPLETED', value: myProfile?.tasksCompleted || 0, icon: Award, color: 'text-[#D5BDAF]' },
    { label: 'HOURS', value: myProfile?.hoursVolunteered || 0, icon: Clock, color: 'text-[#E3D5CA]' },
    { label: 'TEAM', value: myProfile?.teamSize || 0, icon: Users, color: 'text-white/60' },
  ]

  const tabs = [
    { id: 'active', label: 'ACTIVE' },
    { id: 'pending', label: 'PENDING' },
    { id: 'completed', label: 'COMPLETED' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back<span className="text-[#D6CCC2]">.</span>
          </h1>
          <p className="text-white/40 mt-1 tracking-wide">
            Here's what's happening with your volunteer work
          </p>
        </div>
        <Link to="/tasks">
          <Button className="bg-[#D6CCC2] text-[#0A0A0A] hover:bg-[#E3D5CA] gap-2">
            <Plus size={18} /> FIND TASKS
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="group p-6 bg-[#0A0A0A] hover:bg-[#111] transition-all duration-500">
              <Icon size={20} className={`${stat.color} mb-4`} />
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs tracking-[0.15em] text-white/40 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/tasks">
          <Button variant="ghost" className="text-white/60 hover:text-white gap-2">
            <Search size={16} /> BROWSE TASKS
          </Button>
        </Link>
        <Link to="/map">
          <Button variant="ghost" className="text-white/60 hover:text-white gap-2">
            <MapPin size={16} /> VIEW MAP
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" className="text-white/60 hover:text-white gap-2">
            <Settings size={16} /> PROFILE
          </Button>
        </Link>
      </div>

      {/* Tasks Section */}
      <Card padding="none" className="overflow-hidden">
        <div className="border-b border-white/[0.06]">
          <div className="flex gap-6 px-6 pt-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-4 text-sm font-medium tracking-[0.1em] border-b-2 whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                    ? 'border-[#D6CCC2] text-white'
                    : 'border-transparent text-white/40 hover:text-white'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-white/[0.02] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-16">
              <Target size={40} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40 mb-4 tracking-wide">No active tasks</p>
              <Link to="/tasks">
                <Button variant="ghost" className="text-[#D6CCC2] gap-2">
                  Browse available tasks <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="group p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.1] rounded-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge variant={urgencyVariant[task.urgency]} className="text-[10px] tracking-wider">
                        {urgencyVariant[task.urgency].toUpperCase()}
                      </Badge>
                      <Badge className="text-[10px] tracking-wider">{task.category}</Badge>
                    </div>
                    <span className="text-xs text-white/30">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 tracking-wide">
                    {task.title}
                  </h3>
                  <p className="text-sm text-white/50 mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-white/40 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      {task.location?.city}, {task.location?.district}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      {task.slotsFilled}/{task.slotsNeeded} volunteers
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1.5 bg-white/[0.1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D6CCC2] rounded-full transition-all"
                          style={{ width: `${(task.slotsFilled / task.slotsNeeded) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">
                        {Math.round((task.slotsFilled / task.slotsNeeded) * 100)}% filled
                      </span>
                    </div>
                    <Link to={`/tasks/${task.id}`}>
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1">
                        VIEW <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Recommended Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-wide">RECOMMENDED FOR YOU</h2>
          <Link to="/tasks" className="text-sm text-[#D6CCC2] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.slice(0, 3).map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`}>
              <div className="group p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.1] rounded-xl transition-all h-full">
                <div className="flex gap-2 mb-3">
                  <Badge variant={urgencyVariant[task.urgency]} className="text-[10px]">
                    {urgencyVariant[task.urgency]}
                  </Badge>
                  <Badge className="text-[10px]">{task.category}</Badge>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-[#D6CCC2] transition-colors">
                  {task.title}
                </h3>
                <p className="text-sm text-white/40 line-clamp-2 mb-3">
                  {task.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-white/30">
                  <MapPin size={12} />
                  {task.location?.city}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}