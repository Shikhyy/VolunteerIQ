import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Clock, Users, Edit, Trash2, 
  RefreshCw, Sparkles, CheckCircle, UserPlus, AlertCircle
} from 'lucide-react'
import { Card, Badge, Button, Avatar, Spinner } from '../../components/ui'
import { useTaskStore } from '../../store/taskStore'
import { useVolunteerStore } from '../../store/volunteerStore'
import { useAuthStore } from '../../store/authStore'
import { tasks as tasksApi } from '../../api/client'

const urgencyVariant = {
  5: 'critical',
  4: 'high', 
  3: 'medium',
  2: 'low',
  1: 'low',
}

function getHoursRemaining(deadline) {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const hours = Math.max(0, Math.floor((deadlineDate - now) / (1000 * 60 * 60)))
  return hours
}

function formatDeadline(deadline) {
  const hours = getHoursRemaining(deadline)
  if (hours === 0) return 'Less than 1 hour left'
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} remaining`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''} remaining`
}

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, selectTask } = useTaskStore()
  const { matchResults, setMatchResults } = useVolunteerStore()
  const { user, role } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [applying, setApplying] = useState(false)
  
  const task = tasks.find(t => String(t.id) === String(id))
  const matches = matchResults[id] || []
  const isAdmin = role === 'admin'
  const hoursRemaining = task ? getHoursRemaining(task.deadline) : 0
  const slotsProgress = task ? (task.slotsFilled / task.slotsNeeded) * 100 : 0

  useEffect(() => {
    if (task) {
      selectTask(task)
    }
  }, [task, selectTask])

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      const { data } = await tasksApi.match(id)
      setMatchResults(id, data.matches || [])
    } catch (error) {
      console.error('Failed to recalculate matches:', error)
    } finally {
      setRecalculating(false)
    }
  }

  const handleApply = () => {
    setApplying(true)
    setTimeout(() => {
      setApplying(false)
      alert('Application submitted successfully!')
    }, 1000)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log('Delete task:', id)
      navigate('/tasks')
    }
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle size={48} className="text-white/20 mb-4" />
        <p className="text-white/50 mb-4">Task not found</p>
        <Link to="/tasks">
          <Button variant="ghost">Back to Tasks</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/tasks">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              BACK
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {task.title}
            </h1>
            <p className="text-sm text-white/40 tracking-wide">
              Task Details
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={Edit}>
              EDIT
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={handleDelete}>
              DELETE
            </Button>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={urgencyVariant[task.urgency]}>
          {urgencyVariant[task.urgency]}
        </Badge>
        <Badge>{task.category}</Badge>
        <Badge variant={task.status}>{task.status.replace('_', ' ')}</Badge>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card>
            <h2 className="text-lg font-semibold mb-4 tracking-wide">DESCRIPTION</h2>
            <p className="text-white/70 leading-relaxed">
              {task.description}
            </p>
            {task.requiredSkills?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <p className="text-sm text-white/40 mb-2 tracking-wide">SKILLS NEEDED</p>
                <div className="flex flex-wrap gap-2">
                  {task.requiredSkills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* AI Recommended Volunteers */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#D6CCC2]" />
                <h2 className="text-lg font-semibold tracking-wide">
                  AI RECOMMENDED VOLUNTEERS
                </h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                icon={RefreshCw}
                loading={recalculating}
                onClick={handleRecalculate}
              >
                RECALCULATE
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-12">
                <Users size={40} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No matching volunteers found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div 
                    key={match.volunteerId}
                    className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="text-lg font-bold text-white/30 w-6">
                      #{index + 1}
                    </div>
                    <Avatar name={match.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{match.name}</p>
                        <span className="text-xs text-[#D6CCC2] font-medium">
                          {Math.round(match.matchScore * 100)}% match
                        </span>
                      </div>
                      <p className="text-sm text-white/50 truncate">
                        {match.aiReasoning}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        <span>{match.skillOverlapPct}% skill match</span>
                        <span>{match.distanceKm} km away</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon={UserPlus}>
                      INVITE
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Details */}
          <Card>
            <h3 className="text-sm font-semibold text-white/40 mb-4 tracking-wide">
              TASK DETAILS
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-white/40 mt-0.5" />
                <div>
                  <p className="text-xs text-white/40 tracking-wide">LOCATION</p>
                  <p className="text-sm">{task.location?.address}</p>
                  <p className="text-sm text-white/50">
                    {task.location?.district}, {task.location?.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="text-white/40 mt-0.5" />
                <div>
                  <p className="text-xs text-white/40 tracking-wide">DEADLINE</p>
                  <p className="text-sm">
                    {new Date(task.deadline).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className={`text-sm ${hoursRemaining < 24 ? 'text-red-400' : 'text-white/50'}`}>
                    {formatDeadline(task.deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users size={16} className="text-white/40 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-white/40 tracking-wide">VOLUNTEERS</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm">
                      {task.slotsFilled} / {task.slotsNeeded} filled
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D6CCC2] rounded-full transition-all"
                        style={{ width: `${slotsProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Button */}
          <Button 
            className="w-full" 
            size="lg"
            icon={CheckCircle}
            loading={applying}
            disabled={task.slotsFilled >= task.slotsNeeded}
            onClick={handleApply}
          >
            {task.slotsFilled >= task.slotsNeeded ? 'TASK FULL' : 'APPLY TO HELP'}
          </Button>
        </div>
      </div>
    </div>
  )
}