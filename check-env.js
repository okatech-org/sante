#!/usr/bin/env node

/**
 * Check environment configuration for SANTE.GA
 * This script verifies that all required environment variables are set
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env.local
const envPath = join(__dirname, '.env.local');
const envExists = existsSync(envPath);

console.log('🔍 SANTE.GA Environment Check');
console.log('================================\n');

if (!envExists) {
  console.log('❌ .env.local file NOT FOUND!\n');
  console.log('📝 To fix this:');
  console.log('   1. Run: ./setup-env.sh');
  console.log('   2. Edit .env.local with your Supabase credentials');
  console.log('   3. Get credentials from: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api\n');
  process.exit(1);
}

console.log('✅ .env.local file found\n');

// Load the environment variables
dotenv.config({ path: envPath });

// Check required variables
const requiredVars = {
  'VITE_SUPABASE_URL': {
    value: process.env.VITE_SUPABASE_URL,
    description: 'Supabase project URL',
    example: 'https://bolidzesitkkfojdyuyg.supabase.co'
  },
  'VITE_SUPABASE_PUBLISHABLE_KEY': {
    value: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    description: 'Supabase anon/public key (safe to expose)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    value: process.env.SUPABASE_SERVICE_ROLE_KEY,
    description: 'Supabase service role key (keep secret!)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    optional: true
  }
};

let allGood = true;

console.log('Environment Variables Status:\n');

for (const [key, config] of Object.entries(requiredVars)) {
  const isSet = config.value && config.value !== 'YOUR_ANON_KEY_HERE' && config.value !== 'YOUR_SERVICE_ROLE_KEY_HERE';
  const status = isSet ? '✅' : (config.optional ? '⚠️ ' : '❌');
  const label = config.optional ? 'OPTIONAL' : 'REQUIRED';
  
  console.log(`${status} ${key} [${label}]`);
  console.log(`   ${config.description}`);
  
  if (isSet) {
    const preview = config.value.length > 50 
      ? config.value.substring(0, 47) + '...' 
      : config.value;
    console.log(`   Value: ${preview}`);
  } else {
    console.log(`   ⚠️  Not set or using placeholder value`);
    if (!config.optional) {
      allGood = false;
    }
  }
  console.log();
}

console.log('================================\n');

if (allGood) {
  console.log('🎉 All required environment variables are configured!\n');
  console.log('✅ You can now:');
  console.log('   - Start the dev server: npm run dev');
  console.log('   - Run admin scripts: node add-superadmin.js <email>');
  console.log('   - Create SOGARA staff: node add-cmst-sogara-staff.js\n');
} else {
  console.log('❌ Missing required environment variables!\n');
  console.log('📝 To fix:');
  console.log('   1. Edit .env.local');
  console.log('   2. Get your keys from: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api');
  console.log('      - API Settings → Project API keys');
  console.log('      - Copy the "anon" key to VITE_SUPABASE_PUBLISHABLE_KEY');
  console.log('      - Copy the "service_role" key to SUPABASE_SERVICE_ROLE_KEY');
  console.log('   3. Save the file and restart your dev server\n');
  process.exit(1);
}

