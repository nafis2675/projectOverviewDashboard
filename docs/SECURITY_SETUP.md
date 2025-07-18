# Security Setup Guide

## Environment Variables

### 🔐 **IMPORTANT**: Never commit API keys or sensitive information to git!

### Setup Instructions

1. **Copy the template file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your personal API keys:
   ```
   VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. **Verify `.env.local` is in `.gitignore`** (it should be already)

### Files to NEVER commit:
- `.env.local` (your personal environment variables)
- `.env` (any environment file with real credentials)
- `test-db-connection.js` (contains hardcoded API keys)
- Any file ending with `-test-credentials.*`

### Template Files (safe to commit):
- `.env.example` (template with placeholder values)
- This documentation

## Git Configuration

### Anonymous Commits

This project is configured to use anonymous git information:
- **Name**: `ProjectDashboard Developer`
- **Email**: `developer@projectdashboard.local`

### How to check your git config:
```bash
git config user.name
git config user.email
```

### If you need to reset to anonymous:
```bash
git config user.name "ProjectDashboard Developer"
git config user.email "developer@projectdashboard.local"
```

### If you want to use your personal info (not recommended):
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Security Checklist

Before committing:
- [ ] Check that no API keys are in your code
- [ ] Verify `.env.local` is not being committed
- [ ] Ensure test files with credentials are ignored
- [ ] Check that git is using anonymous or preferred identity

## Getting Help

If you accidentally commit sensitive information:
1. **Don't panic** - but act quickly
2. Remove the sensitive information from the code
3. Use `git filter-branch` or contact a senior developer
4. Consider rotating any exposed API keys

## Best Practices

1. **Use environment variables** for all sensitive data
2. **Never hardcode** API keys or secrets
3. **Use template files** (`.example` files) for configuration
4. **Check git status** before committing
5. **Use meaningful commit messages** that don't reveal sensitive info 