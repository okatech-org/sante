# 👤 Create Test User Manually (Quick Fix)

## 🎯 Quick Solution to Login Now

Since the service role key needs to be updated, here's how to create a test user **RIGHT NOW** so you can login:

### Step 1: Go to Supabase Dashboard

https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users

### Step 2: Click "Add User" Button

(Top right corner, green button)

### Step 3: Fill in User Details

**Option A: Create Admin Account**
```
Email: test@sogara.com
Password: Test@2024!
✅ Auto Confirm User (CHECK THIS BOX!)
```

**Option B: Create Doctor Account**
```
Email: doctor@sogara.com
Password: Doctor@2024!
✅ Auto Confirm User (CHECK THIS BOX!)
```

### Step 4: Click "Create User"

### Step 5: Test Login

1. Go to: http://localhost:5173/login/professional
2. Enter the email and password you just created
3. Click "Sign In"

## ✅ It Should Work Now!

If you still get "Invalid login credentials", check:

1. Did you check "Auto Confirm User"? (This is critical!)
2. Did you use the exact password you set?
3. Is your dev server running? (`npm run dev`)
4. Did you wait a few seconds after creating the user?

## 🔧 Optional: Assign Role

By default, the user will be a "patient". To make them a professional:

### Via SQL Editor

1. Go to: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/sql
2. Paste this SQL (replace `test@sogara.com` with your email):

```sql
-- Find the user ID
SELECT id, email FROM auth.users WHERE email = 'test@sogara.com';

-- Copy the ID from the result, then run (replace USER_ID_HERE):
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'doctor')
ON CONFLICT DO NOTHING;

-- Optional: Create professional profile
INSERT INTO public.professionals (user_id, professional_type, etablissement, is_verified)
VALUES ('USER_ID_HERE', 'doctor', 'CMST SOGARA', true)
ON CONFLICT DO NOTHING;
```

3. Run the query

### Common Roles

- `doctor` - Médecin
- `medical_staff` - Infirmier/Personnel médical
- `pharmacy` - Pharmacien
- `laboratory` - Technicien de laboratoire
- `hospital` - Administrateur d'établissement
- `admin` - Administrateur système

## 🎯 Test With Pre-defined Accounts

Once you fix the service role key (see `FIX_CREDENTIALS.md`), you can create all 12 SOGARA accounts:

```bash
node create-sogara-users.js
```

This creates:
- 2 Administrators
- 4 Doctors
- 3 Nurses
- 1 Lab Technician
- 1 Pharmacist
- 1 Receptionist

See: `SOGARA_IDENTIFIANTS_COMPLETS.md` for full list.

## 🐛 Troubleshooting

### "Email not confirmed" error

- You must check "Auto Confirm User" when creating
- Or go back to the user in Dashboard → click "..." → "Send confirmation email"

### User created but can't login

1. Check password carefully (case-sensitive!)
2. Make sure you're on the Professional login page, not Patient login
3. Check browser console for detailed error message
4. Try creating a new user with a different email

### "Access denied" after login

The user doesn't have the right role:
- Professional login requires: `doctor`, `medical_staff`, `pharmacy`, `laboratory`, `hospital`, or `moderator`
- If you have `admin` or `patient` role, use the appropriate login page

### Still not working?

1. Check environment variables: `node check-env.js`
2. Verify Supabase URL is correct
3. Try restarting dev server: `pkill -f vite && npm run dev`
4. Check browser network tab for actual error response
5. Look at browser console for detailed error messages

## 📚 Next Steps

1. ✅ Create one test user manually (this guide)
2. 🔧 Fix service role key (`FIX_CREDENTIALS.md`)
3. 🚀 Create all SOGARA users (`node create-sogara-users.js`)
4. 🧪 Test the application fully

