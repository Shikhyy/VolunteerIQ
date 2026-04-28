import { useState, useEffect } from 'react'
import { Users, Clock, AlertCircle, CheckCircle, MapPin, Bell, Trash2 } from 'lucide-react'
import { Card, Button, Badge } from '../../components/ui'

const NOTIFICATION_ICONS = {
  task_assigned: Users,
  task_reminder: Clock,
  match_ready: AlertCircle,
  task_completed: CheckCircle,
  new_task: MapPin,
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:3001/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data || [])
      } else {
        setNotifications([])
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkRead = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/notifications/${id}/read`, { method: 'PUT' })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error('Failed to mark read:', err)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await fetch('http://localhost:3001/api/notifications/read-all', { method: 'PUT' })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notifications<span className="text-[#D6CCC2]">.</span>
          </h1>
          <p className="text-white/50 mt-1 tracking-wide">
            Stay updated on your tasks
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            MARK ALL READ
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-20 bg-white/[0.02] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">No notifications yet</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell
            return (
              <Card 
                key={notification.id}
                className={`
                  flex items-start gap-4 p-4
                  ${!notification.read ? 'bg-[#D6CCC2]/5' : ''}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${!notification.read ? 'bg-[#D6CCC2]/20' : 'bg-white/[0.05]'}
                `}>
                  <Icon size={18} className={notification.read ? 'text-white/40' : 'text-[#D6CCC2]'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${!notification.read ? 'text-white' : 'text-white/70'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && <Badge className="text-[9px]">NEW</Badge>}
                  </div>
                  <p className="text-sm text-white/50">{notification.body}</p>
                  <p className="text-xs text-white/30 mt-2">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button 
                    onClick={() => handleMarkRead(notification.id)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <CheckCircle size={16} className="text-white/30" />
                  </button>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}