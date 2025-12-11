import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Layout() {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'he'

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--color-cream)]">
      <Outlet />
    </div>
  )
}
