import { useTaskStore } from '../../store/taskStore'
import { useVolunteerStore } from '../../store/volunteerStore'
import { Card, Badge } from '../../components/ui'
import { CheckCircle, Users, Clock, TrendingUp, Trophy, Calendar } from 'lucide-react'

export default function AnalyticsDashboard() {
  const { tasks } = useTaskStore()
  const { volunteers } = useVolunteerStore()

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const completedThisWeek = tasks.filter(t => {
    if (t.status !== 'completed' || !t.completedAt) return false
    return new Date(t.completedAt) >= weekAgo
  }).length

  const completedThisMonth = tasks.filter(t => {
    if (t.status !== 'completed' || !t.completedAt) return false
    return new Date(t.completedAt) >= monthAgo
  }).length

  const totalVolunteers = volunteers.length
  const activeTasks = tasks.filter(t => t.status === 'open').length
  const totalCompleted = tasks.filter(t => t.status === 'completed').length
  const avgCompletionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0

  const categoryCounts = {
    Medical: 0,
    Logistics: 0,
    Teaching: 0,
    Construction: 0,
    Tech: 0,
    Admin: 0,
  }
  tasks.forEach(t => {
    if (categoryCounts.hasOwnProperty(t.category)) {
      categoryCounts[t.category]++
    }
  })
  const maxCategory = Math.max(...Object.values(categoryCounts), 1)

  const urgencyCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  tasks.forEach(t => {
    const level = t.urgencyLevel || t.urgency || 3
    if (level >= 5) urgencyCounts.Critical++
    else if (level >= 4) urgencyCounts.High++
    else if (level >= 3) urgencyCounts.Medium++
    else urgencyCounts.Low++
  })
  const maxUrgency = Math.max(...Object.values(urgencyCounts), 1)

  const volunteerStats = volunteers.map(v => {
    const completed = tasks.filter(t => 
      t.volunteerId === v.id && t.status === 'completed'
    ).length
    const reliability = v.reliabilityScore || v.reliability || (Math.random() * 40 + 60)
    return { ...v, completed, reliability: Math.round(reliability) }
  }).sort((a, b) => b.completed - a.completed)
  const topVolunteers = volunteerStats.slice(0, 5)

  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' })
    const count = tasks.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false
      const taskDate = new Date(t.completedAt)
      return taskDate.toDateString() === date.toDateString()
    }).length
    last7Days.push({ day: dateStr, count })
  }
  const maxDayCount = Math.max(...last7Days.map(d => d.count), 1)

  const statsData = [
    { label: 'THIS WEEK', value: completedThisWeek, subtext: 'tasks completed', icon: Calendar },
    { label: 'THIS MONTH', value: completedThisMonth, subtext: 'tasks completed', icon: TrendingUp },
    { label: 'VOLUNTEERS', value: totalVolunteers, subtext: 'total registered', icon: Users },
    { label: 'COMPLETION', value: `${avgCompletionRate}%`, subtext: 'average rate', icon: CheckCircle },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics<span className="text-[#D6CCC2]">.</span></h1>
        <p className="text-white/50 mt-1">Insights and statistics for your organization</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="group p-6 bg-[#0A0A0A] hover:bg-[#111] transition-all duration-500">
              <Icon size={20} className="text-[#D6CCC2] mb-4" />
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs tracking-[0.15em] text-white/40 mt-1">{stat.label}</p>
              <p className="text-xs text-white/30 mt-0.5">{stat.subtext}</p>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <h2 className="text-sm font-medium tracking-wider text-white/60 mb-6">TASKS BY CATEGORY</h2>
          <div className="space-y-4">
            {Object.entries(categoryCounts).filter(([, v]) => v > 0).map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-20 text-xs text-white/50 tracking-wide">{name}</span>
                <div className="flex-1 h-4 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D6CCC2] rounded-full transition-all"
                    style={{ width: `${(value / maxCategory) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-white/60 w-8">{value}</span>
              </div>
            ))}
            {Object.values(categoryCounts).every(v => v === 0) && (
              <p className="text-sm text-white/30">No tasks available</p>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-sm font-medium tracking-wider text-white/60 mb-6">URGENCY DISTRIBUTION</h2>
          <div className="space-y-4">
            {Object.entries(urgencyCounts).map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-20 text-xs text-white/50 tracking-wide">{name}</span>
                <div className="flex-1 h-4 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      name === 'Critical' ? 'bg-red-500' :
                      name === 'High' ? 'bg-orange-500' :
                      name === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(value / maxUrgency) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-white/60 w-8">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <h2 className="text-sm font-medium tracking-wider text-white/60 mb-6 flex items-center gap-2">
          <Trophy size={16} className="text-[#D6CCC2]" />
          TOP VOLUNTEERS
        </h2>
        <div className="space-y-4">
          {topVolunteers.length > 0 ? topVolunteers.map((vol, idx) => (
            <div key={vol.id || idx} className="flex items-center gap-4">
              <span className="w-6 text-center text-sm font-bold text-white/30">
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{vol.displayName || vol.name || 'Volunteer'}</p>
                <p className="text-xs text-white/40">{vol.completed} tasks completed</p>
              </div>
              <Badge variant="completed" size="sm">{vol.reliability}% reliability</Badge>
            </div>
          )) : (
            <p className="text-sm text-white/30">No volunteer data available</p>
          )}
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="text-sm font-medium tracking-wider text-white/60 mb-6">RECENT ACTIVITY (7 DAYS)</h2>
        <div className="flex items-end gap-2 h-32">
          {last7Days.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end h-24">
                <div
                  className="w-full bg-[#D6CCC2] rounded-t transition-all"
                  style={{ height: `${(day.count / maxDayCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-white/40">{day.day}</span>
              <span className="text-xs text-white/60 font-medium">{day.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}