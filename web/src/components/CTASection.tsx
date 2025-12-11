import { Button } from "@/components/ui/button"
import { CheckCircle2, Gift, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function CTASection() {
    const { user } = useAuth()
    const ctaLink = user ? "/dashboard" : "/auth/signup"

    const steps = [
        {
            icon: Gift,
            number: "1",
            title: "שתפו וקבלו מתנות",
            description: "שתפו עם יקיריכם וצפו במתנות מגיעות",
        },
        {
            icon: CheckCircle2,
            number: "2",
            title: "הוסיפו מוצרים",
            description: "בחרו מוצרים מכל חנות שתרצו",
        },
        {
            icon: Share2,
            number: "3",
            title: "צרו רשימה",
            description: "ספרו לנו על המשפחה והתאריך המשוער",
        },
    ]

    return (
        <section className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground">התחילו ב-3 צעדים פשוטים</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        צרו את רשימת התינוק שלכם והתחברו עם המשפחה והחברים
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {steps.map((step) => {
                        const Icon = step.icon
                        return (
                            <div key={step.number} className="relative">
                                <div className="bg-white rounded-2xl p-8 border border-border text-center">
                                    <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full items-center justify-center mb-6 mx-auto">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 text-center">{step.title}</h3>
                                    <p className="text-muted-foreground text-center">{step.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="text-center">
                    <Link to={ctaLink}>
                        <Button className="h-14 px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-full">
                            {user ? "לרשימה שלי" : "התחילו את הרשימה היום"}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
