import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import DashboardHeader from "@/components/DashboardHeader"
import RegistryCategories from "@/components/RegistryCategories"
import AddItemModal from "@/components/AddItemModal"
import ShareRegistry from "@/components/ShareRegistry"
import type { RegistryItem } from "@/types"

export function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<RegistryItem[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

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
    const registryData = btoa(JSON.stringify(items))
    return `${window.location.origin}/registry/${registryData}`
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
        onShareClick={() => setIsShareModalOpen(true)}
        onSignOut={handleSignOut}
        totalItems={items.length}
        purchasedItems={items.filter((item) => item.purchased).length}
        userName={getUserName()}
        dueDate={profile?.due_date || undefined}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <RegistryCategories items={items} onTogglePurchased={handleTogglePurchased} onDeleteItem={handleDeleteItem} />
      </main>

      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddItem={handleAddItem} />

      <ShareRegistry
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        registryLink={handleGenerateShareLink()}
      />
    </div>
  )
}
