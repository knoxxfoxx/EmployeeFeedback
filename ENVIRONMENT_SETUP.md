# Environment Variables Setup Guide

## Required Environment Variables

All environment variables should be set in a `.env` file in the **project root** directory (not in client or api subdirectories).

### Template

Create a `.env` file in the root of the project with the following content:

```env
# ==============================================================================
# EMPLOYEE ACCESS
# ==============================================================================
# Passphrase for employee access to the feedback form
PASSPHRASE=DeRoyalFeedback2026

# ==============================================================================
# RECAPTCHA CONFIGURATION
# ==============================================================================
# Get these from: https://www.google.com/recaptcha/admin
# Use reCAPTCHA v2 "I'm not a robot" Checkbox type

# Secret key (backend only)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Site key (frontend - VITE_ prefix exposes it to client)
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# ==============================================================================
# DATABASE CONFIGURATION (REQUIRED)
# ==============================================================================
# Get these from: https://www.instantdb.com/dash
# Sign up, create an app, and copy the credentials

# App ID for backend
INSTANT_APP_ID=your-instant-app-id

# Admin token for backend (KEEP SECRET - never expose to client)
INSTANT_ADMIN_TOKEN=your-instant-admin-token

# App ID for frontend (VITE_ prefix exposes it to client - this is safe)
VITE_INSTANT_APP_ID=your-instant-app-id

# ==============================================================================
# EMAIL CONFIGURATION (OPTIONAL - not currently used)
# ==============================================================================
# The application now stores feedback in the database instead of emailing
# These settings are preserved for future use (e.g., admin notifications)

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=bparish@deroyal.com

# Set to true to log emails to console instead of sending them
EMAIL_TEST_MODE=true

# ==============================================================================
# API CONFIGURATION (OPTIONAL)
# ==============================================================================
# Port for the API server (default: 3001)
# Only needed for local development
PORT=3001
```

## Step-by-Step Setup

### 1. Create .env File

```bash
# From the project root
touch .env
```

Or on Windows:
```bash
type nul > .env
```

### 2. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "+" to create a new site
3. Settings:
   - **Label**: DeRoyal Feedback System
   - **reCAPTCHA type**: reCAPTCHA v2, "I'm not a robot" Checkbox
   - **Domains**: 
     - Add `localhost` for development
     - Add your production domain (e.g., `yourapp.vercel.app`)
4. Accept terms and submit
5. Copy the **Site Key** to `VITE_RECAPTCHA_SITE_KEY` in `.env`
6. Copy the **Secret Key** to `RECAPTCHA_SECRET_KEY` in `.env`

**For testing only**, you can use Google's test keys:
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

**⚠️ Warning**: Test keys will accept any input. Use real keys for production!

### 3. Get InstantDB Credentials

1. Go to [instantdb.com](https://www.instantdb.com/)
2. Sign up for a free account
3. Click "Create App"
4. Name it "DeRoyal Feedback System"
5. Go to the app dashboard
6. Click on "Settings" or "API Keys"
7. Copy the **App ID** to both `INSTANT_APP_ID` and `VITE_INSTANT_APP_ID`
8. Copy the **Admin Token** to `INSTANT_ADMIN_TOKEN`

**Important**: The Admin Token should NEVER be exposed to the client-side code!

### 4. Set Passphrase

Choose a secure passphrase that employees will use to access the form:
- Make it memorable but not easily guessable
- Avoid common words or phrases
- Consider using multiple words (e.g., "DeRoyalFeedback2026")
- Distribute securely to authorized employees only

### 5. Email Configuration (Optional)

Currently not used, but you can configure it for future email notifications:

**For Gmail:**
1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) in `EMAIL_PASSWORD`

**For Office 365:**
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-password
```

## Vercel Deployment

When deploying to Vercel, add these environment variables in the Vercel dashboard:

### Required Variables

1. Go to your Vercel project dashboard
2. Navigate to: Settings → Environment Variables
3. Add each variable:

**Critical for both frontend and backend:**
- `PASSPHRASE`
- `RECAPTCHA_SECRET_KEY`
- `VITE_RECAPTCHA_SITE_KEY`
- `INSTANT_APP_ID`
- `INSTANT_ADMIN_TOKEN`
- `VITE_INSTANT_APP_ID`

**Optional (for future use):**
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_TO`
- `EMAIL_TEST_MODE`

4. For each variable, select which environments to apply to:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

## Troubleshooting

### "Missing VITE_INSTANT_APP_ID environment variable"

**Cause**: Frontend can't access the InstantDB App ID

**Solution**:
1. Make sure `VITE_INSTANT_APP_ID` is in your `.env` file
2. Restart the dev server (Vite only reads .env on startup)
3. Check that the variable name has the `VITE_` prefix

### "Missing INSTANT_APP_ID environment variable"

**Cause**: Backend can't access the InstantDB App ID

**Solution**:
1. Make sure `INSTANT_APP_ID` is in your `.env` file in the project root
2. Restart the API server
3. Verify the `.env` file location (should be in project root, not in api/)

### reCAPTCHA not working

**Cause**: Invalid keys or domain mismatch

**Solution**:
1. Verify keys are correctly copied (no extra spaces)
2. Check that your domain is added to reCAPTCHA allowed domains
3. For localhost, make sure `localhost` (not `127.0.0.1`) is in allowed domains
4. Wait a few minutes after adding a new domain

### "Only @deroyal.com email addresses are allowed"

**Cause**: Admin login is restricted by design

**Solution**:
- This is intentional! Only @deroyal.com emails can access the admin panel
- To change the domain restriction, edit `client/src/utils/auth.js`

## Security Best Practices

1. **Never commit .env files to git**
   - The `.env` file is already in `.gitignore`
   - Double-check before pushing code

2. **Keep Admin Token secret**
   - `INSTANT_ADMIN_TOKEN` should never be in client-side code
   - Only use on the backend

3. **Use real reCAPTCHA keys in production**
   - Test keys will accept any input
   - Get your own keys for production

4. **Rotate credentials periodically**
   - Change passphrase every 6 months
   - Update if there's any suspicion of compromise

5. **Use strong passphrases**
   - Minimum 12 characters
   - Mix of words and numbers
   - Not easily guessable

## Verification

After setting up your `.env` file, verify it's working:

```bash
# 1. Install dependencies
cd client && npm install
cd ../api && npm install

# 2. Start the dev server (from project root)
npm run dev

# 3. Check the terminal output:
#    - API server should show "✅ All configuration valid"
#    - No missing environment variable warnings
#    - Both servers should start successfully

# 4. Test in browser:
#    - Visit http://localhost:5173
#    - Try submitting feedback
#    - Try accessing admin at http://localhost:5173/admin
```

If you see any errors about missing environment variables, double-check:
1. `.env` file is in the project root
2. All required variables are present
3. No typos in variable names
4. Dev servers were restarted after creating/editing `.env`
