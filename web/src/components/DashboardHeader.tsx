import { Button } from "@/components/ui/button"
import { Plus, Share2, LogOut, Bell } from "lucide-react"
import { Link } from "react-router-dom"

interface DashboardHeaderProps {
    onAddClick: () => void
    onShareClick: () => void
    onSignOut: () => void
    totalItems: number
    purchasedItems: number
    userName?: string
    dueDate?: string
}

export default function DashboardHeader({
    onAddClick,
    onShareClick,
    onSignOut,
    totalItems,
    purchasedItems,
    userName = "משתמש",
    dueDate,
}: DashboardHeaderProps) {
    const progressPercent = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0

    // Calculate days until due date
    const getDaysUntilDue = () => {
        if (!dueDate) return null
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 ? diffDays : 0
    }

    const daysLeft = getDaysUntilDue()

    return (
        <header className="bg-gradient-to-br from-primary/90 to-primary text-white text-right">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Button onClick={onSignOut} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <LogOut className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Bell className="w-5 h-5" />
                        </Button>
                    </div>
                    <Link to="/" className="text-xl font-bold">BabyList</Link>
                </div>

                {/* Greeting */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">שלום, {userName} 👋</h1>
                    {daysLeft !== null && (
                        <p className="text-white/80">
                            עוד {daysLeft} ימים עד ההגעה הגדולה!
                        </p>
                    )}
                </div>

                {/* Progress Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm">{purchasedItems}/{totalItems} פריטים</span>
                        <span className="font-medium">התקדמות הרשימה</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-4">
                        <div
                            className="bg-white h-full transition-all duration-500 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={onAddClick}
                            className="flex-1 bg-white text-primary hover:bg-white/90"
                        >
                            <Plus className="w-4 h-4 ml-2" />
                            הוסף פריט
                        </Button>
                        <Button
                            onClick={onShareClick}
                            variant="secondary"
                            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                            <Share2 className="w-4 h-4 ml-2" />
                            שתף רשימה
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
