# 🔐 Login Error Solution - Complete Guide

## 🚨 The Error You're Seeing

```
POST https://bolidzesitkkfojdyuyg.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
[Login] AuthApiError: Invalid login credentials
```

## 🎯 Root Cause

**No users exist in your Supabase database yet**, and the service role key for creating them needs to be updated.

## ✅ Immediate Solution (5 minutes)

### Quick Fix: Create One Test User Manually

1. **Open Supabase Dashboard**:
   - https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users

2. **Click "Add User"**

3. **Enter Details**:
   ```
   Email: test@sogara.com
   Password: Test@2024!
   ✅ Auto Confirm User (IMPORTANT!)
   ```

4. **Click "Create User"**

5. **Test Login**:
   - Go to: http://localhost:5173/login/professional
   - Email: `test@sogara.com`
   - Password: `Test@2024!`

**✅ This should work immediately!**

📖 Detailed guide: [`CREATE_USER_MANUALLY.md`](./CREATE_USER_MANUALLY.md)

## 🔧 Complete Solution (15 minutes)

### Step 1: Fix Service Role Key

Your `.env.local` has an incorrect service role key format. 

**Current (wrong)**:
```env
SUPABASE_SERVICE_ROLE_KEY=sbp_95bc4523d2fb581aa170face59cf1fb261bca08f
```

**Should be (JWT format)**:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

#### Get the Correct Key:

1. Go to: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api
2. Find **"service_role" key** (labeled "secret")
3. Copy the entire key (starts with `eyJ...`, very long ~200+ chars)
4. Edit `.env.local`:
   ```bash
   code .env.local  # or nano, vim, etc.
   ```
5. Replace `SUPABASE_SERVICE_ROLE_KEY` with the copied value
6. Save the file

#### Verify:
```bash
node check-env.js
```

Both keys should start with `eyJhbGci...`

📖 Detailed guide: [`FIX_CREDENTIALS.md`](./FIX_CREDENTIALS.md)

### Step 2: Create SOGARA Demo Users

Once the key is fixed:

```bash
node create-sogara-users.js
```

This creates **12 professional accounts**:
- 2 Administrators
- 4 Doctors
- 3 Nurses
- 1 Lab Technician
- 1 Pharmacist
- 1 Receptionist

### Step 3: Test Login

Go to: http://localhost:5173/login/professional

**Test Accounts**:
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@sogara.com` | `Admin@SOGARA2024` |
| Doctor | `dr.okemba@sogara.com` | `Okemba@2024Med` |
| Nurse | `nurse.mba@sogara.com` | `MbaSI@2024` |

📖 Full account list: [`SOGARA_IDENTIFIANTS_COMPLETS.md`](./SOGARA_IDENTIFIANTS_COMPLETS.md)

## 📋 Checklist

- [ ] Environment variables configured (check with `node check-env.js`)
- [ ] Service role key is JWT format (starts with `eyJ...`)
- [ ] Test user created (manually or via script)
- [ ] User's email is confirmed (Auto Confirm User checked)
- [ ] Dev server is running (`npm run dev`)
- [ ] Login successful ✅

## 🐛 Troubleshooting

### Error: "Invalid API key"

Your `SUPABASE_SERVICE_ROLE_KEY` is wrong or incomplete.

**Fix**: See [FIX_CREDENTIALS.md](./FIX_CREDENTIALS.md)

### Error: "Invalid login credentials"

The user doesn't exist or password is wrong.

**Fix**: 
1. Create user manually: [CREATE_USER_MANUALLY.md](./CREATE_USER_MANUALLY.md)
2. Or verify user exists: `node verify-user-exists.js <email>`

### Error: "Email not confirmed"

You didn't check "Auto Confirm User" when creating.

**Fix**:
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user → click "..." → "Send confirmation email"
3. Or recreate with "Auto Confirm User" checked

### Error: "Access denied" (after successful login)

Wrong user role for the login page.

**Fix**:
- Professional login requires: `doctor`, `medical_staff`, `pharmacy`, `laboratory`, `hospital`, `moderator`
- If you have `patient` role, use: http://localhost:5173/login/patient
- If you have `admin`/`super_admin`, use: http://localhost:5173/superadmin/login

### Environment variables not loading

**Fix**:
```bash
# Verify .env.local exists
ls -la .env.local

# Check contents
cat .env.local

# Restart dev server (IMPORTANT!)
pkill -f vite
npm run dev
```

## 🎯 Quick Commands Reference

```bash
# Check environment configuration
node check-env.js

# Create all SOGARA users
node create-sogara-users.js

# Verify specific user exists
node verify-user-exists.js test@sogara.com

# List all users
node verify-user-exists.js

# Test SOGARA logins
node test-sogara-login.js

# Restart dev server
pkill -f vite && npm run dev
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [`ENV_SETUP_GUIDE.md`](./ENV_SETUP_GUIDE.md) | Complete environment setup |
| [`FIX_CREDENTIALS.md`](./FIX_CREDENTIALS.md) | Fix invalid API key error |
| [`CREATE_USER_MANUALLY.md`](./CREATE_USER_MANUALLY.md) | Create test user in Dashboard |
| [`SOGARA_IDENTIFIANTS_COMPLETS.md`](./SOGARA_IDENTIFIANTS_COMPLETS.md) | All 12 SOGARA accounts |
| [`ADMIN_SCRIPTS.md`](./ADMIN_SCRIPTS.md) | Admin scripts documentation |

## 🔑 Key Points

1. **Environment variables are required** - The app can't connect without them
2. **Service role key must be JWT format** - Starts with `eyJhbGci...`
3. **Users must exist in Supabase** - Create manually or via script
4. **Email must be confirmed** - Check "Auto Confirm User"
5. **Restart dev server after .env changes** - Vite caches environment

## 🆘 Still Need Help?

Check the browser console for detailed error messages:
- Press F12
- Go to Console tab
- Look for error details

Check the Network tab:
- Press F12
- Go to Network tab
- Look for failed `/token` request
- Check the Response for specific error

Common Supabase error messages:
- `Invalid login credentials` → User doesn't exist or wrong password
- `Email not confirmed` → Need to confirm email
- `Invalid API key` → Wrong service role key in .env.local
- `User not allowed` → Email/password auth not enabled in Supabase

## ✅ Success!

Once you can login successfully, you'll be redirected to:
- `/professional/select-establishment` (for professionals)
- `/dashboard/patient` (for patients)
- `/admin/dashboard` (for admins)

Enjoy using SANTE.GA! 🎉

