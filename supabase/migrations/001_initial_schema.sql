-- ============================================
-- BabyList Israel - Complete Database Schema
-- Version: 1.0.0
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CUSTOM TYPES (ENUMS)
-- ============================================

-- User feeling during onboarding
CREATE TYPE user_feeling AS ENUM ('excited', 'overwhelmed', 'exploring');

-- Item categories
CREATE TYPE item_category AS ENUM (
  'feeding',
  'sleeping',
  'diapering',
  'baby_gear',
  'health_safety',
  'bathing',
  'nursery_decor',
  'clothing',
  'playing'
);

-- Purchase status
CREATE TYPE purchase_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');

-- Partner invitation status
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Supported languages
CREATE TYPE app_language AS ENUM ('en', 'he');

-- ============================================
-- TABLES
-- ============================================

-- --------------------------------------------
-- 1. PROFILES TABLE (extends Supabase auth.users)
-- --------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  due_date DATE,
  is_first_time_parent BOOLEAN DEFAULT true,
  feeling user_feeling,
  preferred_language app_language DEFAULT 'en',
  onboarding_completed BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';

-- --------------------------------------------
-- 2. REGISTRIES TABLE
-- --------------------------------------------
CREATE TABLE public.registries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Registry info
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  cover_image_url TEXT,

  -- Delivery address
  address_street TEXT,
  address_apt TEXT,
  address_city TEXT,
  address_postal TEXT,
  address_phone TEXT,
  address_is_private BOOLEAN DEFAULT true,

  -- Settings
  is_public BOOLEAN DEFAULT true,
  show_purchased_items BOOLEAN DEFAULT true,
  allow_anonymous_gifts BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.registries IS 'Baby registries - each user can have one registry';

-- --------------------------------------------
-- 3. ITEMS TABLE
-- --------------------------------------------
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES public.registries(id) ON DELETE CASCADE,

  -- Product info (from extension scraping)
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  store_name TEXT NOT NULL,
  description TEXT,
  brand TEXT,

  -- Categorization
  category item_category NOT NULL,

  -- Quantity tracking
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 99),
  quantity_received INTEGER DEFAULT 0 CHECK (quantity_received >= 0),

  -- Flags
  is_most_wanted BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,

  -- User notes
  notes TEXT,

  -- Ordering
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.items IS 'Registry items scraped from various stores';

-- --------------------------------------------
-- 4. PURCHASES TABLE
-- --------------------------------------------
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,

  -- Buyer info (not necessarily a registered user)
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Gift details
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
  gift_message TEXT,
  is_surprise BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,

  -- Status tracking
  status purchase_status DEFAULT 'pending',

  -- Email confirmation
  confirmation_token UUID DEFAULT uuid_generate_v4() UNIQUE,
  confirmation_email_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.purchases IS 'Purchase records from gift givers';

-- --------------------------------------------
-- 5. PARTNER INVITATIONS TABLE
-- --------------------------------------------
CREATE TABLE public.partner_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES public.registries(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Invited person info
  invited_email TEXT NOT NULL,
  invited_first_name TEXT NOT NULL,
  invited_last_name TEXT NOT NULL,

  -- Invitation tracking
  token UUID DEFAULT uuid_generate_v4() UNIQUE,
  status invitation_status DEFAULT 'pending',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.partner_invitations IS 'Invitations for partners to co-manage registry';

-- --------------------------------------------
-- 6. ACTIVITY LOG TABLE (for gift feed)
-- --------------------------------------------
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID NOT NULL REFERENCES public.registries(id) ON DELETE CASCADE,

  -- Activity details
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'item_added',
    'item_updated',
    'item_deleted',
    'purchase_pending',
    'purchase_confirmed',
    'purchase_cancelled',
    'partner_invited',
    'partner_joined',
    'registry_shared'
  )),

  -- Related entities
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  actor_name TEXT, -- Name of person who performed action

  -- Additional data (JSON for flexibility)
  metadata JSONB DEFAULT '{}',

  -- Read status
  is_read BOOLEAN DEFAULT false,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.activity_log IS 'Activity feed for registry events';

