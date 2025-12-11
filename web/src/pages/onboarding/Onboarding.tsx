import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export function Onboarding() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          due_date: dueDate || null,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (error) throw error

      // Create registry
      const slug = `${firstName.toLowerCase()}-registry-${Date.now()}`
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
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            בואו נכיר!
          </h1>
          <p className="text-gray-600">עוד כמה פרטים ואתם מוכנים להתחיל</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">שם פרטי</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="מה שמך?"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">שם משפחה</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="שם המשפחה"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!firstName || !lastName}
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              המשך
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">תאריך לידה משוער</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="text-sm text-gray-500 mt-2">אופציונלי - אפשר לדלג</p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                חזור
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'שומר...' : 'סיום'}
              </button>
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              דלג
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
