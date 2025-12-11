import { Heart } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-foreground text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12 text-right">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">BabyList ישראל</span>
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg">
                                <Heart className="w-6 h-6 text-white fill-white" />
                            </div>
                        </div>
                        <p className="text-white/70 text-sm">פלטפורמת רשימת התינוק המלאה למשפחות ישראליות.</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">רשימה</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    יצירת רשימה
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    חיפוש רשימה
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    מדריכים
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">חנות</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    כל המוצרים
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    הכי נמכרים
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    מבצעים
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">החברה</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    אודותינו
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    עזרה ותמיכה
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition">
                                    פרטיות
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-white/60">
                        <p>&copy; 2025 BabyList ישראל. כל הזכויות שמורות.</p>
                        <div className="flex gap-6 mt-4 sm:mt-0">
                            <a href="#" className="hover:text-white transition">
                                תנאי שימוש
                            </a>
                            <a href="#" className="hover:text-white transition">
                                פרטיות
                            </a>
                            <a href="#" className="hover:text-white transition">
                                עוגיות
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
