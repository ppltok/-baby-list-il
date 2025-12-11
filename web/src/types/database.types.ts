/**
 * BabyList Israel - Database Types
 * Auto-generated types for Supabase tables
 *
 * Usage:
 *   import { Database, Tables, Enums } from './database.types'
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// ENUMS
// ============================================

export type UserFeeling = 'excited' | 'overwhelmed' | 'exploring'

export type ItemCategory =
  | 'feeding'
  | 'sleeping'
  | 'diapering'
  | 'baby_gear'
  | 'health_safety'
  | 'bathing'
  | 'nursery_decor'
  | 'clothing'
  | 'playing'

export type PurchaseStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired'

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export type AppLanguage = 'en' | 'he'

export type ActivityType =
  | 'item_added'
  | 'item_updated'
  | 'item_deleted'
  | 'purchase_pending'
  | 'purchase_confirmed'
  | 'purchase_cancelled'
  | 'partner_invited'
  | 'partner_joined'
  | 'registry_shared'

export type EmailStatus = 'pending' | 'sent' | 'failed'

// ============================================
// DATABASE INTERFACE
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar_url: string | null
          due_date: string | null
          is_first_time_parent: boolean
          feeling: UserFeeling | null
          preferred_language: AppLanguage
          onboarding_completed: boolean
          email_notifications: boolean
          marketing_emails: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          due_date?: string | null
          is_first_time_parent?: boolean
          feeling?: UserFeeling | null
          preferred_language?: AppLanguage
          onboarding_completed?: boolean
          email_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          due_date?: string | null
          is_first_time_parent?: boolean
          feeling?: UserFeeling | null
          preferred_language?: AppLanguage
          onboarding_completed?: boolean
          email_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      registries: {
        Row: {
          id: string
          owner_id: string
          partner_id: string | null
          slug: string
          title: string | null
          description: string | null
          cover_image_url: string | null
          address_street: string | null
          address_apt: string | null
          address_city: string | null
          address_postal: string | null
          address_phone: string | null
          address_is_private: boolean
          is_public: boolean
          show_purchased_items: boolean
          allow_anonymous_gifts: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          partner_id?: string | null
          slug: string
          title?: string | null
          description?: string | null
          cover_image_url?: string | null
          address_street?: string | null
          address_apt?: string | null
          address_city?: string | null
          address_postal?: string | null
          address_phone?: string | null
          address_is_private?: boolean
          is_public?: boolean
          show_purchased_items?: boolean
          allow_anonymous_gifts?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          partner_id?: string | null
          slug?: string
          title?: string | null
          description?: string | null
          cover_image_url?: string | null
          address_street?: string | null
          address_apt?: string | null
          address_city?: string | null
          address_postal?: string | null
          address_phone?: string | null
          address_is_private?: boolean
          is_public?: boolean
          show_purchased_items?: boolean
          allow_anonymous_gifts?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          registry_id: string
          name: string
          price: number
          image_url: string
          original_url: string
          store_name: string
          description: string | null
          brand: string | null
          category: ItemCategory
          quantity: number
          quantity_received: number
          is_most_wanted: boolean
          is_private: boolean
          notes: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registry_id: string
          name: string
          price: number
          image_url: string
          original_url: string
          store_name: string
          description?: string | null
          brand?: string | null
          category: ItemCategory
          quantity?: number
          quantity_received?: number
          is_most_wanted?: boolean
          is_private?: boolean
          notes?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registry_id?: string
          name?: string
          price?: number
          image_url?: string
          original_url?: string
          store_name?: string
          description?: string | null
          brand?: string | null
          category?: ItemCategory
          quantity?: number
          quantity_received?: number
          is_most_wanted?: boolean
          is_private?: boolean
          notes?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          item_id: string
          buyer_name: string
          buyer_email: string
          buyer_user_id: string | null
          quantity: number
          gift_message: string | null
          is_surprise: boolean
          is_anonymous: boolean
          status: PurchaseStatus
          confirmation_token: string
          confirmation_email_sent_at: string | null
          confirmed_at: string | null
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id: string
          buyer_name: string
          buyer_email: string
          buyer_user_id?: string | null
          quantity?: number
          gift_message?: string | null
          is_surprise?: boolean
          is_anonymous?: boolean
          status?: PurchaseStatus
          confirmation_token?: string
          confirmation_email_sent_at?: string | null
          confirmed_at?: string | null
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          buyer_name?: string
          buyer_email?: string
          buyer_user_id?: string | null
          quantity?: number
          gift_message?: string | null
          is_surprise?: boolean
          is_anonymous?: boolean
          status?: PurchaseStatus
          confirmation_token?: string
          confirmation_email_sent_at?: string | null
          confirmed_at?: string | null
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      partner_invitations: {
        Row: {
          id: string
          registry_id: string
          inviter_id: string
          invited_email: string
          invited_first_name: string
          invited_last_name: string
          token: string
          status: InvitationStatus
          created_at: string
          expires_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          registry_id: string
          inviter_id: string
          invited_email: string
          invited_first_name: string
          invited_last_name: string
          token?: string
          status?: InvitationStatus
          created_at?: string
          expires_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          registry_id?: string
          inviter_id?: string
          invited_email?: string
          invited_first_name?: string
          invited_last_name?: string
          token?: string
          status?: InvitationStatus
          created_at?: string
          expires_at?: string
          accepted_at?: string | null
        }
      }
      activity_log: {
        Row: {
          id: string
          registry_id: string
          activity_type: ActivityType
          item_id: string | null
          purchase_id: string | null
          actor_name: string | null
          metadata: Json
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          registry_id: string
          activity_type: ActivityType
          item_id?: string | null
          purchase_id?: string | null
          actor_name?: string | null
          metadata?: Json
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          registry_id?: string
          activity_type?: ActivityType
          item_id?: string | null
          purchase_id?: string | null
          actor_name?: string | null
          metadata?: Json
          is_read?: boolean
          created_at?: string
        }
      }
      email_queue: {
        Row: {
          id: string
          to_email: string
          to_name: string | null
          template_id: string
          subject: string
          variables: Json
          scheduled_for: string
          status: EmailStatus
          sent_at: string | null
          error_message: string | null
          retry_count: number
          purchase_id: string | null
          registry_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          to_email: string
          to_name?: string | null
          template_id: string
          subject: string
          variables?: Json
          scheduled_for?: string
          status?: EmailStatus
          sent_at?: string | null
          error_message?: string | null
          retry_count?: number
          purchase_id?: string | null
          registry_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          to_email?: string
          to_name?: string | null
          template_id?: string
          subject?: string
          variables?: Json
          scheduled_for?: string
          status?: EmailStatus
          sent_at?: string | null
          error_message?: string | null
          retry_count?: number
          purchase_id?: string | null
          registry_id?: string | null
          created_at?: string
        }
      }
      category_metadata: {
        Row: {
          category: ItemCategory
          name_en: string
          name_he: string
          icon: string
          sort_order: number
        }
        Insert: {
          category: ItemCategory
          name_en: string
          name_he: string
          icon: string
          sort_order: number
        }
        Update: {
          category?: ItemCategory
          name_en?: string
          name_he?: string
          icon?: string
          sort_order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_registry_slug: {
        Args: {
          first_name: string
          partner_first_name?: string
        }
        Returns: string
      }
      confirm_purchase: {
        Args: {
          p_token: string
        }
        Returns: Json
      }
      cancel_purchase: {
        Args: {
          p_token: string
        }
        Returns: Json
      }
      get_registry_stats: {
        Args: {
          p_registry_id: string
        }
        Returns: Json
      }
      log_activity: {
        Args: {
          p_registry_id: string
          p_activity_type: string
          p_actor_name?: string
          p_item_id?: string
          p_purchase_id?: string
          p_metadata?: Json
        }
        Returns: string
      }
    }
    Enums: {
      user_feeling: UserFeeling
      item_category: ItemCategory
      purchase_status: PurchaseStatus
      invitation_status: InvitationStatus
      app_language: AppLanguage
    }
  }
}

// ============================================
// HELPER TYPES
// ============================================

// Type shortcuts for easy access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// Convenience type aliases
export type Profile = Tables<'profiles'>
export type Registry = Tables<'registries'>
export type Item = Tables<'items'>
export type Purchase = Tables<'purchases'>
export type PartnerInvitation = Tables<'partner_invitations'>
export type ActivityLog = Tables<'activity_log'>
export type EmailQueue = Tables<'email_queue'>
export type CategoryMetadata = Tables<'category_metadata'>

// Insert types
export type ProfileInsert = InsertTables<'profiles'>
export type RegistryInsert = InsertTables<'registries'>
export type ItemInsert = InsertTables<'items'>
export type PurchaseInsert = InsertTables<'purchases'>
export type PartnerInvitationInsert = InsertTables<'partner_invitations'>

// Update types
export type ProfileUpdate = UpdateTables<'profiles'>
export type RegistryUpdate = UpdateTables<'registries'>
export type ItemUpdate = UpdateTables<'items'>
export type PurchaseUpdate = UpdateTables<'purchases'>

// ============================================
// EXTENDED TYPES (with relations)
// ============================================

// Registry with owner profile
export interface RegistryWithOwner extends Registry {
  owner: Profile
  partner?: Profile | null
}

// Item with purchase status
export interface ItemWithPurchases extends Item {
  purchases: Purchase[]
  is_fully_purchased: boolean
}

// Activity with related data
export interface ActivityWithDetails extends ActivityLog {
  item?: Item | null
  purchase?: Purchase | null
}

// Registry statistics (returned by get_registry_stats function)
export interface RegistryStats {
  total_items: number
  items_purchased: number
  items_partially_purchased: number
  total_value: number
  value_received: number
  completion_percentage: number
  category_breakdown: Record<ItemCategory, number>
}

// ============================================
// CATEGORY HELPERS
// ============================================

export const CATEGORIES: ItemCategory[] = [
  'feeding',
  'sleeping',
  'diapering',
  'baby_gear',
  'health_safety',
  'bathing',
  'nursery_decor',
  'clothing',
  'playing',
]

export const CATEGORY_INFO: Record<ItemCategory, { name_en: string; name_he: string; icon: string }> = {
  feeding: { name_en: 'Feeding', name_he: 'האכלה', icon: '🍼' },
  sleeping: { name_en: 'Sleeping', name_he: 'שינה', icon: '🛏️' },
  diapering: { name_en: 'Diapering', name_he: 'החתלה', icon: '🧷' },
  baby_gear: { name_en: 'Baby Gear', name_he: 'ציוד תינוק', icon: '🚗' },
  health_safety: { name_en: 'Health & Safety', name_he: 'בריאות ובטיחות', icon: '🏥' },
  bathing: { name_en: 'Bathing', name_he: 'רחצה', icon: '🛁' },
  nursery_decor: { name_en: 'Nursery & Decor', name_he: 'חדר תינוק ועיצוב', icon: '🏠' },
  clothing: { name_en: 'Clothing', name_he: 'ביגוד', icon: '👶' },
  playing: { name_en: 'Playing', name_he: 'משחק', icon: '🧸' },
}

// ============================================
// FEELING HELPERS
// ============================================

export const FEELINGS: UserFeeling[] = ['excited', 'overwhelmed', 'exploring']

export const FEELING_INFO: Record<UserFeeling, { name_en: string; name_he: string; emoji: string }> = {
  excited: { name_en: 'So excited!', name_he: 'כל כך נרגשים!', emoji: '🎉' },
  overwhelmed: { name_en: 'A bit overwhelmed', name_he: 'קצת מוצפים', emoji: '😅' },
  exploring: { name_en: 'Just exploring', name_he: 'רק מסתכלים', emoji: '🔍' },
}
