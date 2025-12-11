# 🍼 BabyList Israel

## Complete Product Requirements Document - Version 6.0

### 🚀 MVP - 10 Day Sprint

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite + TypeScript |
| Backend | Supabase (Database + Auth + Edge Functions) |
| Hosting | GitHub Pages |
| Chrome Extension | Manifest V3 + React + Groq API (llama-3.3-70b-versatile) |
| i18n | react-i18next (English default, Hebrew support) |
| Email | Supabase + SendGrid/Resend |

**Language:** English (with i18n support for Hebrew)  
**Model:** Affiliate/Redirect Model (No payment processing in MVP)

---

## Table of Contents

1. [Executive Summary & Business Model](#1-executive-summary--business-model)
2. [User Onboarding Flow](#2-user-onboarding-flow)
3. [Authentication System](#3-authentication-system)
4. [Registry Setup & Partner Sharing](#4-registry-setup--partner-sharing)
5. [Chrome Extension Integration](#5-chrome-extension-integration)
6. [Mom's Dashboard](#6-moms-dashboard)
7. [Item Categories & Management](#7-item-categories--management)
8. [Public Registry View (Gift Givers)](#8-public-registry-view-gift-givers)
9. [Purchase Recording Flow](#9-purchase-recording-flow)
10. [Email Notification System](#10-email-notification-system)
11. [Database Schema (Supabase)](#11-database-schema-supabase)
12. [i18n Implementation](#12-i18n-implementation)
13. [Chrome Extension - Architecture](#13-chrome-extension---architecture)
14. [10-Day Development Timeline](#14-10-day-development-timeline)
15. [Post-MVP Roadmap](#15-post-mvp-roadmap)

---

## 1. Executive Summary & Business Model

### 1.1 Product Vision

BabyList Israel is a baby registry platform that allows expecting parents to create wish lists from any Israeli online store. Unlike traditional registries tied to specific retailers, our platform aggregates products from across the web using a browser extension.

### 1.2 MVP Business Model

For the MVP, we use a **Redirect/Affiliate model**:

- No payment processing - gift givers are redirected to original store URLs
- Trust-based purchase confirmation system
- Email verification of purchases after 3 hours
- Future potential for affiliate partnerships

### 1.3 Key Differentiators

- Add items from ANY Israeli online store
- Smart product extraction using AI
- Hebrew-first design with English support
- Privacy-focused address handling
- Real-time gift tracking and notifications

---

## 2. User Onboarding Flow

New users go through a personalized onboarding experience before creating their registry.

### 2.1 Onboarding Questions

The onboarding flow consists of three questions presented in a friendly, conversational manner:

#### Question 1: Journey Stage

> *"Where are you in your journey? When is the due date?"*

- Date picker for expected due date
- Optional: "I'm not sure yet" option
- **Used for:** Personalized content timing, shipping deadlines

#### Question 2: Parent Experience

> *"Are you a first-time parent?"*

- Yes / No toggle
- **Used for:** Content recommendations, tips shown in dashboard

#### Question 3: Emotional State

> *"How are you feeling about this whole registry thing?"*

- 🎉 So excited!
- 😅 A bit overwhelmed
- 🔍 Just exploring

- **Used for:** Tone of messaging, help prompts shown

### 2.2 Onboarding UI/UX

- Full-screen cards with smooth transitions
- Progress indicator (1/3, 2/3, 3/3)
- Skip option available (stores defaults)
- Warm, friendly illustrations

---

## 3. Authentication System

### 3.1 Sign Up Options

Users can create an account using either email/password or Google Sign-In:

#### Option A: Email Registration

Required fields:

1. First Name (text, required)
2. Last Name (text, required)
3. Email Address (email, required, unique)
4. Password (min 8 characters, required)

#### Option B: Google Sign-In

OAuth 2.0 flow with additional required fields:

- Google authentication provides email automatically
- User must still provide First Name and Last Name if not available from Google profile
- Pre-fill from Google profile when available

### 3.2 Sign In Flow

- Email + Password login
- Google Sign-In button
- "Forgot Password" link with email reset
- "Remember me" checkbox

---

## 4. Registry Setup & Partner Sharing

### 4.1 Partner Invitation (Optional)

After account creation, users can invite a partner to co-manage the registry:

**Partner Invitation Fields:**

- Partner's First Name (text, required)
- Partner's Last Name (text, required)
- Partner's Email (email, required)

**Partner Invitation Flow:**

- Email sent to partner with unique invite link
- Partner creates account or logs in
- Both users have full edit access to registry
- Skip option available - can add later

### 4.2 Download Extension Page

After registry creation, users see the extension download page:

**Page Content:**

- Hero section explaining the extension benefits
- "Add to Chrome" button (links to Chrome Web Store)
- Animated demo showing how extension works
- "Skip for now" link to proceed to dashboard
- Reminder shown in dashboard if skipped

### 4.3 Delivery Address Setup

Users are prompted to add their delivery address for gift shipments:

**Address Fields:**

- Street Address (text, required)
- Apartment/Suite (text, optional)
- City (text, required)
- Postal Code (text, optional)
- Phone Number (for delivery coordination)

**🔴 Privacy Toggle (CRITICAL FEATURE):**

- "Keep my address private" checkbox
- **When ENABLED:** Address hidden from gift givers - they must contact registry owner
- **When DISABLED:** Address shown to gift givers so they can ship directly
- **Default:** ENABLED (private) for safety

---

## 5. Chrome Extension Integration

### 5.1 Overview

The Chrome extension allows registry owners to add products from any Israeli online store directly to their registry.

### 5.2 How It Works

1. User browses to a product page on any store (Shilav, KSP, Amazon.co.il, etc.)
2. Clicks extension icon in browser toolbar
3. Extension extracts product data (meta tags first, AI fallback)
4. Popup shows extracted data for user review
5. User confirms/edits and adds to registry

### 5.3 Data Extracted

| Field | Source | Editable |
|-------|--------|----------|
| Product Name | Meta tags / AI | Yes |
| Price (₪) | Meta tags / AI | Yes - Manual approval required |
| Image URL | og:image / AI | Yes - Can select from multiple |
| Original URL | Current page URL | No (locked) |
| Store Name | Domain detection | No |
| Category | AI suggestion | Yes |

### 5.4 Additional Item Options

Users can set these options when adding items:

- **Most Wanted:** Badge shown prominently to gift givers
- **Private:** Item hidden from public view - for self-purchase
- **Quantity:** How many needed (default: 1)
- **Note:** Message for gift givers (size, color preferences)

---

## 6. Mom's Dashboard

The main dashboard is the registry owner's control center for managing their registry and tracking gifts.

### 6.1 Dashboard Header

- Welcome message with user's name
- Due date countdown
- Share registry button
- Settings icon

### 6.2 Gift Activity Feed

Real-time notifications when gifts are purchased:

- *"🎉 George bought you the stroller you wanted!"*
- *"🎁 Sarah reserved the Hatch sound machine"*
- Click to view gift details
- Filter by: All / This Week / Unread

### 6.3 Category Progress Bars

Visual progress indicators for each category showing completion status:

```
Feeding:    ████████░░ 8/10 items
Sleeping:   ██████░░░░ 6/10 items
Diapering:  ████░░░░░░ 4/10 items
```

### 6.4 Registry Statistics

| Metric | Description |
|--------|-------------|
| Total Items | Number of items in registry |
| Items Purchased | Number of items bought by gift givers |
| Total Value | Sum of all item prices |
| Value Received | Sum of purchased item prices |
| Completion % | Overall registry completion percentage |

### 6.5 Item Management

- Grid/List view toggle
- Filter by category
- Filter by status (Available / Purchased / Private)
- Sort by: Date added, Price, Priority, Category
- Bulk actions: Delete, Change category, Mark as purchased

---

## 7. Item Categories & Management

### 7.1 Category List

All items must be assigned to one of the following 9 categories:

| Category | Description | Example Items |
|----------|-------------|---------------|
| Feeding | Items for feeding baby | Bottles, breast pump, high chair, bibs |
| Sleeping | Sleep-related items | Crib, bassinet, sound machine, swaddles |
| Diapering | Diaper and changing items | Diapers, wipes, changing pad, diaper bag |
| Baby Gear | Transportation and carrying | Stroller, car seat, baby carrier, swing |
| Health & Safety | Health and safety items | Monitor, thermometer, first aid kit, baby-proofing |
| Bathing | Bath time essentials | Baby tub, towels, soap, lotion |
| Nursery & Decor | Room decoration items | Furniture, lighting, wall art, storage |
| Clothing | Baby clothes | Onesies, pajamas, socks, hats |
| Playing | Toys and activities | Playmat, rattles, books, activity gym |

### 7.2 Item Properties

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| name | string | Yes | Product name |
| price | number | Yes | Price in ₪ - manually approved |
| image_url | string | Yes | From extension scraping |
| original_url | string | Yes | Link to original product page |
| category | enum | Yes | One of 9 categories |
| quantity | number | Yes | Default: 1 |
| quantity_received | number | No | Default: 0 |
| is_most_wanted | boolean | No | Default: false |
| is_private | boolean | No | Default: false |
| notes | string | No | Note for gift givers |
| store_name | string | Yes | Auto-detected from URL |

---

## 8. Public Registry View (Gift Givers)

Gift givers access a read-only view of the registry via a shareable link.

### 8.1 Registry URL Structure

```
https://babylist.co.il/registry/{unique_slug}
```

- Slug is auto-generated from names (e.g., "maya-and-david")
- Can be customized by registry owner

### 8.2 Public View Features

- Registry owner names and due date
- All non-private items displayed
- "Most Wanted" items highlighted
- Filter by category
- Sort by price/priority
- Item status: Available / Purchased

### 8.3 Item Card (Gift Giver View)

Each item card shows:

- Product image
- Product name
- Price
- Store name
- "Most Wanted" badge (if applicable)
- Notes from registry owner
- "Buy This Gift" button

### 8.4 Shipping Address Display

- **If address is PUBLIC:** "Need Maya's shipping address?" link reveals full address
- **If address is PRIVATE:** "Contact Maya for shipping details" button (opens email)

---

## 9. Purchase Recording Flow

> ⚠️ **CRITICAL:** This is a trust-based system. Gift givers are redirected to external stores and self-report their purchases.

### 9.1 Purchase Flow Steps

**Step 1:** Gift giver clicks "Buy This Gift" on an item

**Step 2:** Modal appears: "You're headed to [Store Name]..."

Modal content:
- Store logo/icon
- Reminder: "After purchase, return here and click 'I've Purchased This'"
- "Need [Name]'s shipping address?" link (if address is public)
- "Continue to [Store]" button - opens original_url in new tab

**Step 3:** Gift giver completes purchase on external store

**Step 4:** Gift giver returns and clicks "I've Purchased This"

**Step 5:** Record Purchase Form appears:

Form fields:
- Your Name (required)
- Email Address (required - for confirmation)
- ☑️ "Send me gift ideas and deals from BabyList" (opt-in)
- ☐ "Keep this gift a surprise" checkbox
- "Continue" button

**Step 6:** Confirmation Page: "Your gift was recorded! 🎉"

Shows:
- Gift giver name
- Item purchased with image
- "Print" button - generates gift card
- Optional: Gift message field
- Optional: Return address for thank-you note

### 9.2 Email Confirmation (3-Hour Delay)

> ⚠️ **IMPORTANT:** To prevent false claims, we send a confirmation email 3 hours after purchase recording.

**Email content:**

- Subject: "Please confirm your gift purchase for [Registry Name]"
- Shows item they claimed to purchase
- "Yes, I purchased this" button - confirms the purchase
- "No, I did not purchase this" button - removes the claim
- Link expires after 7 days

### 9.3 Purchase States

| State | Description | Display |
|-------|-------------|---------|
| Available | No one has claimed purchase | Normal display, "Buy" button active |
| Pending Confirmation | Claimed but not confirmed | Show "Reserved" badge, dim card |
| Confirmed | Purchase verified via email | Show "Purchased" badge, disable button |
| Expired | Not confirmed within 7 days | Returns to Available state |

---

## 10. Email Notification System

### 10.1 Email Types

| Email Type | Trigger | Recipient | Timing |
|------------|---------|-----------|--------|
| Welcome Email | Account creation | Registry owner | Immediate |
| Partner Invitation | Owner invites partner | Partner | Immediate |
| Gift Reserved | Gift giver records purchase | Registry owner | Immediate |
| Purchase Confirmation | After gift recording | Gift giver | 3 hours delay |
| Gift Confirmed | Gift giver confirms | Registry owner | Immediate |
| Weekly Summary | Weekly digest | Registry owner | Weekly (Sunday) |
| Registry Reminder | No activity in 7 days | Registry owner | Weekly |

### 10.2 Email Templates

- All emails support Hebrew and English via i18n
- Responsive HTML templates
- Branded with BabyList Israel logo
- Unsubscribe link in all marketing emails

### 10.3 Purchase Confirmation Email (Critical)

Sent 3 hours after a gift giver records a purchase:

```
Subject: Please confirm your gift purchase for [Name]'s Baby Registry

Hi [Gift Giver Name],

Thanks for recording your gift purchase from [Name]'s baby registry!

You indicated that you purchased:
[Product Image]
[Product Name] - ₪[Price]
From: [Store Name]

Please confirm this purchase by clicking the button below:

[✓ YES, I PURCHASED THIS]    [✗ NO, I DID NOT PURCHASE THIS]

If you did not make this purchase, please click "No" so the item 
becomes available for others.

This confirmation helps ensure [Name] knows what gifts are on the way!

With love,
The BabyList Israel Team
```

---

## 11. Database Schema (Supabase)

### 11.1 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  due_date DATE,
  is_first_time_parent BOOLEAN DEFAULT true,
  feeling TEXT CHECK (feeling IN ('excited', 'overwhelmed', 'exploring')),
  preferred_language TEXT DEFAULT 'he',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11.2 Registries Table

```sql
CREATE TABLE registries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) NOT NULL,
  partner_id UUID REFERENCES users(id),
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  address_street TEXT,
  address_apt TEXT,
  address_city TEXT,
  address_postal TEXT,
  address_phone TEXT,
  address_is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11.3 Items Table

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID REFERENCES registries(id) NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  store_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'feeding', 'sleeping', 'diapering', 'baby_gear',
    'health_safety', 'bathing', 'nursery_decor', 'clothing', 'playing'
  )),
  quantity INTEGER DEFAULT 1,
  quantity_received INTEGER DEFAULT 0,
  is_most_wanted BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11.4 Purchases Table

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES items(id) NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  gift_message TEXT,
  is_surprise BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'cancelled', 'expired'
  )),
  confirmation_token UUID DEFAULT uuid_generate_v4(),
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11.5 Partner Invitations Table

```sql
CREATE TABLE partner_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registry_id UUID REFERENCES registries(id) NOT NULL,
  inviter_id UUID REFERENCES users(id) NOT NULL,
  invited_email TEXT NOT NULL,
  invited_first_name TEXT NOT NULL,
  invited_last_name TEXT NOT NULL,
  token UUID DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);
```

---

## 12. i18n Implementation

### 12.1 Overview

The application uses `react-i18next` for internationalization, with English as the default language and Hebrew as a secondary language.

### 12.2 Setup

```typescript
// i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import he from './locales/he.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
```

### 12.3 Translation File Structure

```json
// locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "continue": "Continue",
    "back": "Back",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "onboarding": {
    "question1": {
      "title": "Where are you in your journey?",
      "subtitle": "When is the due date?",
      "notSure": "I'm not sure yet"
    },
    "question2": {
      "title": "Are you a first-time parent?",
      "yes": "Yes",
      "no": "No"
    },
    "question3": {
      "title": "How are you feeling about this whole registry thing?",
      "excited": "So excited! 🎉",
      "overwhelmed": "A bit overwhelmed 😅",
      "exploring": "Just exploring 🔍"
    }
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "email": "Email Address",
    "password": "Password",
    "firstName": "First Name",
    "lastName": "Last Name",
    "forgotPassword": "Forgot Password?",
    "googleSignIn": "Continue with Google"
  },
  "registry": {
    "shareRegistry": "Share Registry",
    "addItem": "Add Item",
    "noItems": "No items yet. Install the extension to start adding!"
  },
  "categories": {
    "feeding": "Feeding",
    "sleeping": "Sleeping",
    "diapering": "Diapering",
    "baby_gear": "Baby Gear",
    "health_safety": "Health & Safety",
    "bathing": "Bathing",
    "nursery_decor": "Nursery & Decor",
    "clothing": "Clothing",
    "playing": "Playing"
  },
  "purchase": {
    "buyThisGift": "Buy This Gift",
    "headingTo": "You're headed to {{store}}...",
    "rememberToReturn": "After purchase, return here and click 'I've Purchased This'",
    "needAddress": "Need {{name}}'s shipping address?",
    "continueTo": "Continue to {{store}}",
    "recordPurchase": "Record your purchase",
    "yourName": "Your Name",
    "yourEmail": "Email Address",
    "keepSurprise": "Keep this gift a surprise",
    "giftRecorded": "Your gift was recorded! 🎉"
  }
}
```

### 12.4 Usage in Components

```tsx
// Example component using i18n
import { useTranslation } from 'react-i18next';

function PurchaseModal({ storeName }: { storeName: string }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('purchase.headingTo', { store: storeName })}</h2>
      <p>{t('purchase.rememberToReturn')}</p>
      <button>{t('purchase.continueTo', { store: storeName })}</button>
    </div>
  );
}
```

### 12.5 RTL Support

```tsx
// App.tsx - RTL support
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* App content */}
    </div>
  );
}
```

---

## 13. Chrome Extension - Architecture

### 13.1 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Manifest | Manifest V3 | Chrome's latest extension standard |
| Popup UI | React + TypeScript | User interface |
| Content Script | TypeScript | Page scraping |
| AI Model | Groq API (llama-3.3-70b) | Smart product extraction |
| Background | Service Worker | Background logic |

### 13.2 Hybrid Approach

The extension uses a hybrid approach to minimize AI costs:

**Step 1 - Meta Tags Extraction:**
- og:title, og:image, og:price
- JSON-LD structured data (schema.org/Product)
- itemprop attributes

**Step 2 - AI Fallback (if Step 1 fails):**
- Send relevant DOM elements to Groq API
- Maximum 4000 characters
- AI returns structured JSON

This approach saves **70-80%** of AI API calls.

### 13.3 File Structure

```
chrome-extension/
├── manifest.json          # Manifest V3 config
├── popup/
│   ├── popup.html         # Popup HTML
│   ├── popup.tsx          # React Popup component
│   └── popup.css          # Styles (RTL support)
├── content/
│   └── content.ts         # Content script - scraping
├── background/
│   └── service-worker.ts  # Background service worker
├── utils/
│   ├── scraper.ts         # Meta tags + AI scraping
│   ├── groq-client.ts     # Groq API integration
│   └── supabase-client.ts # Supabase integration
├── i18n/
│   ├── config.ts          # i18n setup
│   └── locales/           # Translation files
├── types/
│   └── product.ts         # TypeScript types
└── assets/
    └── icon-*.png         # Extension icons
```

### 13.4 Supported Stores

- Shilav (shilav.co.il)
- Motsesim (motsesim.co.il)
- KSP (ksp.co.il)
- Baby Star (baby-star.co.il)
- Super-Pharm (super-pharm.co.il)
- IKEA (ikea.co.il)
- Amazon.co.il
- And any other site with proper meta tags

---

## 14. 10-Day Development Timeline

### Days 1-2: Foundation

- Project setup (Vite + React + TypeScript)
- Supabase setup (tables, auth, RLS policies)
- i18n configuration
- Basic routing and layout

### Days 3-4: Authentication & Onboarding

- Sign up / Sign in pages
- Google OAuth integration
- Onboarding flow (3 questions)
- Partner invitation system

### Days 5-6: Registry & Dashboard

- Registry creation
- Address setup page
- Mom's dashboard with metrics
- Category progress bars
- Item management UI

### Days 7-8: Public View & Purchase Flow

- Public registry page
- Purchase modal and redirect flow
- Record purchase form
- Email notification system (Edge Functions)
- 3-hour confirmation email logic

### Day 9: Chrome Extension

- Extension project setup
- Content script (meta tag extraction)
- Groq API integration
- Popup UI
- Authentication in extension

### Day 10: Integration & Deploy

- Connect extension to Supabase
- End-to-end testing
- Bug fixes
- Deploy to GitHub Pages
- Submit extension to Chrome Web Store

---

## 15. Post-MVP Roadmap

### Phase 2: Enhanced Features

- Group gifting (multiple people contribute to expensive items)
- Cash fund option
- Thank you card generator
- Mobile app (React Native)
- Safari and Edge extensions

### Phase 3: Monetization

- Affiliate partnerships with Israeli stores
- Premium registry features
- Sponsored product recommendations
- Store integration partnerships

### Phase 4: Scale

- Direct store integrations (API)
- Inventory tracking
- Price comparison
- Reviews and recommendations
- Community features

---

## License

Proprietary - All rights reserved

---

<p align="center">
  <strong>🍼 BabyList Israel - MVP in 10 Days</strong><br>
  Good luck!
</p>