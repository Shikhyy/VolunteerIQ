import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Users, Map, BarChart3, FileText, Upload, 
  Settings, LogOut, Menu, X, Search, Bell, Plus, ChevronLeft, Menu as MenuIcon, TrendingUp, HelpCircle
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useTaskStore } from '../../store/taskStore'
import { useVolunteerStore } from '../../store/volunteerStore'
import { notifications as notificationsApi } from '../../api/client'
import Avatar from '../ui/Avatar'
import AnimatedLogo from '../ui/AnimatedLogo'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home, roles: ['volunteer', 'admin'] },
  { path: '/tasks', label: 'Tasks', icon: Users, roles: ['volunteer', 'admin'] },
  { path: '/stats', label: 'My Stats', icon: TrendingUp, roles: ['volunteer', 'admin'] },
  { path: '/map', label: 'Map', icon: Map, roles: ['volunteer', 'admin'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['volunteer', 'admin'] },
  { path: '/admin', label: 'Dashboard', icon: BarChart3, roles: ['admin'] },
  { path: '/admin/tasks', label: 'Manage Tasks', icon: FileText, roles: ['admin'] },
  { path: '/admin/volunteers', label: 'Volunteers', icon: Users, roles: ['admin'] },
  { path: '/admin/import', label: 'Import', icon: Upload, roles: ['admin'] },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
]

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, logout } = useAuthStore()
  const { fetchTasks } = useTaskStore()
  const { fetchVolunteers, fetchProfile } = useVolunteerStore()

  const currentRole = role || 'volunteer'
  const filteredNav = navItems.filter(item => item.roles.includes(currentRole))
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const refreshData = async () => {
      try {
        const res = await notificationsApi.getAll()
        setNotifications(res.data || [])
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      }
      fetchTasks()
      fetchVolunteers()
      fetchProfile()
    }

    refreshData()
    const interval = setInterval(refreshData, 30000)

    return () => clearInterval(interval)
  }, [fetchTasks, fetchVolunteers, fetchProfile])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/tasks?search=${encodeURIComponent(searchQuery)}`)
    setShowSearch(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden page-enter">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D6CCC2]/10 blur-3xl float-slow" />
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl float-slower" />
      {/* Minimal Topbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.35)]' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg transition-colors"
            >
              {mobileOpen ? <X size={20} className="text-white" /> : <MenuIcon size={20} className="text-white" />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <AnimatedLogo size="sm" />
            </Link>
          </div>

          {/* Search Button - Improved */}
          <button 
            onClick={() => setShowSearch(true)} 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg transition-colors"
          >
            <Search size={16} className="text-white/50" />
            <span className="text-sm text-white/40 hidden lg:block">Search...</span>
            <kbd className="hidden lg:flex items-center px-1.5 py-0.5 text-xs text-white/30 bg-white/[0.04] rounded">⌘K</kbd>
          </button>

          <div className="flex items-center gap-2">
            <Link to="/tasks/create" className="hidden sm:flex">
              <button className="p-2 bg-[#D6CCC2] text-[#0A0A0A] rounded-lg hover:bg-[#E3D5CA] transition-colors">
                <Plus size={18} />
              </button>
            </Link>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative shine">
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
        fixed left-0 top-[56px] bottom-0 w-16 lg:w-56 surface-panel
        transition-all duration-300 z-40 flex flex-col backdrop-blur-xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Toggle - Improved */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex items-center justify-between px-3 py-3 hover:bg-white/[0.06] transition-colors border-b border-white/[0.06]"
        >
          <span className={`text-xs font-medium text-white/40 uppercase tracking-wider ${sidebarCollapsed ? 'hidden' : ''}`}>Menu</span>
          <ChevronLeft size={18} className={`text-white/50 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
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
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-[#D6CCC2]/10 text-[#D6CCC2] border border-[#D6CCC2]/20 shadow-[0_8px_24px_rgba(0,0,0,0.2)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={18} />
                <span className={`text-sm font-medium tracking-wide ${sidebarCollapsed ? 'hidden lg:block' : 'block'} whitespace-nowrap`}>
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
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              location.pathname === '/settings'
                  ? 'bg-white/[0.08] text-[#D6CCC2]'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Settings size={18} />
            <span className={`text-sm tracking-wide ${sidebarCollapsed ? 'hidden lg:block' : 'block'}`}>
              Settings
            </span>
          </Link>
          <Link
            to="/help"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              location.pathname === '/help'
                  ? 'bg-white/[0.08] text-[#D6CCC2]'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HelpCircle size={18} />
            <span className={`text-sm tracking-wide ${sidebarCollapsed ? 'hidden lg:block' : 'block'}`}>
              Help
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
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
        pt-[56px] min-h-screen transition-all duration-300 relative
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'}
      `}>
        <div className="p-4 sm:p-6 lg:p-8 relative z-10">
          {children}
        </div>
      </main>

      {/* Search Modal - Improved with better contrast */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-20 z-50 backdrop-blur-sm" onClick={() => setShowSearch(false)}>
          <div className="bg-[#0A0A0A] rounded-2xl p-6 w-full max-w-xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search tasks, volunteers, or locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D6CCC2]/50 focus:bg-white/[0.06] text-lg"
                  autoFocus
                />
              </div>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-white/40">Press <kbd className="px-1.5 py-0.5 bg-white/[0.08] rounded text-white/60">Enter</kbd> to search</p>
              <button onClick={() => setShowSearch(false)} className="text-sm text-white/50 hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}