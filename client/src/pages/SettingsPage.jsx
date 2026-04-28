import { useState } from 'react'
import { Card, Button } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-all duration-200
          ${checked ? 'bg-[#D6CCC2]' : 'bg-white/10'}
        `}
      >
        <span
          className={`
            absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </label>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
      <div>
        <p className="text-sm text-white/90">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: true,
    showProfile: true,
    showActivity: true,
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    console.log('Delete account')
    setShowDeleteModal(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-white/50 mt-1">Manage your account preferences</p>
      </div>

      {/* Account Section */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Account</h2>
        <div className="space-y-4">
          <SettingRow label="Email" description={user?.email || 'No email on file'} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="sm">Change Password</Button>
            <Button variant="secondary" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Preferences</h2>
        <div className="space-y-1">
          <SettingRow label="Email Notifications" description="Receive task updates via email">
            <Toggle
              checked={preferences.emailNotifications}
              onChange={(v) => setPreferences(p => ({ ...p, emailNotifications: v }))}
            />
          </SettingRow>
          <SettingRow label="Push Notifications" description="Receive push notifications on your device">
            <Toggle
              checked={preferences.pushNotifications}
              onChange={(v) => setPreferences(p => ({ ...p, pushNotifications: v }))}
            />
          </SettingRow>
          <SettingRow label="Dark Mode" description="Use dark theme throughout the app">
            <Toggle
              checked={preferences.darkMode}
              onChange={(v) => setPreferences(p => ({ ...p, darkMode: v }))}
            />
          </SettingRow>
        </div>
      </Card>

      {/* Privacy Section */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Privacy</h2>
        <div className="space-y-1">
          <SettingRow label="Show Profile Publicly" description="Allow others to view your profile">
            <Toggle
              checked={preferences.showProfile}
              onChange={(v) => setPreferences(p => ({ ...p, showProfile: v }))}
            />
          </SettingRow>
          <SettingRow label="Show Activity" description="Display your volunteer activity publicly">
            <Toggle
              checked={preferences.showActivity}
              onChange={(v) => setPreferences(p => ({ ...p, showActivity: v }))}
            />
          </SettingRow>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <h2 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h2>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <Card className="max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-medium text-white mb-2">Delete Account?</h3>
            <p className="text-sm text-white/60 mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}