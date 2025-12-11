# BabyList Israel - Project Rules

## Design & UI Rules

### 1. No Emojis - Icons Only
**Rule:** Never use emojis in the UI. Always use Lucide React icons instead.

**Rationale:**
- Icons are more professional and consistent
- Better control over size, color, and styling
- More accessible for screen readers
- Consistent appearance across different platforms and devices

**Examples:**
```tsx
// ❌ BAD - Using emojis
<span>🍼</span>
<div>🎉</div>

// ✅ GOOD - Using Lucide icons
import { Baby, PartyPopper } from 'lucide-react'
<Baby className="w-6 h-6" />
<PartyPopper className="w-10 h-10" />
```

**Icon Replacements:**
- 🍼 Baby → `<Baby />`
- 🎉 Party → `<PartyPopper />`
- 📦 Package → `<Package />`
- ✨ Sparkles → `<Sparkles />`
- 📭 Mailbox → `<Inbox />`
- 🎁 Gift → `<Gift />`
- 👋 Wave → Use text or animation instead
- And so on...

## Code Quality Rules

### 2. Color Variables
Always use CSS custom properties (variables) for colors, never hardcoded hex values.

```tsx
// ❌ BAD
style={{ color: '#663A60' }}

// ✅ GOOD
style={{ color: 'var(--color-primary)' }}
```

### 3. Component Structure
- Keep components small and focused
- Use TypeScript for type safety
- Follow the established file structure

## Testing & Development Rules

### 4. Account Deletion for Testing
A Settings page with account deletion functionality is available at `/settings` to allow developers to easily test the onboarding flow by deleting their test accounts.

**Usage:**
1. Navigate to Settings from Dashboard
2. Scroll to "Danger Zone"
3. Click "Delete Account"
4. Confirm deletion
5. Account and all data will be permanently removed

## Accessibility Rules

### 5. Semantic HTML
Use appropriate HTML elements and ARIA labels for better accessibility.

### 6. Keyboard Navigation
Ensure all interactive elements are keyboard accessible.

---

**Last Updated:** December 2024
