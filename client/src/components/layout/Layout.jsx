import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Users, Map, BarChart3, FileText, Upload, 
  Settings, LogOut, Menu, X, Search, Bell, ChevronLeft
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../ui/Avatar'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home, roles: ['volunteer', 'admin'] },
  { path: '/tasks', label: 'Tasks', icon: Users, roles: ['volunteer', 'admin'] },
  { path: '/map', label: 'Map', icon: Map, roles: ['volunteer', 'admin'] },
  { path: '/admin', label: 'Dashboard', icon: BarChart3, roles: ['admin'] },
  { path: '/admin/tasks', label: 'Manage Tasks', icon: FileText, roles: ['admin'] },
  { path: '/admin/volunteers', label: 'Volunteers', icon: Users, roles: ['admin'] },
  { path: '/admin/import', label: 'Import', icon: Upload, roles: ['admin'] },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const role = 'volunteer' 

  const filteredNav = navItems.filter(item => item.roles.includes(role))

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#E5E5E5] z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 hover:bg-[#EDEDE9] rounded-lg"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D6CCC2] rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm text-[#1A1A1A]">V</span>
            </div>
            <span className="font-semibold text-[#1A1A1A] hidden sm:block">VolunteerIQ</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search tasks, volunteers..."
              className="w-full h-9 pl-9 pr-4 bg-[#F5F5F5] border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D6CCC2]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#EDEDE9] rounded-lg relative">
            <Bell size={20} className="text-[#6B6B6B]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link to="/profile" className="flex items-center gap-2 p-1 hover:bg-[#EDEDE9] rounded-lg">
            <Avatar name={user?.displayName || user?.email || 'User'} size="sm" />
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-14 bottom-0 bg-white border-r border-[#E5E5E5] 
        transition-all duration-300 z-40
        ${sidebarOpen ? 'w-60' : 'w-16'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Toggle */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-3 hover:bg-[#EDEDE9] justify-end"
          >
            <ChevronLeft size={18} className={`text-[#6B6B6B] transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Nav */}
          <nav className="flex-1 px-2 space-y-1">
            {filteredNav.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-[#EDEDE9] text-[#1A1A1A] font-medium' 
                      : 'text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
                    }
                    ${!sidebarOpen ? 'justify-center' : ''}
                  `}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-2 border-t border-[#E5E5E5] space-y-1">
            <Link
              to="/profile"
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#6B6B6B] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
            >
              <LogOut size={20} />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={`
        pt-14 min-h-screen transition-all duration-300
        ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-16'}
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}