import { Package, Heart, Users, CheckCircle2 } from "lucide-react"

const features = [
    {
        icon: Heart,
        title: "הוספת מוצרים מכל חנות",
        description: "הרשימה האוניברסלית שלנו מאפשרת לכם להוסיף מוצרים מהחנויות האהובות עליכם - מקומיות ובינלאומיות.",
        color: "text-primary",
    },
    {
        icon: Users,
        title: "שיתוף קל",
        description: "שתפו את הרשימה עם המשפחה והחברים דרך קישור או רשתות חברתיות. אורחים יכולים לתרום מתנות בקלות.",
        color: "text-secondary",
    },
    {
        icon: CheckCircle2,
        title: "רשימה חכמה",
        description: "עקבו אחרי מה שאתם צריכים בקטגוריות שונות מחדר התינוק ועד ציוד. הישארו מאורגנים ככל שהמשפחה גדלה.",
        color: "text-accent",
    },
    {
        icon: Package,
        title: "המלצות מומחים",
        description: "גלו מוצרים מומלצים על ידי מומחי הורות והורים אמיתיים בישראל.",
        color: "text-primary",
    },
]

export default function Features() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground">כל מה שאתם צריכים למשפחה</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        נבנה במיוחד עבור משפחות ישראליות עם אפשרויות קניות מקומיות ובינלאומיות
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow text-right"
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4`}>
                                    <Icon className={`w-8 h-8 ${feature.color}`} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
