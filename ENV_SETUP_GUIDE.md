# 🔧 Environment Setup Guide - SANTE.GA

## 🚨 Problem: "Invalid login credentials" Error

You're seeing this error because the Supabase environment variables are not configured. The app can't connect to your Supabase backend.

```
POST https://bolidzesitkkfojdyuyg.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
[Login] AuthApiError: Invalid login credentials
```

## ✅ Solution: Configure Environment Variables

### Step 1: Create .env.local File

Run the setup script:

```bash
./setup-env.sh
```

Or manually create `.env.local` in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

### Step 2: Get Your Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **bolidzesitkkfojdyuyg**
3. Navigate to **Settings → API**
4. You'll see two important keys:

   - **`anon` / `public`** key → Copy this to `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **`service_role`** key → Copy this to `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Update .env.local

Edit `.env.local` and replace the placeholder values:

```env
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```

### Step 4: Verify Configuration

Run the check script:

```bash
node check-env.js
```

You should see:

```
✅ All required environment variables are configured!
```

### Step 5: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## 🔐 Security Notes

- **NEVER commit `.env.local` to Git** (it's already in `.gitignore`)
- The `VITE_SUPABASE_PUBLISHABLE_KEY` is safe to expose in client-side code
- The `SUPABASE_SERVICE_ROLE_KEY` **must remain secret** - only use in server-side scripts
- The `service_role` key bypasses Row Level Security (RLS) - handle with care!

## 🧪 Test Login After Setup

Once environment is configured, you need test users. Create them with:

### Option 1: Create SOGARA Demo Staff

```bash
node add-cmst-sogara-staff.js
```

This creates:
- `medecin.cmst@sogara.ga` / `Demo2025!` (Doctor)
- `infirmiere.cmst@sogara.ga` / `Demo2025!` (Nurse)
- `admin.cmst@sogara.ga` / `Demo2025!` (Admin)

### Option 2: Create Custom User

Use Supabase Dashboard:
1. Go to **Authentication → Users**
2. Click **Add user**
3. Enter email and password
4. **Enable "Auto Confirm User"** (important!)
5. Save

### Option 3: Create Super Admin

```bash
node add-superadmin.js your-email@example.com
```

Note: The user must exist in Supabase first (create via Dashboard or signup).

## 🐛 Troubleshooting

### Error: "Invalid login credentials" persists

**Causes:**
1. User doesn't exist in Supabase → Create the user first
2. Email not confirmed → Enable "Auto Confirm User" in Supabase settings or confirm manually
3. Wrong password → Reset password or recreate user
4. Wrong Supabase project → Verify the URL matches your project

**Fix:**
```bash
# 1. Check your environment
node check-env.js

# 2. Verify user exists in Supabase Dashboard
# Go to: Authentication → Users

# 3. Try creating a new test user
# In Supabase Dashboard: Add user + Auto Confirm User

# 4. Try login with the new user
```

### Error: "Variables manquantes dans .env.local"

The `.env.local` file is missing or incomplete.

**Fix:**
```bash
./setup-env.sh
# Then edit .env.local with real keys
node check-env.js
```

### Error: Dev server not picking up changes

Vite caches environment variables. Restart the dev server:

```bash
# Kill the process completely
pkill -f vite

# Start fresh
npm run dev
```

### Error: "Cannot find module 'dotenv'"

Install dependencies:

```bash
npm install
```

## 📚 Related Documentation

- [ADMIN_SCRIPTS.md](./ADMIN_SCRIPTS.md) - Admin user management scripts
- [START_HERE.md](./START_HERE.md) - Project overview
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment

## 🎯 Quick Start Checklist

- [ ] Run `./setup-env.sh`
- [ ] Get Supabase keys from Dashboard
- [ ] Update `.env.local` with real keys
- [ ] Run `node check-env.js` to verify
- [ ] Restart dev server: `npm run dev`
- [ ] Create test user in Supabase Dashboard (with Auto Confirm)
- [ ] Try logging in
- [ ] (Optional) Create SOGARA demo staff: `node add-cmst-sogara-staff.js`

## 🆘 Still Having Issues?

Check these files for more context:
- `src/integrations/supabase/client.ts` - Supabase client initialization
- `src/lib/auth.ts` - Authentication service
- `src/pages/LoginProfessional.tsx` - Professional login page

The error originates from:
```typescript
// src/lib/auth.ts line 42
const { data, error } = await supabase.auth.signInWithPassword({
  email: identifier,
  password,
});
```

If `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` are undefined, the Supabase client can't connect, resulting in authentication failures.

