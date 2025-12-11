import { Home, Utensils, Car, Baby } from "lucide-react"

const categories = [
    {
        name: "חדר תינוק וריהוט",
        description: "עריסות, שידות, משטחי החתלה",
        color: "from-emerald-400 to-emerald-600",
        icon: Home,
    },
    {
        name: "האכלה והנקה",
        description: "בקבוקים, משאבות, כסאות אוכל",
        color: "from-yellow-400 to-yellow-600",
        icon: Utensils,
    },
    {
        name: "עגלות ונשאים",
        description: "עגלות, כסאות בטיחות, מנשאים",
        color: "from-orange-400 to-orange-600",
        icon: Car,
    },
    {
        name: "ביגוד וציוד",
        description: "בגדים, נעליים, אביזרים",
        color: "from-pink-400 to-pink-600",
        icon: Baby,
    },
]

export default function Categories() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground">קנו את הטוב ביותר לתינוק</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        מצאו מוצרים שנבחרו על ידי מומחים ונבדקו על ידי הורים אמיתיים לכל שלב במסע שלכם
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon
                        return (
                            <button
                                key={index}
                                className="group relative overflow-hidden rounded-2xl h-64 cursor-pointer transform transition-transform hover:scale-105 w-full"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

                                <div className="relative h-full flex flex-col items-center justify-center text-white space-y-3 p-6 text-center">
                                    <Icon className="w-16 h-16" />
                                    <div>
                                        <h3 className="text-2xl font-bold">{category.name}</h3>
                                        <p className="text-white/80 text-sm mt-1">{category.description}</p>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
