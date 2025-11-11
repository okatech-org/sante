#!/bin/bash

# Local Security Check Script
# Run this before committing security-sensitive changes

set -e

echo "=========================================="
echo "🔒 SANTE.GA Security Check"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Check for hardcoded passwords
echo "1. Checking for hardcoded passwords..."
if grep -r "password.*=.*['\"].*['\"]" --include="*.ts" --include="*.js" --include="*.sql" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | grep -v "placeholder" | grep -v "example"; then
    echo -e "${RED}❌ ERROR: Found potential hardcoded passwords${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No hardcoded passwords detected${NC}"
fi
echo ""

# 2. Check JWT verification in config.toml
echo "2. Checking edge function JWT verification..."
CRITICAL_FUNCTIONS=("create-initial-users" "fix-minister-role" "create-demo-doctor" "generate-decree-with-ai")

for func in "${CRITICAL_FUNCTIONS[@]}"; do
    if grep -A 1 "\[functions.$func\]" supabase/config.toml 2>/dev/null | grep -q "verify_jwt = false"; then
        echo -e "${RED}❌ ERROR: Critical function '$func' has JWT disabled${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All critical functions have JWT enabled${NC}"
fi
echo ""

# 3. Check for secrets in .env
echo "3. Checking for .env in Git..."
if git ls-files 2>/dev/null | grep -q "\.env$"; then
    echo -e "${RED}❌ ERROR: .env file is tracked in Git${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No .env files in Git${NC}"
fi
echo ""

# 4. Check for console.log with sensitive data
echo "4. Checking for console.log with sensitive data..."
if grep -r "console\.log.*password\|console\.log.*token\|console\.log.*secret" --include="*.ts" --include="*.tsx" --include="*.js" src/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  WARNING: Found console.log with potentially sensitive data${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ No sensitive console.log detected${NC}"
fi
echo ""

# 5. Check for SQL injection patterns
echo "5. Checking for SQL injection risks..."
if grep -r "SELECT.*+\|INSERT.*+\|UPDATE.*+\|DELETE.*+" --include="*.ts" --include="*.js" supabase/functions/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  WARNING: Potential SQL injection risk detected${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ No SQL injection patterns detected${NC}"
fi
echo ""

# 6. Check RLS policies
echo "6. Checking for RLS policies..."
if ! grep -r "ENABLE ROW LEVEL SECURITY" supabase/migrations/ 2>/dev/null >/dev/null; then
    echo -e "${YELLOW}⚠️  WARNING: No RLS policies found${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ RLS policies found${NC}"
fi
echo ""

# 7. Check for exposed Supabase keys
echo "7. Checking for service role key exposure..."
if grep -r "SUPABASE_SERVICE_ROLE_KEY" --include="*.ts" --include="*.tsx" --include="*.js" src/ 2>/dev/null; then
    echo -e "${RED}❌ ERROR: Service role key found in client code${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No service role key in client code${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "${RED}Errors: $ERRORS${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Security check FAILED${NC}"
    echo "Please fix the errors above before committing."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Security check passed with warnings${NC}"
    echo "Review warnings before committing."
    exit 0
else
    echo -e "${GREEN}✅ Security check PASSED${NC}"
    exit 0
fi
