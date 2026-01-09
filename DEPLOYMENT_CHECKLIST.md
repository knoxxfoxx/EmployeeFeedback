# Deployment Checklist

Use this checklist when deploying the FeedbackLoop application to production.

## Pre-Deployment

### 1. Environment Variables

- [ ] `PASSPHRASE` - Set a strong, unique passphrase for employee access
- [ ] `RECAPTCHA_SECRET_KEY` - Real reCAPTCHA secret key (not test key)
- [ ] `VITE_RECAPTCHA_SITE_KEY` - Real reCAPTCHA site key (not test key)
- [ ] `INSTANT_APP_ID` - InstantDB App ID from dashboard
- [ ] `INSTANT_ADMIN_TOKEN` - InstantDB Admin Token (keep secret!)
- [ ] `VITE_INSTANT_APP_ID` - Same as INSTANT_APP_ID (for frontend)

### 2. InstantDB Setup

- [ ] Created InstantDB account
- [ ] Created new app in InstantDB dashboard
- [ ] Copied App ID and Admin Token
- [ ] Verified email domain restrictions work (@deroyal.com)
- [ ] Tested magic link authentication

### 3. reCAPTCHA Configuration

- [ ] Registered site in [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- [ ] Used reCAPTCHA v2 "I'm not a robot" Checkbox
- [ ] Added production domain to allowed domains
- [ ] Added localhost for testing (optional)
- [ ] Verified CAPTCHA works in testing

### 4. Dependencies

- [ ] Run `cd client && npm install`
- [ ] Run `cd api && npm install`
- [ ] Verified all packages installed successfully
- [ ] No security vulnerabilities (`npm audit`)

### 5. Build Test

- [ ] Run `cd client && npm run build`
- [ ] Verified build succeeds without errors
- [ ] Check build output size is reasonable

## Deployment to Vercel

### 1. Initial Deployment

- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run `vercel` from project root
- [ ] Follow prompts to link/create project
- [ ] Note the deployment URL

### 2. Environment Variables in Vercel

- [ ] Go to Vercel project dashboard
- [ ] Navigate to Settings → Environment Variables
- [ ] Add all required environment variables (see Pre-Deployment #1)
- [ ] Set for Production, Preview, and Development environments
- [ ] **Important**: Do not expose `INSTANT_ADMIN_TOKEN` publicly

### 3. Domain Configuration

- [ ] Update reCAPTCHA allowed domains with Vercel URL
- [ ] Update InstantDB allowed origins (if applicable)
- [ ] Configure custom domain (if applicable)
- [ ] Verify HTTPS is enabled

### 4. Post-Deployment Testing

- [ ] Visit production URL
- [ ] Test employee flow:
  - [ ] Enter passphrase
  - [ ] Fill out feedback form
  - [ ] Complete CAPTCHA
  - [ ] Submit successfully
- [ ] Test admin flow:
  - [ ] Navigate to `/admin`
  - [ ] Sign in with @deroyal.com email
  - [ ] Receive and enter magic code
  - [ ] View dashboard
  - [ ] See submitted feedback
  - [ ] Add admin notes
  - [ ] Archive feedback
  - [ ] Export to CSV
  - [ ] Logout

### 5. Admin Access Setup

- [ ] Communicate admin URL to management team
- [ ] Provide @deroyal.com email requirement
- [ ] Send quick start guide for admins
- [ ] Verify at least 2 admins can access successfully

### 6. Employee Communication

- [ ] Communicate employee URL to staff
- [ ] Share the passphrase securely
- [ ] Provide instructions for submitting feedback
- [ ] Emphasize anonymity option

## Production Monitoring

### First Week

- [ ] Monitor Vercel function logs daily
- [ ] Check InstantDB dashboard for data
- [ ] Verify submissions are being stored
- [ ] Check for any error patterns
- [ ] Gather admin feedback on usability

### Ongoing

- [ ] Weekly check of submission volume
- [ ] Monthly review of system performance
- [ ] Quarterly review of archived feedback
- [ ] Update passphrase every 6 months
- [ ] Review admin access list quarterly

## Rollback Plan

If critical issues arise:

1. [ ] Access Vercel dashboard
2. [ ] Navigate to Deployments
3. [ ] Find last working deployment
4. [ ] Click "..." menu → "Promote to Production"
5. [ ] Verify rollback successful
6. [ ] Notify users of temporary issue

## Security Checklist

- [ ] All environment variables are in Vercel dashboard (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] `INSTANT_ADMIN_TOKEN` is never exposed to client
- [ ] HTTPS is enabled for all traffic
- [ ] reCAPTCHA is working (not test mode)
- [ ] Admin access restricted to @deroyal.com
- [ ] No sensitive data in git history
- [ ] File upload size limit enforced (5MB)
- [ ] Input validation working on backend

## Performance Optimization

- [ ] Verify Vercel function cold start times acceptable
- [ ] Check frontend bundle size reasonable
- [ ] Test on mobile devices
- [ ] Verify loading times under 3 seconds
- [ ] Check database query performance

## Documentation

- [ ] Update README with production URL
- [ ] Document the passphrase securely
- [ ] Create admin user guide (ADMIN_SETUP.md exists)
- [ ] Create employee quick guide (if needed)
- [ ] Document support contact information

## Success Criteria

- [ ] At least 2 test submissions in database
- [ ] At least 2 admins successfully logged in
- [ ] No errors in Vercel function logs
- [ ] CSV export working
- [ ] Magic link emails being received
- [ ] Mobile view working properly
- [ ] Admin dashboard loads in under 2 seconds

## Support Contacts

Document who to contact for issues:

- **Technical Issues**: ___________________________
- **Admin Access Problems**: ___________________________
- **Employee Questions**: ___________________________
- **Emergency Contact**: ___________________________

## Notes

Date Deployed: ___________________________

Deployed By: ___________________________

Production URL: ___________________________

Admin URL: ___________________________

Any Issues or Observations:
___________________________
___________________________
___________________________
