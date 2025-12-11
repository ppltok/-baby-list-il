export interface RegistryItem {
    id: string
    name: string
    category: string
    url?: string
    purchased: boolean
    addedDate: string
    mostWanted?: boolean
    isPrivate?: boolean
}
