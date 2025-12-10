# 🍼 Reshimat Tinok (רשימת תינוק)

> **Israeli Universal Baby Registry** - A BabyList competitor for the Israeli market

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)

## 📖 Overview

Reshimat Tinok is a universal baby registry platform designed specifically for the Israeli market. Parents can add products from **any Israeli store** (Shilav, Motsesim, KSP, Super-Pharm, etc.), share their registry with family and friends, and receive gifts without duplicates.

### The Problem

Israeli parents currently face a fragmented registry experience:
- Multiple store-specific wishlists
- Coordinating gifts via chaotic WhatsApp groups
- No centralized platform with Hebrew support
- Duplicate gifts and awkward conversations

### The Solution

A single platform where:
- ✅ Parents paste product URLs from any store → auto-extract details
- ✅ Guests view a beautiful Hebrew registry
- ✅ Guests purchase through our platform → we fulfill manually (concierge model)
- ✅ Everyone gets email notifications
- ✅ No duplicate gifts

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         TECH STACK                              │
├─────────────────────────────────────────────────────────────────┤
│  Frontend      │  React 18 + Vite + TypeScript + Tailwind CSS   │
│  Backend       │  Supabase (PostgreSQL + Auth + Edge Functions) │
│  Payments      │  Green Invoice (חשבונית ירוקה) - Israeli PSP   │
│  Emails        │  Resend                                        │
│  Hosting       │  GitHub Pages / Vercel                         │
│  Language      │  Hebrew (RTL) - Full localization              │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ Features

### For Parents (Registry Owners)
- 📝 Create personalized baby registry
- 🔗 Add items by pasting URLs (auto-scraping)
- ✏️ Manual item entry fallback
- 📊 Dashboard with purchase tracking
- 📤 One-click WhatsApp sharing
- 📧 Email notifications when gifts are purchased

### For Guests (Gift Givers)
- 👀 View registry without login
- 🔍 Filter by category, price, store, availability
- 💳 Secure checkout via Green Invoice
- 📦 Shipping to any address
- 🎁 Option to send anonymous gifts
- 💌 Add personal messages

### For Admin (You)
- 📋 Order management dashboard
- 🛒 Manual fulfillment workflow
- 📧 Automated email notifications
- 📊 Status tracking (paid → purchased → shipped → delivered)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Green Invoice account (with API access)
- Resend account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/reshimat-tinok.git
cd reshimat-tinok

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App URL (for redirects)
VITE_APP_URL=http://localhost:5173
```

For Supabase Edge Functions, set these secrets:

```bash
npx supabase secrets set GREEN_INVOICE_API_KEY=your-api-key
npx supabase secrets set GREEN_INVOICE_API_SECRET=your-api-secret
npx supabase secrets set RESEND_API_KEY=your-resend-key
npx supabase secrets set ADMIN_EMAIL=your@email.com
npx supabase secrets set APP_URL=https://your-domain.com
```

## 📁 Project Structure

```
reshimat-tinok/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, Signup, AuthContext
│   │   ├── dashboard/      # Owner dashboard components
│   │   ├── guest/          # Public registry view
│   │   ├── admin/          # Admin dashboard
│   │   └── ui/             # Shared UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts        # Utility functions
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Registry.tsx    # Public /r/:slug
│   │   └── Admin.tsx
│   ├── types/              # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── functions/
│   │   ├── create-payment/   # Green Invoice payment link
│   │   ├── green-invoice-webhook/  # Payment confirmation
│   │   └── scrape-url/       # URL product scraper
│   └── migrations/           # Database migrations
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🗄️ Database Schema

### Tables

#### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | References auth.users |
| email | text | User email |
| full_name | text | Display name |
| phone | text | Phone number |
| due_date | date | Expected delivery date |
| baby_gender | text | boy/girl/surprise/twins |

#### `registries`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to profiles |
| title | text | Registry title |
| slug | text | URL-friendly ID |
| is_public | boolean | Visibility |

#### `items`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| registry_id | uuid | FK to registries |
| name | text | Product name |
| price | numeric | Price in ILS |
| original_url | text | Store URL |
| image_url | text | Product image |
| store_name | text | Store name |
| category | text | gear/clothing/feeding/health/nursery |
| status | text | available/purchased |

#### `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| item_id | uuid | FK to items |
| buyer_name | text | Guest name |
| buyer_email | text | Guest email |
| shipping_address | text | Delivery address |
| amount_paid | numeric | Payment amount |
| status | text | pending/paid/purchased/shipped/delivered |

