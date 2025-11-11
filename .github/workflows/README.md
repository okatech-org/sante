# CI/CD Security Workflows

This directory contains automated security scanning workflows for the SANTE.GA project.

## Workflows

### 1. Security Scan (`security-scan.yml`)

Runs comprehensive security checks on every push and PR:

- **Secret Detection**: Uses TruffleHog to detect leaked credentials
- **Supabase Security**: Verifies JWT settings and RLS policies
- **Dependency Scan**: Checks for vulnerable npm packages
- **Code Analysis**: Detects sensitive data in logs and code
- **Input Validation**: Checks for proper validation in edge functions

**Triggers:**
- Push to main/master/develop branches
- Pull requests
- Daily at 2 AM UTC (scheduled scan)

### 2. PR Security Comment (`pr-security-comment.yml`)

Automatically posts a security checklist on PRs that modify security-sensitive files:

- `supabase/functions/`
- `supabase/config.toml`
- `supabase/migrations/`
- `src/lib/auth.ts`

The checklist ensures reviewers verify all security requirements.

## Local Testing

Before pushing changes, run the local security check:

```bash
# Make script executable (first time only)
chmod +x scripts/local-security-check.sh

# Run security check
./scripts/local-security-check.sh
```

This performs the same checks as CI but locally, catching issues faster.

## Pre-commit Hook (Optional)

To automatically run security checks before commits:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
./scripts/local-security-check.sh
EOF

# Make it executable
chmod +x .git/hooks/pre-commit
```

## Required Secrets

These workflows don't require additional secrets beyond the default `GITHUB_TOKEN`.

For enhanced scanning, you can optionally add:
- `TRUFFLEHOG_TOKEN` - For verified secret detection

## Bypassing Checks (Emergency Only)

If you must bypass checks in an emergency:

```bash
git commit --no-verify
```

**⚠️ Use sparingly and create a follow-up ticket to fix issues!**

## Monitoring Results

- View workflow results in GitHub Actions tab
- Failed checks will block merges if branch protection is enabled
- Security advisories are created for detected vulnerabilities

## Customization

To adjust security rules:

1. Edit `security-scan.yml` for scan parameters
2. Modify patterns in local check script
3. Update security checklist in PR comment workflow

## Support

For issues with security workflows:
1. Check workflow logs in GitHub Actions
2. Review SECURITY.md for best practices
3. Contact the security team
