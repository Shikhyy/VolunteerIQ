import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect, lazy, Suspense } from 'react'
import { ToastProvider } from './contexts/ToastContext'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './index.css'

// Layout
import { Layout } from './components/layout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OnboardingPage from './pages/OnboardingPage'
import VolunteerDashboard from './pages/volunteers/VolunteerDashboard'
import TaskBrowser from './pages/tasks/TaskBrowser'
import TaskCreate from './pages/tasks/TaskCreate'
import TaskDetail from './pages/tasks/TaskDetail'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import Notifications from './pages/notifications/Notifications'

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminTaskManager = lazy(() => import('./pages/admin/AdminTaskManager'))
const AdminVolunteerTable = lazy(() => import('./pages/admin/AdminVolunteerTable'))
const CSVImportPage = lazy(() => import('./pages/admin/CSVImportPage'))
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'))
const MapView = lazy(() => import('./pages/map/MapView'))
const VolunteerStats = lazy(() => import('./pages/volunteers/VolunteerStats'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin w-8 h-8 border-2 border-[#D6CCC2] border-t-transparent rounded-full" />
  </div>
)

export default function App() {
  const { user, loading, initAuth } = useAuthStore()

  useKeyboardShortcuts()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#D6CCC2] rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-[#1A1A1A]">V</span>
          </div>
        </div>
      </div>
    )
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />

        {/* Protected routes with Layout */}
        <Route path="/onboarding" element={
          isAuthenticated ? <Layout><OnboardingPage /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? <Layout><VolunteerDashboard /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/tasks" element={
          isAuthenticated ? <Layout><TaskBrowser /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/tasks/create" element={
          isAuthenticated ? <Layout><TaskCreate /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/tasks/:id" element={
          isAuthenticated ? <Layout><TaskDetail /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/map" element={
          isAuthenticated ? <Layout><Suspense fallback={<PageLoader />}><MapView /></Suspense></Layout> : <Navigate to="/login" />
        } />
        <Route path="/admin" element={
          isAuthenticated && isAdmin ? <Layout><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></Layout> : 
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/admin/tasks" element={
          isAuthenticated && isAdmin ? <Layout><Suspense fallback={<PageLoader />}><AdminTaskManager /></Suspense></Layout> : 
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/admin/volunteers" element={
          isAuthenticated && isAdmin ? <Layout><Suspense fallback={<PageLoader />}><AdminVolunteerTable /></Suspense></Layout> : 
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/admin/import" element={
          isAuthenticated && isAdmin ? <Layout><Suspense fallback={<PageLoader />}><CSVImportPage /></Suspense></Layout> : 
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/admin/analytics" element={
          isAuthenticated && isAdmin ? <Layout><Suspense fallback={<PageLoader />}><AnalyticsDashboard /></Suspense></Layout> : 
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          isAuthenticated ? <Layout><ProfilePage /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/notifications" element={
          isAuthenticated ? <Layout><Notifications /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
          isAuthenticated ? <Layout><SettingsPage /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/stats" element={
          isAuthenticated ? <Layout><Suspense fallback={<PageLoader />}><VolunteerStats /></Suspense></Layout> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  )
}