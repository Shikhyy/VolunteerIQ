import { useState, useEffect } from 'react'
import { Users, Clock, AlertCircle, CheckCircle, MapPin, Bell } from 'lucide-react'
import { Card, Button } from '../../components/ui'
import { useVolunteerStore } from '../../store/volunteerStore'

const NOTIFICATION_ICONS = {
  task_assigned: Users,
  task_reminder: Clock,
  match_ready: AlertCircle,
  task_completed: CheckCircle,
  new_task: MapPin,
}

const mockNotifications = [
  {
    id: 1,
    type: 'task_assigned',
    title: 'New task assigned',
    body: 'You have been assigned to "Medical camp setup — Okhla"',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    type: 'task_reminder',
    title: 'Deadline approaching',
    body: 'Food distribution task due in 24 hours',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    type: 'task_completed',
    title: 'Task completed',
    body: 'Elderly care home — Janakpuri has been marked as completed',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 4,
    type: 'new_task',
    title: 'New task available',
    body: 'Shelter construction — Narela needs volunteers',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 500)
  }, [])

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-48 bg-white/[0.03] animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/[0.03] animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-[#D6CCC2] text-[#0A0A0A] rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-white/40 mt-1">Stay updated on your volunteer activities</p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={handleMarkAllRead}
            className="text-white/50 hover:text-white"
          >
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-16">
          <Bell size={40} className="text-white/15 mx-auto mb-4" />
          <p className="text-white/40 tracking-wide">No notifications yet</p>
          <p className="text-sm text-white/25 mt-1">
            You'll see updates about your tasks here
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell
            
            return (
              <div
                key={notification.id}
                onClick={() => handleMarkRead(notification.id)}
                className={`
                  group p-4 rounded-xl cursor-pointer transition-all duration-200
                  ${notification.read 
                    ? 'bg-white/[0.02] hover:bg-white/[0.04]' 
                    : 'bg-[#D6CCC2]/8 hover:bg-[#D6CCC2]/12 border-l-2 border-[#D6CCC2]'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    p-2.5 rounded-lg transition-colors
                    ${notification.read ? 'bg-white/[0.05] text-white/30' : 'bg-[#D6CCC2]/15 text-[#D6CCC2]'}
                  `}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`
                      font-medium tracking-wide
                      ${notification.read ? 'text-white/50' : 'text-white'}
                    `}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-white/35 mt-0.5 line-clamp-1">
                      {notification.body}
                    </p>
                    <p className="text-xs text-white/25 mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#D6CCC2] rounded-full mt-2" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
