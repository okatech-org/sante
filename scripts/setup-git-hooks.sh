#!/bin/bash

# Setup Git Hooks for Security Checks
# This script initializes Husky and sets up pre-commit hooks

set -e

# Make this script executable
chmod +x "$0" 2>/dev/null || true

echo "=========================================="
echo "🔧 Setting up Git Hooks"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Run this script from the root of your git repository"
    exit 1
fi

# Initialize Husky
echo "1. Initializing Husky..."
npx husky init

# Create pre-commit hook
echo ""
echo "2. Creating pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔒 Running security checks before commit..."
echo ""

# Run the local security check script
if [ -f "scripts/local-security-check.sh" ]; then
  bash scripts/local-security-check.sh
else
  echo "❌ Security check script not found at scripts/local-security-check.sh"
  exit 1
fi
EOF

# Make the hook executable
chmod +x .husky/pre-commit

# Make the security check script executable
if [ -f "scripts/local-security-check.sh" ]; then
    chmod +x scripts/local-security-check.sh
    echo ""
    echo "3. Made security check script executable"
fi

echo ""
echo "=========================================="
echo "✅ Git hooks setup complete!"
echo "=========================================="
echo ""
echo "The pre-commit hook will now run security checks automatically before each commit."
echo ""
echo "To bypass the hook in emergencies (NOT RECOMMENDED), use:"
echo "  git commit --no-verify"
echo ""
echo "To test the hook manually, run:"
echo "  bash scripts/local-security-check.sh"
echo ""
