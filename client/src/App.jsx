import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
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
import MapView from './pages/map/MapView'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTaskManager from './pages/admin/AdminTaskManager'
import AdminVolunteerTable from './pages/admin/AdminVolunteerTable'
import CSVImportPage from './pages/admin/CSVImportPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const { user, loading, initAuth } = useAuthStore()

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

  return (
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
        <Route path="/map" element={
          isAuthenticated ? <Layout><MapView /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/admin" element={
          isAuthenticated ? <Layout><AdminDashboard /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/admin/tasks" element={
          isAuthenticated ? <Layout><AdminTaskManager /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/admin/volunteers" element={
          isAuthenticated ? <Layout><AdminVolunteerTable /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/admin/import" element={
          isAuthenticated ? <Layout><CSVImportPage /></Layout> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={
          isAuthenticated ? <Layout><ProfilePage /></Layout> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}