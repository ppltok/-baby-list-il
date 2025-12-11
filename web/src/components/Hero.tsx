import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function Hero() {
    const { user } = useAuth()
    const ctaLink = user ? "/dashboard" : "/auth/signup"

    return (
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image - Left side in RTL */}
                    <div className="relative order-2 md:order-1">
                        <img
                            src="/home-page-hero.png"
                            alt="Baby Registry Preview"
                            className="w-full max-w-md mx-auto h-auto object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Content - Right side in RTL */}
                    <div className="space-y-6 order-1 md:order-2 text-right">
                        <div className="space-y-4">
                            <h2 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight text-right">
                                רשימת התינוק ש
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    גדלה עם המשפחה שלך
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                צרו את רשימת התינוק האישית שלכם, שתפו עם יקיריכם וקבלו בדיוק את מה שאתם צריכים למשפחה הגדלה שלכם.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to={ctaLink}>
                                <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full w-full sm:w-auto">
                                    {user ? "לרשימה שלי" : "התחילו רשימת תינוק"}
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="h-12 px-8 border-2 border-secondary text-secondary hover:bg-secondary/5 font-semibold rounded-full bg-transparent"
                            >
                                חיפוש רשימה
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 pt-8">
                            <div>
                                <p className="text-3xl font-bold text-primary">500K+</p>
                                <p className="text-sm text-muted-foreground">רשימות פעילות</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-secondary">100K+</p>
                                <p className="text-sm text-muted-foreground">מוצרים זמינים</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
