import { useState } from "react"
import type { RegistryItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Star, Lock } from "lucide-react"

interface AddItemModalProps {
    isOpen: boolean
    onClose: () => void
    onAddItem: (item: Omit<RegistryItem, "id" | "addedDate">) => void
}

const CATEGORIES = [
    { id: "nursery", name: "חדר תינוק" },
    { id: "feeding", name: "האכלה" },
    { id: "strollers", name: "עגלות" },
    { id: "clothing", name: "ביגוד" },
    { id: "gear", name: "ציוד תינוק" },
    { id: "health", name: "בריאות ובטיחות" },
    { id: "bath", name: "רחצה" },
    { id: "toys", name: "צעצועים" },
]

export default function AddItemModal({ isOpen, onClose, onAddItem }: AddItemModalProps) {
    const [name, setName] = useState("")
    const [category, setCategory] = useState("nursery")
    const [url, setUrl] = useState("")
    const [mostWanted, setMostWanted] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onAddItem({
                name: name.trim(),
                category,
                url: url.trim() || undefined,
                purchased: false,
                mostWanted,
                isPrivate,
            })
            setName("")
            setCategory("nursery")
            setUrl("")
            setMostWanted(false)
            setIsPrivate(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-card border border-border">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">הוסף פריט</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-muted rounded-md transition-colors"
                            aria-label="סגור"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Item Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">שם הפריט</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="לדוגמה: עריסה, עגלה, תיק החתלה"
                                className="w-full px-4 py-3 bg-muted border border-transparent rounded-xl focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">קטגוריה</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-muted border border-transparent rounded-xl focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Product URL */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">קישור למוצר (אופציונלי)</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/product"
                                className="w-full px-4 py-3 bg-muted border border-transparent rounded-xl focus:bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                dir="ltr"
                            />
                        </div>

                        {/* Toggle Options */}
                        <div className="space-y-3 pt-2">
                            {/* Most Wanted */}
                            <label className="flex items-center justify-between p-3 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors">
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors relative ${mostWanted ? "bg-primary" : "bg-border"
                                        }`}
                                    onClick={() => setMostWanted(!mostWanted)}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${mostWanted ? "translate-x-1" : "translate-x-6"
                                            }`}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-medium text-foreground">הכי רוצה</p>
                                        <p className="text-xs text-muted-foreground">סמן פריטים שאתם הכי רוצים לקבל</p>
                                    </div>
                                    <Star className={`w-5 h-5 ${mostWanted ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                                </div>
                            </label>

                            {/* Private */}
                            <label className="flex items-center justify-between p-3 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors">
                                <div
                                    className={`w-11 h-6 rounded-full transition-colors relative ${isPrivate ? "bg-primary" : "bg-border"
                                        }`}
                                    onClick={() => setIsPrivate(!isPrivate)}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? "translate-x-1" : "translate-x-6"
                                            }`}
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-medium text-foreground">פרטי</p>
                                        <p className="text-xs text-muted-foreground">לא יוצג לאורחים חיצוניים</p>
                                    </div>
                                    <Lock className={`w-5 h-5 ${isPrivate ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                                ביטול
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                                הוסף פריט
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    )
}
