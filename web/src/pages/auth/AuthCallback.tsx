import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Loader2 } from 'lucide-react'

export function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔄 AuthCallback: Starting...')

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('📍 Session data:', { session, error })

        if (error) {
          console.error('❌ Auth callback error:', error)
          navigate('/auth/signin', { replace: true })
          return
        }

        if (session) {
          console.log('✅ Session found! User ID:', session.user.id)
          console.log('📧 User email:', session.user.email)

          // Check if user has completed onboarding
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed, first_name, last_name')
            .eq('id', session.user.id)
            .single()

          console.log('📍 Profile query result:', { profile, profileError })

          if (profileError) {
            console.error('❌ Profile query error:', profileError)
            // Profile doesn't exist - this is expected for first-time Google sign-in
            // Redirect to onboarding to create profile
            console.log('➡️ Redirecting to onboarding (no profile found)')
            navigate('/onboarding', { replace: true })
            return
          }

          if (profile?.onboarding_completed) {
            console.log('➡️ Redirecting to dashboard (onboarding completed)')
            navigate('/dashboard', { replace: true })
          } else {
            console.log('➡️ Redirecting to onboarding (not completed)')
            navigate('/onboarding', { replace: true })
          }
        } else {
          console.log('❌ No session found, redirecting to sign-in')
          navigate('/auth/signin', { replace: true })
        }
      } catch (err) {
        console.error('💥 Unexpected error in AuthCallback:', err)
        navigate('/auth/signin', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
        <p className="text-[var(--color-text-secondary)]">Signing you in...</p>
      </div>
    </div>
  )
}
