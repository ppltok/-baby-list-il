import type { RegistryItem } from "@/types"
import { Card } from "@/components/ui/card"
import { Trash2, ExternalLink, Check, Home, UtensilsCrossed, Car, Baby, Shield, Bath, Gamepad2, Package, Star, Lock } from "lucide-react"

interface RegistryCategoriesProps {
    items: RegistryItem[]
    onTogglePurchased: (itemId: string) => void
    onDeleteItem: (itemId: string) => void
}

const CATEGORIES = [
    { id: "nursery", name: "חדר תינוק", icon: Home, color: "from-blue-500 to-blue-600" },
    { id: "feeding", name: "האכלה", icon: UtensilsCrossed, color: "from-green-500 to-green-600" },
    { id: "strollers", name: "עגלות", icon: Car, color: "from-purple-500 to-purple-600" },
    { id: "clothing", name: "ביגוד", icon: Baby, color: "from-pink-500 to-pink-600" },
    { id: "gear", name: "ציוד תינוק", icon: Package, color: "from-orange-500 to-orange-600" },
    { id: "health", name: "בריאות ובטיחות", icon: Shield, color: "from-red-500 to-red-600" },
    { id: "bath", name: "רחצה", icon: Bath, color: "from-cyan-500 to-cyan-600" },
    { id: "toys", name: "צעצועים", icon: Gamepad2, color: "from-yellow-500 to-yellow-600" },
]

export default function RegistryCategories({ items, onTogglePurchased, onDeleteItem }: RegistryCategoriesProps) {
    const itemsByCategory = CATEGORIES.map((category) => ({
        ...category,
        items: items.filter((item) => item.category === category.id),
    }))

    return (
        <div className="space-y-8 text-right">
            {/* Category Grid Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {itemsByCategory.map((category) => {
                    const categoryItems = category.items
                    const purchasedCount = categoryItems.filter((item) => item.purchased).length
                    const progressPercent = categoryItems.length > 0 ? (purchasedCount / categoryItems.length) * 100 : 0
                    const IconComponent = category.icon

                    return (
                        <Card
                            key={category.id}
                            className="p-4 bg-white hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3`}>
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-foreground mb-1">{category.name}</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                {purchasedCount}/{categoryItems.length} פריטים
                            </p>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                    className={`bg-gradient-to-r ${category.color} h-full transition-all duration-500`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Items List */}
            <div className="space-y-6">
                {itemsByCategory.map((category) => {
                    const categoryItems = category.items
                    if (categoryItems.length === 0) return null

                    const IconComponent = category.icon

                    return (
                        <div key={category.id}>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                                    <IconComponent className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {categoryItems.map((item) => (
                                    <Card
                                        key={item.id}
                                        className={`p-4 flex items-center gap-4 transition-all bg-white ${item.purchased ? "bg-muted/50 opacity-75" : "hover:shadow-md"
                                            }`}
                                    >
                                        {/* Actions - Left side in RTL */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => onDeleteItem(item.id)}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                aria-label="מחק פריט"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            {item.url && (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-secondary hover:bg-secondary/10 rounded-md transition-colors"
                                                    aria-label="פתח קישור"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Item Content */}
                                        <div className="flex-1 min-w-0 text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                {item.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                                                {item.mostWanted && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                                <p
                                                    className={`font-medium ${item.purchased ? "line-through text-muted-foreground" : "text-foreground"
                                                        }`}
                                                >
                                                    {item.name}
                                                </p>
                                            </div>
                                            {item.url && <p className="text-xs text-muted-foreground truncate" dir="ltr">{item.url}</p>}
                                        </div>

                                        {/* Checkbox - Right side in RTL */}
                                        <button
                                            onClick={() => onTogglePurchased(item.id)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${item.purchased ? "bg-primary border-primary" : "border-border hover:border-primary"
                                                }`}
                                        >
                                            {item.purchased && <Check className="w-4 h-4 text-primary-foreground" />}
                                        </button>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
