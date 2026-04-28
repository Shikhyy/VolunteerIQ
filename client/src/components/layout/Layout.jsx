import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Users, Map, BarChart3, FileText, Upload, 
  Settings, LogOut, Menu, X, Search, Bell, Plus, ChevronLeft, Menu as MenuIcon
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { notifications as notificationsApi } from '../../api/client'
import Avatar from '../ui/Avatar'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home, roles: ['volunteer', 'admin'] },
  { path: '/tasks', label: 'Tasks', icon: Users, roles: ['volunteer', 'admin'] },
  { path: '/map', label: 'Map', icon: Map, roles: ['volunteer', 'admin'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['volunteer', 'admin'] },
  { path: '/admin', label: 'Dashboard', icon: BarChart3, roles: ['admin'] },
  { path: '/admin/tasks', label: 'Manage Tasks', icon: FileText, roles: ['admin'] },
  { path: '/admin/volunteers', label: 'Volunteers', icon: Users, roles: ['admin'] },
  { path: '/admin/import', label: 'Import', icon: Upload, roles: ['admin'] },
]

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, logout } = useAuthStore()

  const currentRole = role || 'volunteer'
  const filteredNav = navItems.filter(item => item.roles.includes(currentRole))
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsApi.getAll()
        setNotifications(res.data || [])
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      }
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Minimal Topbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06]' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <MenuIcon size={20} />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D6CCC2] rounded-full flex items-center justify-center">
                <span className="font-bold text-sm text-[#0A0A0A]">V</span>
              </div>
              <span className="font-semibold text-white tracking-[0.1em] hidden sm:block">VolunteerIQ</span>
            </Link>
          </div>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="SEARCH..."
                className="w-full h-9 pl-9 pr-4 bg-white/[0.03] border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D6CCC2]/50 uppercase tracking-wider"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/tasks/create" className="hidden sm:flex">
              <button className="p-2 bg-[#D6CCC2] text-[#0A0A0A] rounded-lg hover:bg-[#E3D5CA] transition-colors">
                <Plus size={18} />
              </button>
            </Link>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell size={18} className="text-white/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D6CCC2] rounded-full"></span>
            </button>
            <Link to="/profile" className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <Avatar name={user?.displayName || 'User'} size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-[56px] bottom-0 w-16 lg:w-56 bg-[#0A0A0A] border-r border-white/[0.06]
        transition-all duration-300 z-40 flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Toggle */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-3 hover:bg-white/5 justify-end"
        >
          <ChevronLeft size={16} className={`text-white/30 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* Nav Items */}
        <nav className="flex-1 px-2 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const showBadge = item.path === '/notifications' && unreadCount > 0
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-white/[0.06] text-[#D6CCC2]' 
                    : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={18} />
                <span className={`text-sm tracking-wide ${sidebarCollapsed ? 'hidden lg:block' : 'block'} whitespace-nowrap`}>
                  {item.label}
                </span>
                {showBadge && (
                  <span className="bg-[#D6CCC2] text-[#0A0A0A] text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-white/[0.06] space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <Settings size={18} />
            <span className={`text-sm tracking-wide ${sidebarCollapsed ? 'hidden lg:block' : 'block'}`}>
              Settings
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors"
          >
            <LogOut size={18} />
            <span className={`text-sm tracking-wide ${sidebarCollapsed ? 'hidden lg:block' : 'block'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`
        pt-[56px] min-h-screen transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'}
      `}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}