## 💳 Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. Guest clicks "Buy Gift" on item (₪1,500)
                    ↓
2. Guest fills: name, email, phone, shipping address
                    ↓
3. Frontend calls Edge Function: POST /create-payment
   Body: { item_id, item_name, item_price: 1500, buyer_info, shipping }
                    ↓
4. Edge Function:
   a. Creates order in DB (status: pending_payment)
   b. Calls Green Invoice API with DYNAMIC price
   c. Returns unique payment URL
                    ↓
5. Guest redirects to Green Invoice checkout
                    ↓
6. Guest pays with credit card
                    ↓
7. Green Invoice sends webhook to /green-invoice-webhook
                    ↓
8. Webhook handler:
   a. Updates order status → "paid"
   b. Updates item status → "purchased"
   c. Sends email to buyer (confirmation)
   d. Sends email to registry owner (notification)
   e. Sends email to admin (fulfillment request)
                    ↓
9. Guest sees success page
                    ↓
10. Admin manually purchases from store & ships
```

## 📧 Email Notifications

| Email | Recipient | Trigger |
|-------|-----------|---------|
| Purchase Confirmation | Buyer (guest) | After successful payment |
| Gift Notification | Registry owner | After successful payment |
| New Order Alert | Admin | After successful payment |
| Shipping Update | Buyer | When admin marks as shipped |
| Welcome | New user | After signup |

## 🛒 Supported Stores

| Store | Domain | Scraping Status |
|-------|--------|-----------------|
| Shilav | shilav.co.il | ✅ Supported |
| Motsesim | motsesim.co.il | ✅ Supported |
| Baby-Star | baby-star.co.il | ✅ Supported |
| Super-Pharm | super-pharm.co.il | 🔄 Partial |
| KSP | ksp.co.il | ✅ Supported |
| IKEA | ikea.co.il | 🔄 Partial |
| Bug | bug.co.il | ✅ Supported |
| Other | * | ✏️ Manual entry |

## 🚢 Deployment

### GitHub Pages

1. Update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/reshimat-tinok/',
  // ...
});
```

2. Add GitHub Actions workflow (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. Enable GitHub Pages in repository settings

### Deploy Edge Functions

```bash
npx supabase functions deploy create-payment
npx supabase functions deploy green-invoice-webhook
npx supabase functions deploy scrape-url
```

## 🧪 Testing

### Manual Test Cases

1. ✅ User signup with email
2. ✅ User login with Google OAuth
3. ✅ Profile completion
4. ✅ Registry creation
5. ✅ Add item via URL (Shilav)
6. ✅ Add item via URL (Motsesim)
7. ✅ Add item manually
8. ✅ Edit item
9. ✅ Delete item
10. ✅ View registry as guest
11. ✅ Filter items
12. ✅ Complete purchase flow (test mode)
13. ✅ Webhook processing
14. ✅ Email delivery (all 3 types)
15. ✅ WhatsApp sharing
16. ✅ Mobile responsiveness
17. ✅ RTL layout
18. ✅ Admin dashboard
19. ✅ Order status updates
20. ✅ Shipping notification email

## 🛣️ Roadmap

### MVP (Current)
- [x] User authentication
- [x] Registry CRUD
- [x] URL scraping (3 stores)
- [x] Guest view
- [x] Green Invoice payments
- [x] Email notifications
- [x] Admin dashboard
- [x] WhatsApp sharing

### v1.1 (Month 2)
- [ ] More store scrapers
- [ ] Price tracking alerts
- [ ] Custom domain
- [ ] Analytics dashboard

### v1.2 (Month 3)
- [ ] Group gifting (pool money for expensive items)
- [ ] Cash funds ("Contribute to nursery")
- [ ] Built-in checklist templates
- [ ] Thank-you note tracker

### v2.0 (Month 6)
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Store partnerships (affiliate)
- [ ] Premium tier

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [BabyList](https://www.babylist.com/) - Inspiration for the product
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Green Invoice](https://www.greeninvoice.co.il/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Resend](https://resend.com/) - Email delivery

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/reshimat-tinok](https://github.com/yourusername/reshimat-tinok)
- **Demo**: [https://yourusername.github.io/reshimat-tinok](https://yourusername.github.io/reshimat-tinok)

---

<div align="center">
  <p>Built with ❤️ for Israeli parents</p>
  <p>🍼 רשימת תינוק - כל המתנות במקום אחד</p>
</div>
