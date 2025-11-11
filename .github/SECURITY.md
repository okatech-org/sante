# Security Policy

## Supported Versions

We take security seriously. This document outlines our security policy and how to report vulnerabilities.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to your security team. You should receive a response within 48 hours.

Please include:
- Type of vulnerability
- Full paths of affected files
- Step-by-step instructions to reproduce
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

## Security Best Practices

### 1. Authentication & Authorization
- ✅ All edge functions use JWT verification
- ✅ Role-based access control (RBAC) enforced server-side
- ✅ No client-side authorization decisions
- ❌ Never trust client-provided role information

### 2. Secrets Management
- ✅ Store secrets in environment variables
- ✅ Use Lovable Cloud secrets for API keys
- ✅ Rotate credentials regularly
- ❌ Never commit secrets to Git

### 3. Database Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Restrictive RLS policies
- ✅ Use security definer functions carefully
- ❌ Never expose service role key to clients

### 4. Input Validation
- ✅ Validate all user inputs server-side
- ✅ Sanitize inputs before processing
- ✅ Use parameterized queries
- ❌ Never concatenate user input into SQL

### 5. API Security
- ✅ Rate limiting on sensitive endpoints
- ✅ Audit logging for privileged operations
- ✅ Proper CORS configuration
- ❌ Don't expose internal errors to clients

## Automated Security Checks

Our CI/CD pipeline includes:
- Secret detection (TruffleHog)
- Dependency vulnerability scanning (npm audit)
- JWT verification checks
- SQL injection pattern detection
- RLS policy verification
- Hardcoded password detection

## Security Contacts

For security issues:
- Create a private security advisory on GitHub
- Or contact: [Your security email]

## Security Updates

We publish security updates as needed. Subscribe to repository notifications to stay informed.

## Compliance

This application handles healthcare data and must comply with:
- GDPR (European data protection)
- Local healthcare data regulations
- Industry security best practices

## Audit Trail

All security-relevant events should be logged:
- Authentication attempts
- Authorization failures
- Admin operations
- Data access by privileged users
- Configuration changes
