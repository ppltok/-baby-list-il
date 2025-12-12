import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function SignUp() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        navigate("/onboarding")
      }
    } catch (err: any) {
      setError(err.message || "שגיאה ביצירת חשבון")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError("")
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || "שגיאה בהרשמה עם Google")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl shadow-xl p-8 w-full max-w-md text-right">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl mb-4">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">יצירת חשבון</h1>
          <p className="text-muted-foreground mt-2">התחילו את המסע שלכם עם BabyList</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">שם פרטי</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">שם משפחה</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              required
              minLength={6}
              dir="ltr"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            {loading ? "יוצר חשבון..." : "צור חשבון"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-4 bg-card text-muted-foreground font-medium">או המשך עם</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-8">
          כבר יש לך חשבון?{" "}
          <Link to="/auth/signin" className="text-primary font-semibold hover:underline">
            התחבר
          </Link>
        </p>

        <Link to="/" className="block text-center text-xs text-muted-foreground mt-4 hover:underline">
          חזור לדף הבית
        </Link>
      </div>
    </div>
  )
}
