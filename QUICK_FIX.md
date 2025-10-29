# ⚡ QUICK FIX - Login Error

## 🚨 The Problem

```
AuthApiError: Invalid login credentials
```

## ✅ The Solution

**You need to create users in Supabase. They don't exist yet!**

---

## 🎯 Option 1: Quick Fix (5 minutes)

### Create ONE test user manually:

1. **Open**: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users

2. **Click**: "Add User" button (top right)

3. **Enter**:
   - Email: `test@sogara.com`
   - Password: `Test@2024!`
   - ✅ **CHECK "Auto Confirm User"** ← IMPORTANT!

4. **Click**: "Create User"

5. **Login**: http://localhost:5173/login/professional
   - Email: `test@sogara.com`
   - Password: `Test@2024!`

**✅ DONE! You can now login.**

---

## 🔧 Option 2: Complete Fix (15 minutes)

### Create 12 professional accounts:

**Step 1**: Fix the service role key

Your `.env.local` has this (WRONG):
```
SUPABASE_SERVICE_ROLE_KEY=sbp_95bc4523d2fb581aa170face59cf1fb261bca08f
```

Should be JWT format starting with `eyJ...`:

1. Go to: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api
2. Copy the **"service_role"** key (the secret one, very long)
3. Edit `.env.local`:
   ```bash
   code .env.local
   ```
4. Replace `SUPABASE_SERVICE_ROLE_KEY` with the copied key
5. Save

**Step 2**: Create all users

```bash
node create-sogara-users.js
```

**Step 3**: Test login

- Email: `admin@sogara.com`
- Password: `Admin@SOGARA2024`

---

## 📚 More Help

- **Full guide**: `LOGIN_ERROR_SOLUTION.md`
- **Fix API key**: `FIX_CREDENTIALS.md`
- **Manual creation**: `CREATE_USER_MANUALLY.md`
- **All 12 accounts**: `SOGARA_IDENTIFIANTS_COMPLETS.md`

---

## 🆘 Still Not Working?

### Check this:

1. **Did you check "Auto Confirm User"?** ← Most common mistake!
2. **Is your dev server running?** Run: `npm run dev`
3. **Are you using the correct password?** (case-sensitive)
4. **Are you on the right login page?** Use `/login/professional` for professionals

### Get detailed status:

```bash
node check-env.js           # Check environment
node verify-user-exists.js  # List all users
```

---

**That's it! Choose Option 1 or Option 2 and you'll be logged in within minutes.** 🎉

