import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff, User, Gift } from 'lucide-react'
import { Button, Input, Card } from '../../components/ui'
import { signUpWithEmail, signInWithGoogle } from '../../lib/supabase'

export function SignUp() {
  const { t } = useTranslation()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 8) {
      setError(t('auth.errors.weakPassword'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'))
      return
    }

    setIsLoading(true)

    const { error } = await signUpWithEmail(email, password, {
      first_name: firstName,
      last_name: lastName,
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setError(t('auth.errors.emailInUse'))
      } else {
        setError(t('auth.errors.generic'))
      }
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsGoogleLoading(true)

    const { error } = await signInWithGoogle()

    if (error) {
      setError(t('auth.errors.generic'))
      setIsGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white to-[var(--color-cream)]">
        <Card variant="elevated" padding="lg" className="w-full max-w-md text-center shadow-xl shadow-[var(--color-primary)]/10">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/70 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
            {t('auth.emailSent')}
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            We sent a confirmation link to <strong className="text-[var(--color-primary)]">{email}</strong>
          </p>
          <Link to="/auth/signin">
            <Button variant="outline" className="mx-auto">{t('auth.signIn')}</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-pink-dark)] relative">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-[var(--color-accent)]/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">{t('app.name')}</h1>
          <p className="text-xl text-white/80 text-center max-w-md mb-12">
            {t('app.tagline')}
          </p>

          {/* Features */}
          <div className="space-y-6 w-full max-w-md">
            {[
              { icon: '✅', text: t('home.features.items.noDuplicates') },
              { icon: '🔗', text: t('home.features.items.sharing') },
              { icon: '🎁', text: t('home.features.items.surprises') },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4">
                <div className="text-3xl">{feature.icon}</div>
                <p className="text-white/90 font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-white to-[var(--color-cream)] overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-3 text-2xl font-bold text-[var(--color-primary)]">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <span>{t('app.name')}</span>
            </Link>
          </div>

          <Card variant="elevated" padding="lg" className="animate-slideUp shadow-xl shadow-[var(--color-primary)]/10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                {t('auth.createAccount')}
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                {t('auth.signUpSubtitle')}
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              fullWidth
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              className="mb-6 h-12 border-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('auth.googleSignIn')}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border-light)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[var(--color-text-muted)]">
                  {t('common.or')}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('auth.firstName')}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  icon={<User className="w-5 h-5" />}
                  required
                  autoComplete="given-name"
                />

                <Input
                  label={t('auth.lastName')}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  autoComplete="family-name"
                />
              </div>

              <Input
                label={t('auth.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                required
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  hint="At least 8 characters"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-[42px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Input
                label={t('auth.confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                className="h-12 shadow-lg shadow-[var(--color-primary)]/25"
              >
                {t('auth.createAccount')}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="mt-8 text-center text-[var(--color-text-secondary)]">
              {t('auth.haveAccount')}{' '}
              <Link
                to="/auth/signin"
                className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </Card>

          {/* Back to home */}
          <p className="mt-6 text-center">
            <Link to="/" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              ← {t('common.back')} {t('navigation.home')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
