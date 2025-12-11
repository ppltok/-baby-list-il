# Authentication Setup Guide

## Complete Setup for Email/Password + Google OAuth Authentication

This guide covers all the configuration needed for authentication to work in **local development**, **GitHub Pages deployment**, and **Supabase**.

---

## 1. Supabase Configuration

### A. Database Tables

Make sure you have these tables created in Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  due_date DATE,
  is_first_time_parent BOOLEAN DEFAULT true,
  feeling TEXT CHECK (feeling IN ('excited', 'overwhelmed', 'exploring')),
  preferred_language TEXT DEFAULT 'en',
  onboarding_completed BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registries table
CREATE TABLE registries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Registries policies
CREATE POLICY "Users can view their own registries"
  ON registries FOR SELECT
  USING (auth.uid() = owner_id OR auth.uid() = partner_id);

CREATE POLICY "Users can update their own registries"
  ON registries FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own registries"
  ON registries FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Function to create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### B. Authentication Settings in Supabase Dashboard

Go to: **Authentication → URL Configuration**

#### For Local Development:
- **Site URL:** `http://localhost:5177`
- **Redirect URLs:** Add these URLs:
  ```
  http://localhost:5177/auth/callback
  http://localhost:5173/auth/callback
  http://localhost:5174/auth/callback
  http://localhost:5175/auth/callback
  http://localhost:5176/auth/callback
  http://localhost:5177/auth/callback
  ```

#### For Production (GitHub Pages):
- **Site URL:** `https://ppltok.github.io/-baby-list-il/`
- **Additional Redirect URLs:**
  ```
  https://ppltok.github.io/-baby-list-il/auth/callback
  https://ppltok.github.io/-baby-list-il/
  ```

### C. Google OAuth Provider Setup

Go to: **Authentication → Providers → Google**

1. **Enable Google Provider** - Toggle ON

2. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable **Google+ API**
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `BabyList Israel`

3. **Authorized JavaScript origins:**
   ```
   http://localhost:5177
   http://localhost:5173
   https://ppltok.github.io
   https://jkepvgifceschwnilmnq.supabase.co
   ```

4. **Authorized redirect URIs:**
   ```
   https://jkepvgifceschwnilmnq.supabase.co/auth/v1/callback
   http://localhost:5177/auth/callback
   https://ppltok.github.io/-baby-list-il/auth/callback
   ```

5. **Copy Client ID and Client Secret** and paste them into Supabase:
   - In Supabase Dashboard → Authentication → Providers → Google
   - Paste **Client ID** and **Client Secret**
   - Save

### D. Email Auth Settings

Go to: **Authentication → Providers → Email**

1. **Enable Email Provider** - Toggle ON
2. **Confirm Email:** Toggle ON (recommended)
3. **Email Template:** Customize if needed
4. **Save**

---

## 2. Local Environment Configuration

### A. `.env` File (Local Development)

Create/Update `/web/.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jkepvgifceschwnilmnq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZXB2Z2lmY2VzY2h3bmlsbW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODYwMjcsImV4cCI6MjA4MDk2MjAyN30.jh0BMcFiU7ZbjKFzaEpxx7jTvqAE9dXvTjkq-EU4oD0

# App Configuration - LOCAL DEVELOPMENT
VITE_APP_URL=http://localhost:5177
```

**Important:**
- The anon key is public and safe to commit
- Make sure `.env` is in `.gitignore` for production keys

### B. `.env.production` File (GitHub Pages)

Create `/web/.env.production` for production builds:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jkepvgifceschwnilmnq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZXB2Z2lmY2VzY2h3bmlsbW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODYwMjcsImV4cCI6MjA4MDk2MjAyN30.jh0BMcFiU7ZbjKFzaEpxx7jTvqAE9dXvTjkq-EU4oD0

# App Configuration - PRODUCTION (GitHub Pages)
VITE_APP_URL=https://ppltok.github.io/-baby-list-il
```

---

## 3. GitHub Pages Configuration

### A. Repository Settings

1. Go to your GitHub repository: `https://github.com/ppltok/-baby-list-il`
2. Go to **Settings → Pages**
3. **Source:** Deploy from branch
4. **Branch:** `gh-pages` / `/ (root)`
5. **Save**

