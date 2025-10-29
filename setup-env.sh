#!/bin/bash

# Setup script for SANTE.GA environment configuration
# This script creates the necessary .env.local file

echo "🔧 SANTE.GA Environment Setup"
echo "================================"
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Create .env.local file
cat > .env.local << 'EOF'
# Supabase Configuration
# Replace these with your actual Supabase project credentials
# Find them at: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api

VITE_SUPABASE_URL=https://bolidzesitkkfojdyuyg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY_HERE

# Service Role Key (NEVER expose this in client-side code)
# Only use for admin scripts and server-side operations
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Optional: For development
VITE_MONITORING_ENDPOINT=
EOF

echo "✅ Created .env.local file"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Edit .env.local and replace YOUR_ANON_KEY_HERE and YOUR_SERVICE_ROLE_KEY_HERE"
echo "2. Get your keys from: https://supabase.com/dashboard/project/bolidzesitkkfojdyuyg/settings/api"
echo "   - VITE_SUPABASE_PUBLISHABLE_KEY = 'anon' public key"
echo "   - SUPABASE_SERVICE_ROLE_KEY = 'service_role' key (keep secret!)"
echo "3. Restart your dev server: npm run dev"
echo ""
echo "🔐 Security reminder: Never commit .env.local to Git!"

