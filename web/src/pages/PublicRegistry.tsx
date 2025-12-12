import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, Check, Star, Gift, ArrowRight } from "lucide-react"

interface RegistryItem {
    id: string
    name: string
    price: number
    image_url: string
    original_url: string
    store_name: string
    category: string
    quantity: number
    quantity_received: number
    is_most_wanted: boolean
}

interface Registry {
    id: string
    slug: string
    title: string | null
    description: string | null
    owner_id: string
    is_public: boolean
    owner?: {
        first_name: string
        last_name: string
    }
}

export function PublicRegistry() {
    const { slug } = useParams<{ slug: string }>()
    const [registry, setRegistry] = useState<Registry | null>(null)
    const [items, setItems] = useState<RegistryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (slug) {
            fetchRegistry()
        }
    }, [slug])

    const fetchRegistry = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch registry by slug
            const { data: registryData, error: registryError } = await supabase
                .from("registries")
                .select(`
                    *,
                    owner:profiles!owner_id(first_name, last_name)
                `)
                .eq("slug", slug)
                .eq("is_public", true)
                .single()

            if (registryError || !registryData) {
                setError("הרשימה לא נמצאה או שהיא פרטית")
                return
            }

            setRegistry(registryData)

            // Fetch items for this registry
            const { data: itemsData, error: itemsError } = await supabase
                .from("items")
                .select("*")
                .eq("registry_id", registryData.id)
                .eq("is_private", false)
                .order("is_most_wanted", { ascending: false })
                .order("created_at", { ascending: false })

            if (itemsError) {
                console.error("Error fetching items:", itemsError)
            } else {
                setItems(itemsData || [])
            }
        } catch (err) {
            console.error("Error:", err)
            setError("אירעה שגיאה בטעינת הרשימה")
        } finally {
            setLoading(false)
        }
    }

    const getOwnerName = () => {
        if (registry?.owner) {
            return `${registry.owner.first_name} ${registry.owner.last_name}`.trim()
        }
        return "משתמש"
    }

    const getPurchasedCount = () => {
        return items.filter(item => item.quantity_received >= item.quantity).length
    }

    const progressPercent = items.length > 0
        ? (getPurchasedCount() / items.length) * 100
        : 0

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">טוען רשימה...</p>
                </div>
            </div>
        )
    }

    if (error || !registry) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">הרשימה לא נמצאה</h1>
                    <p className="text-muted-foreground mb-6">
                        {error || "הרשימה שחיפשת לא קיימת או שהיא פרטית."}
                    </p>
                    <Link to="/">
                        <Button className="bg-primary text-primary-foreground">
                            חזור לדף הבית
                            <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-gradient-to-br from-primary/90 to-primary text-white">
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        {registry.title || `הרשימה של ${getOwnerName()}`}
                    </h1>
                    {registry.description && (
                        <p className="text-white/80 mb-4">{registry.description}</p>
                    )}

                    {/* Progress */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto mt-6">
                        <div className="flex items-center justify-between mb-2 text-sm">
                            <span>{getPurchasedCount()}/{items.length} פריטים נרכשו</span>
                            <span>התקדמות</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500 rounded-full"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Items Grid */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {items.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">הרשימה ריקה</h2>
                        <p className="text-muted-foreground">עדיין לא נוספו פריטים לרשימה זו.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {items.map((item) => {
                            const isPurchased = item.quantity_received >= item.quantity

                            return (
                                <Card
                                    key={item.id}
                                    className={`p-4 transition-all ${isPurchased ? "opacity-60" : "hover:shadow-lg"}`}
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Gift className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 text-right">
                                            <div className="flex items-start gap-2 justify-end mb-1">
                                                {item.is_most_wanted && (
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                                )}
                                                <h3 className={`font-semibold ${isPurchased ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                                    {item.name}
                                                </h3>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-2">
                                                {item.store_name}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {isPurchased ? (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                            <Check className="w-3 h-3" />
                                                            נרכש
                                                        </span>
                                                    ) : (
                                                        <a
                                                            href={item.original_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            לרכישה
                                                        </a>
                                                    )}
                                                </div>
                                                <span className="font-bold text-primary">
                                                    ₪{item.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                    נוצר באמצעות BabyList
                </p>
                <Link to="/" className="text-primary hover:underline text-sm">
                    צרו רשימה משלכם
                </Link>
            </footer>
        </div>
    )
}
