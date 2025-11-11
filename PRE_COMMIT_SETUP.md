# Pre-Commit Security Hook Setup

## Overview

This project uses Git pre-commit hooks to automatically run security checks before every commit, catching security issues immediately during development.

## What Gets Checked

Before each commit, the following security checks run automatically:

1. **Hardcoded Passwords** - Scans for password patterns in code
2. **JWT Verification** - Ensures critical functions have JWT enabled
3. **Environment Variables** - Checks for .env files in Git
4. **Sensitive Console Logs** - Detects console.log with passwords/tokens
5. **SQL Injection Patterns** - Looks for string concatenation in queries
6. **RLS Policies** - Verifies Row Level Security is enabled
7. **Service Role Key Exposure** - Ensures no service keys in client code

## Setup Instructions

### First-Time Setup

1. **Install Husky** (if not already installed):
   ```bash
   npm install
   ```

2. **Run the setup script**:
   ```bash
   bash scripts/setup-git-hooks.sh
   ```

3. **Verify installation**:
   ```bash
   # Test the security check manually
   bash scripts/local-security-check.sh
   ```

### What Happens on Commit

When you run `git commit`, the pre-commit hook will:

1. ✅ Run all security checks automatically
2. ❌ **Block the commit** if errors are found
3. ⚠️ **Allow commit with warnings** but display them
4. ✅ **Allow commit** if all checks pass

Example output:
```
🔒 Running security checks before commit...

==========================================
🔒 SANTE.GA Security Check
==========================================

1. Checking for hardcoded passwords...
✅ No hardcoded passwords detected

2. Checking edge function JWT verification...
✅ All critical functions have JWT enabled

... (more checks)

==========================================
✅ Security check PASSED
==========================================
```

## Bypassing the Hook (Emergency Only)

⚠️ **NOT RECOMMENDED** - Only use in emergencies:

```bash
git commit --no-verify -m "Emergency fix"
```

**Important**: Commits that bypass security checks will still be caught by the CI/CD pipeline and may fail the build.

## Troubleshooting

### Hook Not Running

If the pre-commit hook doesn't run:

1. Check if `.husky/pre-commit` exists and is executable:
   ```bash
   ls -la .husky/pre-commit
   chmod +x .husky/pre-commit
   ```

2. Verify Husky is initialized:
   ```bash
   npx husky init
   ```

3. Re-run the setup script:
   ```bash
   bash scripts/setup-git-hooks.sh
   ```

### Hook Fails Unexpectedly

1. Run the security check manually to see detailed errors:
   ```bash
   bash scripts/local-security-check.sh
   ```

2. Fix any reported errors before committing

3. If checks are invalid for your case, update `scripts/local-security-check.sh`

### Permission Denied

Make scripts executable:
```bash
chmod +x scripts/local-security-check.sh
chmod +x .husky/pre-commit
```

## CI/CD Integration

Pre-commit hooks provide **immediate feedback** during development, while the CI/CD pipeline provides:

- **Backup validation** if someone bypasses hooks
- **Deeper security scans** (TruffleHog, npm audit)
- **Pull request security checklists**
- **Daily scheduled scans**

Both work together for comprehensive security coverage.

## Disabling Hooks (Not Recommended)

If you need to temporarily disable hooks for your local development:

```bash
# Remove the pre-commit hook
rm .husky/pre-commit

# To restore later
bash scripts/setup-git-hooks.sh
```

## Benefits

✅ **Catch issues early** - Before code review, before CI/CD
✅ **Fast feedback** - Runs in seconds locally
✅ **Consistent standards** - Everyone runs the same checks
✅ **Reduced CI/CD failures** - Fewer pipeline failures
✅ **Better security habits** - Developers learn secure patterns

## Team Setup

For team members setting up the project:

1. Clone the repository
2. Run `npm install` (automatically sets up hooks via postinstall)
3. Start committing - hooks work automatically

The hooks are committed to the repository, so everyone gets them automatically after `npm install`.
