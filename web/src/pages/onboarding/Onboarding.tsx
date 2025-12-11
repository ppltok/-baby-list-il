import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { ChevronLeft, ChevronRight, Calendar, Baby, Heart } from 'lucide-react'

type OnboardingStep = 1 | 2 | 3
type UserFeeling = 'excited' | 'overwhelmed' | 'exploring'

export function Onboarding() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const isRTL = i18n.language === 'he'

  const [step, setStep] = useState<OnboardingStep>(1)
  const [dueDate, setDueDate] = useState('')
  const [notSureDueDate, setNotSureDueDate] = useState(false)
  const [isFirstTimeParent, setIsFirstTimeParent] = useState<boolean | null>(null)
  const [feeling, setFeeling] = useState<UserFeeling | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as OnboardingStep)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep)
    }
  }

  const handleComplete = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      // Update profile with onboarding data
      const { error } = await supabase
        .from('profiles')
        .update({
          due_date: notSureDueDate ? null : dueDate || null,
          is_first_time_parent: isFirstTimeParent ?? true,
          feeling: feeling,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (error) throw error

      // Create registry for user
      const slug = await generateSlug()
      const { error: registryError } = await supabase
        .from('registries')
        .insert({
          owner_id: user.id,
          slug,
        })

      if (registryError) throw registryError

      await refreshProfile()
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user!.id)
      .single()

    const firstName = (profile as { first_name?: string })?.first_name || 'baby'

    // Try to use the RPC function, fall back to simple slug generation
    try {
      const { data } = await supabase.rpc('generate_registry_slug', {
        first_name: firstName,
      })
      if (data) return data as string
    } catch {
      // RPC might not be available yet
    }

    return `${firstName.toLowerCase()}-registry-${Date.now()}`
  }

  const BackIcon = isRTL ? ChevronRight : ChevronLeft
  const NextIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-beige-light)] to-[var(--color-cream)]">
      <div className="w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                s === step
                  ? 'bg-[var(--color-chestnut)] w-8'
                  : s < step
                  ? 'bg-[var(--color-sage)]'
                  : 'bg-[var(--color-beige)]'
              }`}
            />
          ))}
        </div>

        <Card variant="elevated" padding="lg" className="animate-slideUp">
          {/* Step 1: Due Date */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-cream)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-[var(--color-chestnut)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {t('onboarding.question1.title')}
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                {t('onboarding.question1.subtitle')}
              </p>

              <div className="space-y-4">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value)
                    setNotSureDueDate(false)
                  }}
                  disabled={notSureDueDate}
                  className="w-full h-12 px-4 bg-[var(--color-cream)] border border-[var(--color-border-light)] rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-chestnut)] disabled:opacity-50"
                />

                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notSureDueDate}
                    onChange={(e) => {
                      setNotSureDueDate(e.target.checked)
                      if (e.target.checked) setDueDate('')
                    }}
                    className="w-5 h-5 rounded border-[var(--color-border-light)] text-[var(--color-chestnut)] focus:ring-[var(--color-chestnut)]"
                  />
                  <span className="text-[var(--color-text-secondary)]">
                    {t('onboarding.question1.notSure')}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: First Time Parent */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-cream)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Baby className="w-8 h-8 text-[var(--color-chestnut)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {t('onboarding.question2.title')}
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                {t('onboarding.question2.subtitle')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsFirstTimeParent(true)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isFirstTimeParent === true
                      ? 'border-[var(--color-chestnut)] bg-[var(--color-chestnut)] text-white'
                      : 'border-[var(--color-border-light)] hover:border-[var(--color-chestnut)]'
                  }`}
                >
                  <div className="text-4xl mb-2">👶</div>
                  <div className="font-semibold">{t('common.yes')}</div>
                </button>
                <button
                  onClick={() => setIsFirstTimeParent(false)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isFirstTimeParent === false
                      ? 'border-[var(--color-chestnut)] bg-[var(--color-chestnut)] text-white'
                      : 'border-[var(--color-border-light)] hover:border-[var(--color-chestnut)]'
                  }`}
                >
                  <div className="text-4xl mb-2">👨‍👩‍👧</div>
                  <div className="font-semibold">{t('common.no')}</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Feeling */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-cream)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[var(--color-chestnut)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {t('onboarding.question3.title')}
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8">
                {t('onboarding.question3.subtitle')}
              </p>

              <div className="space-y-3">
                {[
                  { value: 'excited' as const, emoji: '🎉', label: t('onboarding.question3.excited') },
                  { value: 'overwhelmed' as const, emoji: '😅', label: t('onboarding.question3.overwhelmed') },
                  { value: 'exploring' as const, emoji: '🔍', label: t('onboarding.question3.exploring') },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFeeling(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      feeling === option.value
                        ? 'border-[var(--color-chestnut)] bg-[var(--color-chestnut)] text-white'
                        : 'border-[var(--color-border-light)] hover:border-[var(--color-chestnut)]'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border-light)]">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} icon={<BackIcon className="w-5 h-5" />}>
                {t('common.back')}
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                icon={<NextIcon className="w-5 h-5" />}
                className="flex-row-reverse"
              >
                {t('common.continue')}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                isLoading={isLoading}
                disabled={feeling === null}
              >
                {t('onboarding.complete')}
              </Button>
            )}
          </div>
        </Card>

        {/* Skip Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleComplete}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          >
            {t('common.skip')}
          </button>
        </div>
      </div>
    </div>
  )
}
