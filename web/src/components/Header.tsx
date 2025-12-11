import { Heart, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
    const { user } = useAuth()
    const ctaLink = user ? "/dashboard" : "/auth/signup"

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                            <Heart className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                BabyList
                            </h1>
                            <p className="text-xs text-muted-foreground">ישראל</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition">
                            הרשימה שלי
                        </a>
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition">
                            חנות
                        </a>
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition">
                            מדריכים
                        </a>
                        <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition">
                            בריאות
                        </a>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                            <Search className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                        </Button>
                        <Link to={ctaLink}>
                            <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
                                {user ? "הרשימה שלי" : "יצירת רשימה"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
