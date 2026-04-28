import { useVolunteerStore } from '../../store/volunteerStore'

const StatCard = ({ label, value, icon }) => (
  <div className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
    <p className="text-white/50 text-sm mb-1">{label}</p>
    <p className="text-2xl font-semibold text-white">{value}</p>
  </div>
)

const Badge = ({ name, earned }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
    earned 
      ? 'bg-[#D6CCC2]/10 border-[#D6CCC2]/30' 
      : 'bg-white/[0.02] border-white/[0.06] opacity-40'
  }`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      earned ? 'bg-[#D6CCC2]' : 'bg-white/10'
    }`}>
      <span className={earned ? 'text-[#0A0A0A] text-sm' : 'text-white/30 text-sm'}>★</span>
    </div>
    <span className={earned ? 'text-white' : 'text-white/50'}>{name}</span>
  </div>
)

export default function VolunteerStats() {
  const { myProfile } = useVolunteerStore()
  
  const tasksCompleted = myProfile?.tasksCompleted || 0
  const totalHours = tasksCompleted * 4
  const reliability = myProfile?.reliabilityScore || 0
  const streak = Math.min(Math.floor(tasksCompleted / 2), 12)
  const skills = myProfile?.skills || []

  const monthlyData = [
    { month: 'Nov', tasks: Math.max(0, tasksCompleted - 8) },
    { month: 'Dec', tasks: Math.max(0, Math.min(3, tasksCompleted - 6)) },
    { month: 'Jan', tasks: Math.max(0, Math.min(2, tasksCompleted - 4)) },
    { month: 'Feb', tasks: Math.max(0, Math.min(3, tasksCompleted - 2)) },
    { month: 'Mar', tasks: Math.max(0, Math.min(4, tasksCompleted)) },
    { month: 'Apr', tasks: tasksCompleted > 0 ? Math.max(1, tasksCompleted % 3) : 0 },
  ]

  const maxTasks = Math.max(...monthlyData.map(m => m.tasks), 1)

  const skillColors = {
    'Medical': '#EF4444',
    'Teaching': '#3B82F6',
    'Tech': '#8B5CF6',
    'Logistics': '#F59E0B',
    'Driving': '#10B981',
    'Cooking': '#EC4899',
    'Admin': '#6366F1',
  }

  const skillData = skills.map((skill, index) => ({
    skill,
    color: skillColors[skill] || '#D6CCC2',
    percentage: Math.round(100 / skills.length)
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">My Stats</h1>
        <p className="text-white/50">Track your volunteer journey</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tasks Completed" value={tasksCompleted} />
        <StatCard label="Hours Volunteered" value={totalHours} />
        <StatCard label="Current Streak" value={`${streak} weeks`} />
        <StatCard label="Reliability Score" value={`${Math.round(reliability * 100)}%`} />
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-6">Activity (Last 6 Months)</h2>
        <div className="flex items-end justify-between gap-3 h-40">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-[#D6CCC2]/30 rounded-t-lg transition-all duration-500"
                style={{ height: `${(item.tasks / maxTasks) * 100}%`, minHeight: item.tasks > 0 ? '8px' : '0' }}
              />
              <span className="text-xs text-white/40">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-6">Skills Breakdown</h2>
        {skillData.length > 0 ? (
          <div className="flex items-center gap-8">
            <div 
              className="w-32 h-32 rounded-full"
              style={{
                background: `conic-gradient(${skillData.map((s, i) => {
                  const start = skillData.slice(0, i).reduce((acc, x) => acc + x.percentage, 0)
                  return `${s.color} ${start}% ${start + s.percentage}%`
                }).join(', ')})`
              }}
            />
            <div className="space-y-3">
              {skillData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white/80">{item.skill}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-white/40">No skills added yet</p>
        )}
      </div>

      <div className="bg-[#111] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-6">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Badge name="First Task" earned={tasksCompleted >= 1} />
          <Badge name="Consistent" earned={tasksCompleted >= 5} />
          <Badge name="Expert" earned={tasksCompleted >= 10} />
          <Badge name="Dedicated" earned={tasksCompleted >= 20} />
        </div>
      </div>
    </div>
  )
}