import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { Card, Button } from '../components/ui'
import { signOut } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Plus, Share2, Settings, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export function Dashboard() {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [linkCopied, setLinkCopied] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/signin')
  }

  // Calculate days until due date
  const getDaysUntilDue = () => {
    if (!profile?.due_date) return null
    const dueDate = new Date(profile.due_date)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysUntilDue = getDaysUntilDue()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/r/my-registry`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--color-border-light)] sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-chestnut)]">
            <span className="text-2xl">🍼</span>
            <span>{t('app.name')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Settings className="w-5 h-5" />}>
              {t('navigation.settings')}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} icon={<LogOut className="w-5 h-5" />}>
              {t('auth.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
            {t('dashboard.welcome', { name: profile?.first_name || 'there' })} 👋
          </h1>
          {daysUntilDue !== null && (
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('dashboard.dueIn', { days: daysUntilDue })} 🍼
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            variant="primary"
            fullWidth
            className="h-14 justify-start px-6"
            icon={<Plus className="w-5 h-5" />}
          >
            {t('registry.installExtension')}
          </Button>
          <Button
            variant="outline"
            fullWidth
            className="h-14 justify-start px-6"
            icon={<Share2 className="w-5 h-5" />}
            onClick={handleCopyLink}
          >
            {linkCopied ? t('registry.linkCopied') : t('registry.shareRegistry')}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            className="h-14 justify-start px-6"
            icon={<Settings className="w-5 h-5" />}
          >
            {t('registry.settings')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card variant="bordered" className="text-center py-6">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">0</div>
            <div className="text-sm text-[var(--color-text-muted)]">{t('dashboard.stats.totalItems')}</div>
          </Card>
          <Card variant="elevated" className="text-center py-6 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-sage-light)] text-white">
            <div className="text-4xl mb-3">🎉</div>
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm opacity-90">{t('dashboard.stats.purchased')}</div>
          </Card>
          <Card variant="bordered" className="text-center py-6">
            <div className="text-4xl mb-3">✨</div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">₪0</div>
            <div className="text-sm text-[var(--color-text-muted)]">{t('dashboard.stats.remaining')}</div>
          </Card>
        </div>

        {/* Empty State */}
        <Card variant="elevated" padding="lg" className="text-center mb-8">
          <div className="max-w-md mx-auto py-8">
            <div className="text-7xl mb-6">🎁</div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
              {t('registry.noItems')}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
              {t('registry.noItemsHint')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
                {t('registry.installExtension')}
              </Button>
              <Button variant="outline" size="lg" icon={<ExternalLink className="w-5 h-5" />}>
                {t('registry.addItem')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Share Link Card */}
        <Card variant="bordered" padding="md" className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                {t('registry.publicLink')}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {window.location.origin}/r/my-registry
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Copy className="w-4 h-4" />}
              onClick={handleCopyLink}
            >
              {linkCopied ? t('registry.linkCopied') : t('registry.copyLink')}
            </Button>
          </div>
        </Card>

        {/* Activity Feed */}
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('dashboard.activity')}
          </h2>
          <Card variant="bordered" className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-[var(--color-text-muted)] text-lg">{t('dashboard.noActivity')}</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
