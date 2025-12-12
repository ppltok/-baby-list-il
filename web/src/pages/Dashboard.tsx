import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import DashboardHeader from "@/components/DashboardHeader"
import RegistryCategories from "@/components/RegistryCategories"
import AddItemModal from "@/components/AddItemModal"
import ShareRegistry from "@/components/ShareRegistry"
import { Settings } from "lucide-react"
import type { RegistryItem } from "@/types"

interface Registry {
  id: string
  slug: string
  title: string | null
  is_public: boolean
}

export function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<RegistryItem[]>([])
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  // Fetch registry on mount
  useEffect(() => {
    if (user) {
      fetchRegistry()
    }
  }, [user])

  const fetchRegistry = async () => {
    try {
      const { data, error } = await supabase
        .from("registries")
        .select("*")
        .eq("owner_id", user?.id)
        .single()

      if (!error && data) {
        setRegistry(data)
      }
    } catch (err) {
      console.error("Error fetching registry:", err)
    }
  }

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("registryItems")
    if (savedItems) {
      setItems(JSON.parse(savedItems))
    }
  }, [])

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("registryItems", JSON.stringify(items))
  }, [items])

  const handleAddItem = (newItem: Omit<RegistryItem, "id" | "addedDate">) => {
    const item: RegistryItem = {
      ...newItem,
      id: Date.now().toString(),
      addedDate: new Date().toISOString(),
    }
    setItems([...items, item])
    setIsAddModalOpen(false)
  }

  const handleTogglePurchased = (itemId: string) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, purchased: !item.purchased } : item)))
  }

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleGenerateShareLink = () => {
    if (registry?.slug) {
      return `${window.location.origin}/registry/${registry.slug}`
    }
    // Fallback if no registry slug is set
    return null
  }

  const handleShareClick = () => {
    if (!registry?.slug) {
      // Redirect to settings to set up registry
      navigate("/settings")
    } else {
      setIsShareModalOpen(true)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  // Get user's first name from profile or email
  const getUserName = () => {
    if (profile?.first_name) return profile.first_name
    if (user?.email) return user.email.split("@")[0]
    return "משתמש"
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <DashboardHeader
        onAddClick={() => setIsAddModalOpen(true)}
        onShareClick={handleShareClick}
        onSignOut={handleSignOut}
        totalItems={items.length}
        purchasedItems={items.filter((item) => item.purchased).length}
        userName={getUserName()}
        dueDate={profile?.due_date || undefined}
        onSettingsClick={() => navigate("/settings")}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Settings link if no registry */}
        {!registry?.slug && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
            <p className="text-foreground mb-2">כדי לשתף את הרשימה שלכם, הגדירו קודם שם משתמש</p>
            <Link to="/settings" className="text-primary font-semibold hover:underline">
              עבור להגדרות
            </Link>
          </div>
        )}
        <RegistryCategories items={items} onTogglePurchased={handleTogglePurchased} onDeleteItem={handleDeleteItem} />
      </main>

      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddItem={handleAddItem} />

      <ShareRegistry
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        registryLink={handleGenerateShareLink() || ""}
      />
    </div>
  )
}
