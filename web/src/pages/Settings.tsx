import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Save, User, Link as LinkIcon, Check, AlertCircle } from "lucide-react"

interface Registry {
    id: string
    slug: string
    title: string | null
    is_public: boolean
}

export function Settings() {
    const { user, profile, refreshProfile } = useAuth()
    const navigate = useNavigate()

    // Profile state
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dueDate, setDueDate] = useState("")

    // Registry state
    const [registry, setRegistry] = useState<Registry | null>(null)
    const [registrySlug, setRegistrySlug] = useState("")
    const [registryTitle, setRegistryTitle] = useState("")
    const [isPublic, setIsPublic] = useState(true)

    // UI state
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [slugError, setSlugError] = useState<string | null>(null)

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || "")
            setLastName(profile.last_name || "")
            setDueDate(profile.due_date || "")
        }
        if (user) {
            fetchRegistry()
        }
    }, [profile, user])

    const fetchRegistry = async () => {
        try {
            const { data, error } = await supabase
                .from("registries")
                .select("*")
                .eq("owner_id", user?.id)
                .single()

            if (error && error.code !== "PGRST116") {
                console.error("Error fetching registry:", error)
            }

            if (data) {
                setRegistry(data)
                setRegistrySlug(data.slug || "")
                setRegistryTitle(data.title || "")
                setIsPublic(data.is_public)
            }
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const validateSlug = (slug: string): boolean => {
        // Slug should be lowercase, alphanumeric with dashes only
        const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
        if (!slug) {
            setSlugError("נדרש שם משתמש")
            return false
        }
        if (slug.length < 3) {
            setSlugError("שם המשתמש חייב להכיל לפחות 3 תווים")
            return false
        }
        if (slug.length > 50) {
            setSlugError("שם המשתמש ארוך מדי")
            return false
        }
        if (!slugRegex.test(slug)) {
            setSlugError("שם המשתמש יכול להכיל רק אותיות באנגלית קטנות, מספרים ומקפים")
            return false
        }
        setSlugError(null)
        return true
    }

    const handleSlugChange = (value: string) => {
        // Convert to lowercase and replace spaces/invalid chars with dashes
        const cleanSlug = value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
        setRegistrySlug(cleanSlug)
        if (cleanSlug) {
            validateSlug(cleanSlug)
        } else {
            setSlugError(null)
        }
    }

    const checkSlugAvailability = async (slug: string): Promise<boolean> => {
        if (registry && registry.slug === slug) {
            return true // Same as current slug
        }

        const { data, error } = await supabase
            .from("registries")
            .select("id")
            .eq("slug", slug)
            .single()

        if (error && error.code === "PGRST116") {
            return true // Not found, available
        }

        return !data
    }

    const handleSave = async () => {
        if (!user) return

        setError(null)
        setSuccess(false)

        // Validate slug
        if (registrySlug && !validateSlug(registrySlug)) {
            return
        }

        // Check slug availability
        if (registrySlug) {
            const isAvailable = await checkSlugAvailability(registrySlug)
            if (!isAvailable) {
                setSlugError("שם המשתמש כבר תפוס")
                return
            }
        }

        setSaving(true)

        try {
            // Update profile
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    due_date: dueDate || null,
                })
                .eq("id", user.id)

            if (profileError) throw profileError

            // Update or create registry
            if (registry) {
                const { error: registryError } = await supabase
                    .from("registries")
                    .update({
                        slug: registrySlug,
                        title: registryTitle || null,
                        is_public: isPublic,
                    })
                    .eq("id", registry.id)

                if (registryError) throw registryError
            } else if (registrySlug) {
                // Create new registry
                const { error: createError } = await supabase
                    .from("registries")
                    .insert({
                        owner_id: user.id,
                        slug: registrySlug,
                        title: registryTitle || null,
                        is_public: isPublic,
                    })

                if (createError) throw createError
            }

            await refreshProfile()
            await fetchRegistry()
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: any) {
            console.error("Error saving:", err)
            if (err.code === "23505") {
                setSlugError("שם המשתמש כבר תפוס")
            } else {
                setError(err.message || "אירעה שגיאה בשמירת ההגדרות")
            }
        } finally {
            setSaving(false)
        }
    }

    const getShareUrl = () => {
        if (registrySlug) {
            return `${window.location.origin}/registry/${registrySlug}`
        }
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowRight className="w-5 h-5" />
                        חזרה לרשימה
                    </Link>
                    <h1 className="text-xl font-bold text-foreground">הגדרות</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        ההגדרות נשמרו בהצלחה
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Profile Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">פרטים אישיים</h2>
                            <p className="text-sm text-muted-foreground">עדכנו את הפרטים שלכם</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">שם פרטי</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">שם משפחה</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">תאריך לידה משוער</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </Card>

                {/* Registry Settings */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">הגדרות הרשימה</h2>
                            <p className="text-sm text-muted-foreground">התאימו את כתובת השיתוף שלכם</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                שם משתמש (לכתובת השיתוף)
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground" dir="ltr">
                                    {window.location.origin}/registry/
                                </span>
                                <input
                                    type="text"
                                    value={registrySlug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    placeholder="your-name"
                                    className={`flex-1 px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        slugError
                                            ? "border-destructive focus:ring-destructive/30"
                                            : "border-gray-300 focus:border-primary focus:ring-primary/30"
                                    }`}
                                    dir="ltr"
                                />
                            </div>
                            {slugError && (
                                <p className="mt-1 text-xs text-destructive">{slugError}</p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                זו הכתובת שתשתפו עם המשפחה והחברים
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                כותרת הרשימה (אופציונלי)
                            </label>
                            <input
                                type="text"
                                value={registryTitle}
                                onChange={(e) => setRegistryTitle(e.target.value)}
                                placeholder={`הרשימה של ${firstName || "התינוק"}`}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                            />
                        </div>

                        <div>
                            <label className="flex items-center justify-between p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors">
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors relative ${
                                        isPublic ? "bg-primary" : "bg-border"
                                    }`}
                                    onClick={() => setIsPublic(!isPublic)}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                            isPublic ? "translate-x-1" : "translate-x-6"
                                        }`}
                                    />
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-foreground">רשימה ציבורית</p>
                                    <p className="text-xs text-muted-foreground">
                                        אפשרו לאחרים לצפות ברשימה שלכם דרך הקישור
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Share URL Preview */}
                        {getShareUrl() && (
                            <div className="bg-muted/50 rounded-xl p-4">
                                <p className="text-sm text-muted-foreground mb-2">הקישור לרשימה שלכם:</p>
                                <p className="text-sm font-mono bg-white px-3 py-2 rounded-lg border border-border break-all" dir="ltr">
                                    {getShareUrl()}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={saving || !!slugError}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {saving ? (
                        "שומר..."
                    ) : (
                        <>
                            <Save className="w-4 h-4 ml-2" />
                            שמור שינויים
                        </>
                    )}
                </Button>
            </main>
        </div>
    )
}
