This is a comprehensive, professional-grade Product Requirements Document (PRD) designed for developers and stakeholders. It breaks down the logic, database structure, and user flows specifically for your Supabase/React stack.

Product Requirements Document (PRD)
Project Name: BabyList Israel (MVP) Version: 1.0.0 Status: Approved for Development Tech Stack: React (Vite), Supabase (Auth/DB/Storage/Edge Functions), GitHub Pages.

1. Executive Summary
BabyList Israel is a universal baby registry aggregator allowing expectant parents in Israel to curate a single wishlist from disparate retailers (Shilav, Motsesim, Super-Pharm, Baby-Star).

The Core Problem: Israeli parents currently manage multiple carts on different sites or use basic spreadsheets/WhatsApp groups to coordinate gifts. The Solution: A centralized dashboard where parents can add items via URL link, and guests can view availability and mark items as "Purchased" to prevent duplicates.

2. User Personas & Flows
2.1 The Expectant Mother (Admin)
Goal: Create a registry, populate it easily, and share it.

Pain Point: Entering product details manually is tedious.

Key Flow: Login → Dashboard → Paste URL from Shilav → Auto-populate Data → Save to List.

2.2 The Guest (Viewer)
Goal: Buy a gift the parents actually need, within budget, without asking "do you have this yet?"

Key Flow: Open Shared Link → Filter by Price → Click "Buy" → Redirect to Store → Confirm Purchase on App.

3. Functional Requirements
3.1 Authentication & Onboarding
Provider: Supabase Auth.

Methods: Email/Password (Magic Link preferred for ease) and Google OAuth.

Onboarding Data Collection:

Full Name (Required)

Expected Due Date (Required - for "days left" countdown).

Baby Gender (Optional - for UI theming).

3.2 Registry Management (The "Mother" Dashboard)
Universal Link Parser (The Core Feature):

Input: A text field accepting URLs from supported domains (shilav.co.il, motsesim.co.il, baby-star.co.il, shop.super-pharm.co.il).

Process:

User pastes link.

App triggers a Supabase Edge Function (to avoid CORS errors).

Function fetches HTML and parses og:image, og:title, og:price (or specific DOM selectors for these 4 sites).

Fallback: If parsing fails, user enters details manually (Image Upload, Title, Price).

Default Essentials List:

A pre-seeded database of "Must Haves" (Stroller, Crib, Diapers).

User sees "Missing Items" sidebar. Clicking "Add Stroller" opens a modal to paste a link or browse a generic placeholder.

Edit/Delete: User can edit price, quantity needed (e.g., 5 packs of diapers), and priority (High/Med/Low).

3.3 The Guest Experience (Public View)
Access: No login required for Guests (Read-only access via RLS).

Filtering:

By Category (Gear, Clothing, Hygiene).

By Store (Shilav only, etc.).

By Status (Available vs. Purchased).

The "Reservation" Logic:

Button: "I want to buy this."

Action: Item status changes to "Reserved" for 1 hour (temporary lock) or immediately prompts for confirmation.

Redirect: Opens original product URL in new tab.

Confirmation Modal: "Did you buy this item?"

Yes: Status → Purchased.

No: Status → Available.

3.4 Sharing
Unique URL: myapp.github.io/?registry_id=UUID

Social Share: WhatsApp and Copy Link buttons.

4. Technical Architecture & Database Schema

Getty Images
Since you are using Supabase, strict schema definitions and Row Level Security (RLS) are critical.

4.1 Database Tables
Table: profiles
Extends the default auth.users table. | Column | Type | Description | | :--- | :--- | :--- | | id | uuid | PK, references auth.users.id | | full_name | text | Display name | | due_date | date | For countdown logic | | avatar_url | text | Profile picture path | | created_at | timestamptz | Account creation date |