### B. Deployment Command

Your `package.json` should have:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

To deploy:
```bash
cd /Users/tomargov/Projects/BabyList\ Israel/-baby-list-il/web
npm run deploy
```

### C. Base Path Configuration

Your `vite.config.ts` should have:

```typescript
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/-baby-list-il/' : '/',
  // ... rest of config
}))
```

---

## 4. Testing Authentication

### A. Test Email/Password Sign Up (Local)

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:5177`
3. Click **Sign Up**
4. Fill in:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
5. Click **Create Account**
6. Check email for confirmation link
7. Click confirmation link
8. Should redirect to onboarding

### B. Test Email/Password Sign In (Local)

1. Navigate to: `http://localhost:5177/auth/signin`
2. Enter email and password
3. Click **Sign In**
4. Should redirect to dashboard (if onboarding completed) or onboarding

### C. Test Google OAuth (Local)

1. Navigate to: `http://localhost:5177/auth/signin`
2. Click **Continue with Google**
3. Should open Google OAuth consent screen
4. Select your Google account
5. Should redirect to: `http://localhost:5177/auth/callback`
6. AuthCallback component processes the session
7. Should redirect to onboarding (first time) or dashboard

### D. Test on GitHub Pages (Production)

1. Deploy: `npm run deploy`
2. Wait 2-3 minutes for deployment
3. Navigate to: `https://ppltok.github.io/-baby-list-il/`
4. Test both email and Google sign-in
5. Verify redirects work correctly

---

## 5. Common Issues & Solutions

### Issue 1: "Invalid redirect URL"
**Solution:** Make sure the redirect URL is added to Supabase Dashboard → Authentication → URL Configuration

### Issue 2: Google OAuth opens but doesn't redirect back
**Solution:**
- Check Google Console → Credentials → Authorized redirect URIs
- Must include: `https://jkepvgifceschwnilmnq.supabase.co/auth/v1/callback`

### Issue 3: Email sign-in says "Invalid credentials" but password is correct
**Solution:**
- User might not have confirmed email
- Check Supabase Dashboard → Authentication → Users
- Look for email confirmation status

### Issue 4: After sign-in, stays on sign-in page
**Solution:**
- Check browser console for errors
- Verify AuthCallback component is working
- Check that `VITE_APP_URL` matches your current environment

### Issue 5: Profile not created after Google sign-in
**Solution:**
- Verify the `handle_new_user()` trigger is created in Supabase
- Check Supabase logs for errors
- Manually create profile if needed

### Issue 6: "Missing Supabase environment variables"
**Solution:**
- Restart dev server after changing `.env`
- Verify `.env` file is in `/web` directory (not root)
- Check that variables start with `VITE_`

---

## 6. Debugging Steps

### Check Supabase Connection
```typescript
// Add to any component temporarily
import { supabase } from './lib/supabase'

console.log('Supabase URL:', supabase.supabaseUrl)
console.log('Supabase Key:', supabase.supabaseKey.slice(0, 20) + '...')
```

### Check Auth State
```typescript
// Add to any component
import { useAuth } from './contexts/AuthContext'

const { user, isAuthenticated, isLoading } = useAuth()
console.log('Auth State:', { user, isAuthenticated, isLoading })
```

### Check Environment Variables
```typescript
// Add temporarily
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_APP_URL:', import.meta.env.VITE_APP_URL)
```

---

## 7. Current Configuration Summary

**Local Development:**
- URL: `http://localhost:5177`
- Supabase Project: `jkepvgifceschwnilmnq`
- Google OAuth: Enabled (need to add credentials)

**Production (GitHub Pages):**
- URL: `https://ppltok.github.io/-baby-list-il/`
- Base path: `/-baby-list-il/`
- Same Supabase project

**Next Steps:**
1. ✅ Verify Supabase tables are created
2. ✅ Add all redirect URLs to Supabase
3. ⚠️ Set up Google OAuth credentials
4. ✅ Create `.env.production` file
5. ✅ Test locally first
6. ✅ Deploy and test on GitHub Pages

---

## Need Help?

If authentication still doesn't work:
1. Check browser console for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify all URLs match exactly (no trailing slashes mismatch)
4. Test in incognito mode (clear cache issues)
