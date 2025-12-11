import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Copy, Check } from "lucide-react"

interface ShareRegistryProps {
    isOpen: boolean
    onClose: () => void
    registryLink: string
}

export default function ShareRegistry({ isOpen, onClose, registryLink }: ShareRegistryProps) {
    const [copied, setCopied] = useState(false)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(registryLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShareVia = (method: string) => {
        const encodedLink = encodeURIComponent(registryLink)
        const title = encodeURIComponent("בואו לראות את רשימת התינוק שלי!")

        switch (method) {
            case "whatsapp":
                window.open(`https://wa.me/?text=${title}%20${encodedLink}`, "_blank")
                break
            case "email":
                window.location.href = `mailto:?subject=${title}&body=${encodedLink}`
                break
            case "facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`, "_blank")
                break
            case "twitter":
                window.open(`https://twitter.com/intent/tweet?text=${title}&url=${encodedLink}`, "_blank")
                break
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-card border border-border">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">שיתוף הרשימה</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-muted rounded-md transition-colors"
                            aria-label="סגור"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Share Link */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">הקישור לרשימה שלך</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={registryLink}
                                    readOnly
                                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-muted text-foreground text-sm truncate"
                                    dir="ltr"
                                />
                                <Button
                                    onClick={handleCopyLink}
                                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            הועתק
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            העתק
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            שתפו את הקישור עם המשפחה והחברים כדי לאפשר להם לצפות ולרכוש מהרשימה שלכם.
                        </p>
                    </div>

                    {/* Share Methods */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground mb-3">שתפו דרך:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => handleShareVia("whatsapp")} variant="outline" className="text-sm bg-transparent">
                                וואטסאפ
                            </Button>
                            <Button onClick={() => handleShareVia("email")} variant="outline" className="text-sm bg-transparent">
                                אימייל
                            </Button>
                            <Button onClick={() => handleShareVia("facebook")} variant="outline" className="text-sm bg-transparent">
                                פייסבוק
                            </Button>
                            <Button onClick={() => handleShareVia("twitter")} variant="outline" className="text-sm bg-transparent">
                                טוויטר
                            </Button>
                        </div>
                    </div>

                    {/* Close Button */}
                    <Button onClick={onClose} className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                        סיום
                    </Button>
                </div>
            </Card>
        </div>
    )
}
