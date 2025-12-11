import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

/**
 * Temporary debugging component to help troubleshoot authentication
 * Remove this from production!
 */
export function DebugAuth() {
  const { user, profile, isAuthenticated, isLoading } = useAuth()

  // Only show in development
  if (import.meta.env.PROD) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#00ff00',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '11px',
        maxWidth: '400px',
        maxHeight: '300px',
        overflow: 'auto',
        zIndex: 9999,
        border: '2px solid #00ff00',
      }}
    >
      <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#fff' }}>
        🐛 Auth Debug Info
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>Environment:</strong>
      </div>
      <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
        <div>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL?.slice(0, 30)}...</div>
        <div>VITE_APP_URL: {import.meta.env.VITE_APP_URL}</div>
        <div>Mode: {import.meta.env.MODE}</div>
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>Auth State:</strong>
      </div>
      <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
        <div>isLoading: {isLoading ? '✅' : '❌'}</div>
        <div>isAuthenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User ID: {user?.id?.slice(0, 8) || 'null'}</div>
        <div>Email: {user?.email || 'null'}</div>
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>Profile:</strong>
      </div>
      <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
        <div>Name: {profile?.first_name || 'null'} {profile?.last_name || ''}</div>
        <div>Onboarding: {profile?.onboarding_completed ? '✅' : '❌'}</div>
      </div>

      <button
        onClick={async () => {
          const { data, error } = await supabase.auth.getSession()
          console.log('📍 Current Session:', { data, error })
        }}
        style={{
          background: '#00ff00',
          color: '#000',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '10px',
          marginTop: '5px',
        }}
      >
        Log Session to Console
      </button>
    </div>
  )
}
