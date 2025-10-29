#!/usr/bin/env node

/**
 * Verify if a user exists in Supabase
 * Usage: node verify-user-exists.js <email>
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('   Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const emailToCheck = process.argv[2];

if (!emailToCheck) {
  console.log('📧 Listing all users in the database...\n');
  
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  if (!data.users || data.users.length === 0) {
    console.log('❌ No users found in the database!\n');
    console.log('💡 To create users:');
    console.log('   1. Via Supabase Dashboard: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users');
    console.log('   2. Via script: node add-cmst-sogara-staff.js');
    console.log('   3. Via signup page: http://localhost:5173/register/professional');
    process.exit(0);
  }
  
  console.log(`✅ Found ${data.users.length} user(s):\n`);
  
  data.users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email || user.phone || 'No identifier'}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
    console.log(`   Confirmed: ${user.email_confirmed_at ? '✅ Yes' : '❌ No'}`);
    console.log(`   Last sign in: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
    console.log();
  });
  
  console.log('💡 To check a specific user: node verify-user-exists.js <email>');
  
} else {
  console.log(`🔍 Checking if user exists: ${emailToCheck}\n`);
  
  // Try to find the user
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  const user = data.users.find(u => u.email === emailToCheck);
  
  if (!user) {
    console.log(`❌ User not found: ${emailToCheck}\n`);
    console.log('💡 To create this user:');
    console.log(`   1. Via Supabase Dashboard: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users`);
    console.log('      - Click "Add user"');
    console.log(`      - Email: ${emailToCheck}`);
    console.log('      - Password: (choose a password)');
    console.log('      - ✅ Enable "Auto Confirm User"');
    console.log();
    console.log('   2. Or run: node add-cmst-sogara-staff.js (for SOGARA demo accounts)');
    process.exit(1);
  }
  
  console.log('✅ User found!\n');
  console.log(`Email: ${user.email}`);
  console.log(`ID: ${user.id}`);
  console.log(`Created: ${new Date(user.created_at).toLocaleString()}`);
  console.log(`Email confirmed: ${user.email_confirmed_at ? '✅ Yes' : '❌ No (THIS MIGHT BE THE ISSUE!)'}`);
  console.log(`Last sign in: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);
  
  if (!user.email_confirmed_at) {
    console.log('\n⚠️  EMAIL NOT CONFIRMED!');
    console.log('This is likely why login is failing.');
    console.log('\n💡 To fix:');
    console.log('   1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/auth/users');
    console.log('   2. Find the user');
    console.log('   3. Click the "..." menu');
    console.log('   4. Select "Send confirmation email" or manually confirm');
    console.log('\n   OR disable email confirmation requirement:');
    console.log('   Authentication → Providers → Email → Disable "Enable email confirmations"');
  }
  
  // Check user roles
  console.log('\n🔑 Checking user roles...');
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);
  
  if (rolesError) {
    console.log('   ⚠️  Error fetching roles:', rolesError.message);
  } else if (!roles || roles.length === 0) {
    console.log('   ℹ️  No roles assigned (patient by default)');
  } else {
    console.log('   Roles:', roles.map(r => r.role).join(', '));
  }
}

