# 🔧 Fix Invalid API Key Error

## Problem

You're seeing "Invalid API key" errors when trying to create users. This means the `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` is incorrect or incomplete.

## ✅ Solution: Get the Correct Supabase Keys

### Step 1: Open Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Select your project: **bolidzesitkkfojdyuyg**

### Step 2: Navigate to API Settings

1. Click **Settings** (gear icon in sidebar)
2. Click **API**
3. You'll see two sections:

#### Project URL
```
https://bolidzesitkkfojdyuyg.supabase.co
```
✅ This should be in `VITE_SUPABASE_URL` (already correct)

#### API Keys

You'll see two keys:

**1. `anon` `public` key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- This is safe to expose in your frontend
- Copy this to `VITE_SUPABASE_PUBLISHABLE_KEY`

**2. `service_role` `secret` key** (also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- ⚠️ **KEEP THIS SECRET** - never expose in frontend!
- Copy this to `SUPABASE_SERVICE_ROLE_KEY`
- This key bypasses Row Level Security
- Only use in server-side scripts

### Step 3: Update .env.local

Edit your `.env.local` file:

```bash
# Open in your editor
nano .env.local
# or
code .env.local
# or
vim .env.local
```

Replace with the correct values:

```env
VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
```

### Step 4: Verify

Run the check script:

```bash
node check-env.js
```

You should see both keys displayed (truncated). Both should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🔍 Key Format Reference

### ❌ WRONG Format
```
sbp_95bc4523d2fb581aa170face59cf1fb261bca08f
```
This is NOT a valid Supabase key format!

### ✅ CORRECT Format
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbGlkemVzaXRra2ZvamR5dXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTMxMzUsImV4cCI6MjA3NDkyOTEzNX0.bKmwG96ju8nRHLOizeMtp-VleN658wI6CpOkCChgc2A
```
This is a JWT token - the correct format for Supabase keys!

## 🚀 After Fixing

Once you have the correct keys:

### 1. Create SOGARA Users

```bash
node create-sogara-users.js
```

This will create 12 demo accounts for testing.

### 2. Test Login

Go to: http://localhost:5173/login/professional

Try logging in with:
- **Email**: `admin@sogara.com`
- **Password**: `Admin@SOGARA2024`

### 3. Restart Dev Server

```bash
# Kill current server
pkill -f vite

# Start fresh
npm run dev
```

## 🆘 Still Having Issues?

### Can't find API keys?

1. Make sure you're logged into the correct Supabase account
2. Verify you have access to the project
3. If you don't have access, ask the project owner to invite you
4. Check Settings → API → scroll down to see both keys

### Keys not working?

1. Make sure you copied the ENTIRE key (they're very long, ~200+ characters)
2. No extra spaces before or after the key
3. No quotes around the key in .env.local
4. Restart any running scripts after updating .env.local

### Creating users manually instead

If you can't get the service role key, you can create users manually:

1. Go to: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users
2. Click **"Add user"**
3. Enter email and password
4. **✅ CHECK "Auto Confirm User"**
5. Click "Create User"

Then you can login with that account!

## 📚 Documentation

- [Supabase API Settings](https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api)
- [SOGARA Accounts List](./SOGARA_IDENTIFIANTS_COMPLETS.md)
- [Environment Setup Guide](./ENV_SETUP_GUIDE.md)