-- --------------------------------------------
-- 7. EMAIL QUEUE TABLE (for scheduled emails)
-- --------------------------------------------
CREATE TABLE public.email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Email details
  to_email TEXT NOT NULL,
  to_name TEXT,
  template_id TEXT NOT NULL,
  subject TEXT NOT NULL,

  -- Template variables
  variables JSONB DEFAULT '{}',

  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Related entities
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  registry_id UUID REFERENCES public.registries(id) ON DELETE SET NULL,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.email_queue IS 'Queue for scheduled emails (purchase confirmations, etc.)';

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Registries
CREATE INDEX idx_registries_owner ON public.registries(owner_id);
CREATE INDEX idx_registries_partner ON public.registries(partner_id);
CREATE INDEX idx_registries_slug ON public.registries(slug);

-- Items
CREATE INDEX idx_items_registry ON public.items(registry_id);
CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_registry_category ON public.items(registry_id, category);
CREATE INDEX idx_items_is_private ON public.items(is_private);

-- Purchases
CREATE INDEX idx_purchases_item ON public.purchases(item_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
CREATE INDEX idx_purchases_buyer_email ON public.purchases(buyer_email);
CREATE INDEX idx_purchases_confirmation_token ON public.purchases(confirmation_token);
CREATE INDEX idx_purchases_expires ON public.purchases(expires_at) WHERE status = 'pending';

-- Partner Invitations
CREATE INDEX idx_invitations_registry ON public.partner_invitations(registry_id);
CREATE INDEX idx_invitations_email ON public.partner_invitations(invited_email);
CREATE INDEX idx_invitations_token ON public.partner_invitations(token);
CREATE INDEX idx_invitations_status ON public.partner_invitations(status);

-- Activity Log
CREATE INDEX idx_activity_registry ON public.activity_log(registry_id);
CREATE INDEX idx_activity_created ON public.activity_log(created_at DESC);
CREATE INDEX idx_activity_unread ON public.activity_log(registry_id, is_read) WHERE is_read = false;

-- Email Queue
CREATE INDEX idx_email_queue_scheduled ON public.email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_email_queue_status ON public.email_queue(status);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate slug from names
CREATE OR REPLACE FUNCTION generate_registry_slug(first_name TEXT, partner_first_name TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from names
  IF partner_first_name IS NOT NULL AND partner_first_name != '' THEN
    base_slug := LOWER(REGEXP_REPLACE(first_name || '-and-' || partner_first_name, '[^a-zA-Z0-9]+', '-', 'g'));
  ELSE
    base_slug := LOWER(REGEXP_REPLACE(first_name || '-baby-registry', '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;

  -- Trim leading/trailing dashes
  base_slug := TRIM(BOTH '-' FROM base_slug);

  -- Check for uniqueness and add number if needed
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.registries WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_registry_id UUID,
  p_activity_type TEXT,
  p_actor_name TEXT DEFAULT NULL,
  p_item_id UUID DEFAULT NULL,
  p_purchase_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_log (
    registry_id, activity_type, actor_name, item_id, purchase_id, metadata
  ) VALUES (
    p_registry_id, p_activity_type, p_actor_name, p_item_id, p_purchase_id, p_metadata
  ) RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to schedule purchase confirmation email (3 hour delay)
CREATE OR REPLACE FUNCTION schedule_purchase_confirmation(p_purchase_id UUID)
RETURNS UUID AS $$
DECLARE
  v_purchase RECORD;
  v_item RECORD;
  v_registry RECORD;
  v_owner RECORD;
  email_id UUID;
BEGIN
  -- Get purchase details
  SELECT * INTO v_purchase FROM public.purchases WHERE id = p_purchase_id;
  SELECT * INTO v_item FROM public.items WHERE id = v_purchase.item_id;
  SELECT * INTO v_registry FROM public.registries WHERE id = v_item.registry_id;
  SELECT * INTO v_owner FROM public.profiles WHERE id = v_registry.owner_id;

  -- Create email queue entry (3 hours from now)
  INSERT INTO public.email_queue (
    to_email,
    to_name,
    template_id,
    subject,
    variables,
    scheduled_for,
    purchase_id,
    registry_id
  ) VALUES (
    v_purchase.buyer_email,
    v_purchase.buyer_name,
    'purchase_confirmation',
    'Please confirm your gift purchase for ' || v_owner.first_name || '''s Baby Registry',
    jsonb_build_object(
      'buyer_name', v_purchase.buyer_name,
      'owner_name', v_owner.first_name,
      'item_name', v_item.name,
      'item_price', v_item.price,
      'item_image', v_item.image_url,
      'store_name', v_item.store_name,
      'confirmation_token', v_purchase.confirmation_token,
      'registry_slug', v_registry.slug
    ),
    NOW() + INTERVAL '3 hours',
    p_purchase_id,
    v_registry.id
  ) RETURNING id INTO email_id;

  -- Update purchase with email sent timestamp
  UPDATE public.purchases
  SET confirmation_email_sent_at = NOW() + INTERVAL '3 hours'
  WHERE id = p_purchase_id;

  RETURN email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to confirm purchase
CREATE OR REPLACE FUNCTION confirm_purchase(p_token UUID)
RETURNS JSONB AS $$
DECLARE
  v_purchase RECORD;
  v_item RECORD;
BEGIN
  -- Find purchase by token
  SELECT * INTO v_purchase
  FROM public.purchases
  WHERE confirmation_token = p_token AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired token');
  END IF;

  -- Check if expired
  IF v_purchase.expires_at < NOW() THEN
    UPDATE public.purchases SET status = 'expired' WHERE id = v_purchase.id;
    RETURN jsonb_build_object('success', false, 'error', 'Token has expired');
  END IF;

  -- Confirm the purchase
  UPDATE public.purchases
  SET status = 'confirmed', confirmed_at = NOW()
  WHERE id = v_purchase.id;

  -- Update item quantity received
  SELECT * INTO v_item FROM public.items WHERE id = v_purchase.item_id;
  UPDATE public.items
  SET quantity_received = quantity_received + v_purchase.quantity
  WHERE id = v_purchase.item_id;

  -- Log activity
  PERFORM log_activity(
    v_item.registry_id,
    'purchase_confirmed',
    v_purchase.buyer_name,
    v_purchase.item_id,
    v_purchase.id,
    jsonb_build_object('item_name', v_item.name)
  );

  RETURN jsonb_build_object('success', true, 'item_name', v_item.name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel/decline purchase
CREATE OR REPLACE FUNCTION cancel_purchase(p_token UUID)
RETURNS JSONB AS $$
DECLARE
  v_purchase RECORD;
BEGIN
  -- Find purchase by token
  SELECT * INTO v_purchase
  FROM public.purchases
  WHERE confirmation_token = p_token AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired token');
  END IF;

  -- Cancel the purchase
  UPDATE public.purchases
  SET status = 'cancelled'
  WHERE id = v_purchase.id;

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get registry statistics
CREATE OR REPLACE FUNCTION get_registry_stats(p_registry_id UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_items', COUNT(*),
    'items_purchased', COUNT(*) FILTER (WHERE quantity_received >= quantity),
    'items_partially_purchased', COUNT(*) FILTER (WHERE quantity_received > 0 AND quantity_received < quantity),
    'total_value', COALESCE(SUM(price * quantity), 0),
    'value_received', COALESCE(SUM(price * quantity_received), 0),
    'completion_percentage', CASE
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND((COUNT(*) FILTER (WHERE quantity_received >= quantity)::DECIMAL / COUNT(*)) * 100)
    END,
    'category_breakdown', (
      SELECT jsonb_object_agg(category, cnt)
      FROM (
        SELECT category, COUNT(*) as cnt
        FROM public.items
        WHERE registry_id = p_registry_id AND NOT is_private
        GROUP BY category
      ) cats
    )
  ) INTO stats
  FROM public.items
  WHERE registry_id = p_registry_id AND NOT is_private;

  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at for all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registries_updated_at
  BEFORE UPDATE ON public.registries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Log item activities
CREATE OR REPLACE FUNCTION log_item_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_activity(
      NEW.registry_id,
      'item_added',
      NULL,
      NEW.id,
      NULL,
      jsonb_build_object('item_name', NEW.name, 'category', NEW.category)
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_activity(
      OLD.registry_id,
      'item_deleted',
      NULL,
      OLD.id,
      NULL,
      jsonb_build_object('item_name', OLD.name)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_item_change
  AFTER INSERT OR DELETE ON public.items
  FOR EACH ROW EXECUTE FUNCTION log_item_activity();

-- Log purchase and schedule confirmation email
CREATE OR REPLACE FUNCTION handle_new_purchase()
RETURNS TRIGGER AS $$
DECLARE
  v_item RECORD;
BEGIN
  -- Get item details
  SELECT * INTO v_item FROM public.items WHERE id = NEW.item_id;

  -- Log activity
  PERFORM log_activity(
    v_item.registry_id,
    'purchase_pending',
    CASE WHEN NEW.is_anonymous THEN 'Anonymous' ELSE NEW.buyer_name END,
    NEW.item_id,
    NEW.id,
    jsonb_build_object('item_name', v_item.name, 'is_surprise', NEW.is_surprise)
  );

  -- Schedule confirmation email (3 hour delay)
  PERFORM schedule_purchase_confirmation(NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_purchase_created
  AFTER INSERT ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION handle_new_purchase();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow inserting profile on signup (via trigger)
CREATE POLICY "Allow profile creation on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- --------------------------------------------
-- REGISTRIES POLICIES
-- --------------------------------------------

-- Registry owners and partners can view their registry
CREATE POLICY "Owners and partners can view registry"
  ON public.registries FOR SELECT
  USING (auth.uid() = owner_id OR auth.uid() = partner_id);

-- Anyone can view public registries by slug (for public view)
CREATE POLICY "Anyone can view public registries"
  ON public.registries FOR SELECT
  USING (is_public = true);

-- Only owner can create registry
CREATE POLICY "Users can create registry"
  ON public.registries FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owner and partner can update registry
CREATE POLICY "Owners and partners can update registry"
  ON public.registries FOR UPDATE
  USING (auth.uid() = owner_id OR auth.uid() = partner_id);

-- Only owner can delete registry
CREATE POLICY "Only owner can delete registry"
  ON public.registries FOR DELETE
  USING (auth.uid() = owner_id);

-- --------------------------------------------
-- ITEMS POLICIES
-- --------------------------------------------

-- Registry owners and partners can view all items
CREATE POLICY "Owners and partners can view all items"
  ON public.items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = items.registry_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
    )
  );

-- Public can view non-private items in public registries
CREATE POLICY "Public can view non-private items"
  ON public.items FOR SELECT
  USING (
    is_private = false AND
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = items.registry_id AND r.is_public = true
    )
  );

-- Owner and partner can insert items
CREATE POLICY "Owners and partners can insert items"
  ON public.items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = registry_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
    )
  );

-- Owner and partner can update items
CREATE POLICY "Owners and partners can update items"
  ON public.items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = items.registry_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
    )
  );

-- Owner and partner can delete items
CREATE POLICY "Owners and partners can delete items"
  ON public.items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = items.registry_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
    )
  );

-- --------------------------------------------
-- PURCHASES POLICIES
-- --------------------------------------------

-- Registry owners can view purchases (respecting surprise flag)
CREATE POLICY "Owners can view non-surprise purchases"
  ON public.purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.items i
      JOIN public.registries r ON r.id = i.registry_id
      WHERE i.id = purchases.item_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
      AND (purchases.is_surprise = false OR purchases.status = 'confirmed')
    )
  );

-- Gift givers can view their own purchases
CREATE POLICY "Buyers can view own purchases"
  ON public.purchases FOR SELECT
  USING (buyer_user_id = auth.uid());

-- Anyone can create a purchase (gift givers)
CREATE POLICY "Anyone can create purchase"
  ON public.purchases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.items i
      JOIN public.registries r ON r.id = i.registry_id
      WHERE i.id = item_id
      AND r.is_public = true
      AND i.is_private = false
    )
  );

-- Gift givers can update their own pending purchases
CREATE POLICY "Buyers can update own pending purchases"
  ON public.purchases FOR UPDATE
  USING (buyer_user_id = auth.uid() AND status = 'pending');

-- --------------------------------------------
-- PARTNER INVITATIONS POLICIES
-- --------------------------------------------

-- Inviters can view their sent invitations
CREATE POLICY "Inviters can view invitations"
  ON public.partner_invitations FOR SELECT
  USING (inviter_id = auth.uid());

-- Invited users can view invitations to them
CREATE POLICY "Invited can view their invitations"
  ON public.partner_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.email = invited_email
    )
  );

-- Registry owner can create invitations
CREATE POLICY "Owners can create invitations"
  ON public.partner_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = registry_id AND r.owner_id = auth.uid()
    )
  );

-- Inviter can update/delete their invitations
CREATE POLICY "Inviters can update invitations"
  ON public.partner_invitations FOR UPDATE
  USING (inviter_id = auth.uid());

CREATE POLICY "Inviters can delete invitations"
  ON public.partner_invitations FOR DELETE
  USING (inviter_id = auth.uid());

-- --------------------------------------------
-- ACTIVITY LOG POLICIES
-- --------------------------------------------

-- Registry owners and partners can view activity
CREATE POLICY "Owners and partners can view activity"
  ON public.activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = activity_log.registry_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
    )
  );

-- Only system can insert activity (via functions)
-- No direct insert policy needed as we use SECURITY DEFINER functions

-- Owners can update activity (mark as read)
CREATE POLICY "Owners can update activity"
  ON public.activity_log FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.registries r
      WHERE r.id = activity_log.registry_id
      AND (r.owner_id = auth.uid() OR r.partner_id = auth.uid())
    )
  );

-- --------------------------------------------
-- EMAIL QUEUE POLICIES
-- --------------------------------------------

-- Only service role can access email queue (no user policies)
-- This table is accessed by Edge Functions with service role

-- ============================================
-- SEED DATA (Optional categories display names)
-- ============================================

-- Create a helper table for category metadata
CREATE TABLE public.category_metadata (
  category item_category PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_he TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

INSERT INTO public.category_metadata (category, name_en, name_he, icon, sort_order) VALUES
  ('feeding', 'Feeding', 'האכלה', '🍼', 1),
  ('sleeping', 'Sleeping', 'שינה', '🛏️', 2),
  ('diapering', 'Diapering', 'החתלה', '🧷', 3),
  ('baby_gear', 'Baby Gear', 'ציוד תינוק', '🚗', 4),
  ('health_safety', 'Health & Safety', 'בריאות ובטיחות', '🏥', 5),
  ('bathing', 'Bathing', 'רחצה', '🛁', 6),
  ('nursery_decor', 'Nursery & Decor', 'חדר תינוק ועיצוב', '🏠', 7),
  ('clothing', 'Clothing', 'ביגוד', '👶', 8),
  ('playing', 'Playing', 'משחק', '🧸', 9);

-- No RLS needed for metadata (read-only reference data)
ALTER TABLE public.category_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read category metadata"
  ON public.category_metadata FOR SELECT
  USING (true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.registries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registries TO authenticated;

GRANT SELECT ON public.items TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO authenticated;

GRANT SELECT, INSERT ON public.purchases TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.purchases TO authenticated;

GRANT SELECT ON public.partner_invitations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_invitations TO authenticated;

GRANT SELECT, UPDATE ON public.activity_log TO authenticated;

GRANT SELECT ON public.category_metadata TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION generate_registry_slug TO authenticated;
GRANT EXECUTE ON FUNCTION confirm_purchase TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cancel_purchase TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_registry_stats TO anon, authenticated;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ BabyList Israel database schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - profiles (extends auth.users)';
  RAISE NOTICE '  - registries';
  RAISE NOTICE '  - items';
  RAISE NOTICE '  - purchases';
  RAISE NOTICE '  - partner_invitations';
  RAISE NOTICE '  - activity_log';
  RAISE NOTICE '  - email_queue';
  RAISE NOTICE '  - category_metadata';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Enable Google OAuth in Supabase Auth settings';
  RAISE NOTICE '  2. Set up email templates in Supabase';
  RAISE NOTICE '  3. Create Edge Functions for email sending';
END $$;
