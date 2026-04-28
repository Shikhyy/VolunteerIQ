import { useState, useEffect } from 'react'
import { Users, Clock, AlertCircle, CheckCircle, MapPin } from 'lucide-react'
import { Card, Button } from '../../components/ui'
import { notifications as notificationsApi } from '../../api/client'

const NOTIFICATION_ICONS = {
  task_assigned: Users,
  task_reminder: Clock,
  match_ready: AlertCircle,
  task_completed: CheckCircle,
  new_task: MapPin,
}

const NOTIFICATION_COLORS = {
  task_assigned: 'text-[#D6CCC2] bg-[#D6CCC2]/10',
  task_reminder: 'text-amber-400 bg-amber-400/10',
  match_ready: 'text-emerald-400 bg-emerald-400/10',
  task_completed: 'text-emerald-400 bg-emerald-400/10',
  new_task: 'text-[#D6BDAF] bg-[#D6BDAF]/10',
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingRead, setMarkingRead] = useState(null)

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getAll()
      setNotifications(res.data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkRead = async (id) => {
    if (markingRead) return
    setMarkingRead(id)
    try {
      await notificationsApi.markRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setMarkingRead(null)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-48 bg-white/5 animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl" />
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
              <span className="ml-3 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-[#D6CCC2] text-black rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-white/40 mt-1 tracking-wide">
            Stay updated on your tasks and matches
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            onClick={handleMarkAllRead}
            className="text-white/60 hover:text-white"
          >
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-16">
          <AlertCircle size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 tracking-wide">No notifications yet</p>
          <p className="text-sm text-white/30 mt-1">
            You'll see updates about your tasks here
          </p>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="divide-y divide-white/[0.06]">
            {notifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || AlertCircle
              const colorClass = NOTIFICATION_COLORS[notification.type] || 'text-white/40 bg-white/10'

              return (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && handleMarkRead(notification.id)}
                  className={`
                    flex items-start gap-4 p-5 cursor-pointer transition-all
                    hover:bg-white/[0.02] border-l-2
                    ${notification.read
                      ? 'border-l-transparent bg-transparent'
                      : 'border-l-[#D6CCC2] bg-[#D6CCC2]/5'
                    }
                  `}
                >
                  <div className={`p-2.5 rounded-lg ${colorClass}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${notification.read ? 'text-white/60' : 'text-white'}`}>
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-sm text-white/40 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-white/30 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#D6CCC2] rounded-full mt-2" />
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}