Table: registries
One-to-one with profiles (future proofing for multiple lists). | Column | Type | Description | | :--- | :--- | :--- | | id | uuid | PK, Default: uuid_generate_v4() | | user_id | uuid | FK, references profiles.id | | title | text | e.g., "Sarah's Baby Shower" | | slug | text | unique string for sharing (optional) | | is_public | boolean | Default: true |

Table: items
The core product list. | Column | Type | Description | | :--- | :--- | :--- | | id | uuid | PK | | registry_id | uuid | FK, references registries.id | | original_url | text | The link to the store | | name | text | Product title | | price | numeric | Price in ILS (Shekels) | | store_name | text | Enum/Text: 'Shilav', 'Super-Pharm', etc. | | category | text | 'Gear', 'Feeding', 'Clothing', 'Health' | | image_url | text | Scraped URL or Supabase Storage path | | is_purchased | boolean | Default: false | | purchased_by | text | Optional: Name of guest (free text) | | created_at | timestamptz | For sorting order |

4.2 Row Level Security (RLS) Policies
Profiles: Users can only update their own profile. Everyone can read (for the header of the registry).

Items:

INSERT/UPDATE/DELETE: Only the user_id matching the registry owner can modify item details.

UPDATE (Guest Exception): Public users (Guests) can only update the is_purchased and purchased_by columns. (This requires a specific Supabase Postgres Function or careful policy crafting).

SELECT: Everyone can read items if registries.is_public is true.

5. UI/UX Design System
Visual Identity: "Neutral Earth" Framework: Tailwind CSS

5.1 Color Palette
Background: bg-stone-50 (Warm White/Beige)

Cards/Elements: bg-white

Primary Text: text-stone-800 (Dark Grey/Brown)

Accent/Buttons: bg-[#954535] (Chestnut/Rust)

Secondary Accent: text-[#D2B48C] (Tan/Sand)

5.2 Layout Structure
Header: Logo (Left), Navigation (Right - "My List", "Share").

Hero (Mom View): "Welcome Sarah, 45 Days until baby arrives!" + "Add Item" big button.

Grid: Masonry or flexible grid of product cards.

Card UI:

Image (Top, Cover).

Store Logo (Small badge top-right).

Title (Truncated 2 lines).

Price (Bold Chestnut color).

Action: "Edit" (Mom) vs "Gift This" (Guest).

6. Implementation Roadmap (MVP)
Phase 1: Setup & Auth (Days 1-2)
Initialize React + Vite project.

Setup Supabase Project.

Implement Login/Signup pages.

Create Database Tables.

Phase 2: The Dashboard & Manual Add (Days 3-4)
Build the Main Dashboard layout (Beige theme).

Create "Add Item" modal (Manual entry first: Name, Price, URL, Image Upload).

Implement "Read" connection to display items from Supabase.

Phase 3: The Scraper (Days 5-6)
Write a Supabase Edge Function (using Deno/Node) that takes a URL, fetches the HTML, and uses a library like cheerio or jsdom to grab og:image.

Connect "Add Item" input to this function.

Phase 4: Guest View & Logic (Days 7-8)
Create the public route /:registry_id.

Implement the "Mark as Purchased" toggle.

Test RLS policies to ensure guests can't delete items.

7. Edge Cases & Risks
Broken Links: If Shilav changes their URL structure, the link might break.

Mitigation: Store the item details statically in your DB. Only use the link for the redirect, don't rely on it for displaying the image/title dynamically every time.

Scraping Blockers: Some sites block scrapers (Super-Pharm has high security).

Mitigation: If the auto-scraper fails, the UI must gracefully downgrade to "Please fill in the details manually."

Currency: Assume ILS (₪) for all items for the MVP.

8. Specific URL Patterns (for Scraper)
Shilav: https://www.shilav.co.il/product-name -> Look for meta property="og:image"

Super-Pharm: https://shop.super-pharm.co.il/... -> Requires User-Agent mocking in the Edge Function.

Motsesim: https://motsesim.co.il/product/... -> Standard OpenGraph tags usually present.
