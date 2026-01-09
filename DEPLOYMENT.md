# Deployment Guide for Vercel

## Quick Deployment Steps

### 1. Prerequisites
- Vercel account ([Sign up free](https://vercel.com/signup))
- Google reCAPTCHA keys ([Get keys](https://www.google.com/recaptcha/admin))
- Email account with SMTP access

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? feedback-loop
# - In which directory is your code located? ./
# - Want to modify settings? No
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project settings (Vercel will auto-detect)
4. Add environment variables (see below)
5. Click "Deploy"

### 3. Configure Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

```
PASSPHRASE=your-secret-passphrase-here
RECAPTCHA_SECRET_KEY=your-google-recaptcha-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-email-app-password
EMAIL_TO=bparish@deroyal.com
VITE_RECAPTCHA_SITE_KEY=your-google-recaptcha-site-key
```

**Important**: 
- Set all variables for **Production**, **Preview**, and **Development** environments
- The `VITE_RECAPTCHA_SITE_KEY` is needed for the frontend build

### 4. Update reCAPTCHA Domain

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your site
3. Add your Vercel domain to the allowed domains:
   - `your-project.vercel.app`
   - Also add any custom domains you'll use

### 5. Email Configuration

#### For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the generated password
3. Use these settings:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=the-app-password-from-step-2
   ```

#### For Office 365:
```
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-account-password
```

#### For Custom SMTP:
```
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587 (or 465 for SSL)
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
```

### 6. Testing the Deployment

After deployment:

1. Visit your Vercel URL
2. Test the passphrase authentication
3. Fill out and submit a test feedback
4. Verify the email is received at bparish@deroyal.com
5. Check Vercel function logs for any errors

### 7. Custom Domain (Optional)

To use a custom domain like `feedback.deroyal.com`:

1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Vercel
4. Update reCAPTCHA allowed domains to include your custom domain

### 8. Monitoring

#### View Logs
```bash
vercel logs [deployment-url]
```

#### Or in Vercel Dashboard:
- Go to your project
- Click on a deployment
- View the "Functions" tab for API logs

### 9. Updating the Application

To deploy updates:

```bash
# Make your changes, then:
git add .
git commit -m "Update description"
git push

# Vercel will automatically deploy from Git
# Or manually deploy:
vercel --prod
```

### 10. Security Checklist

- [ ] Strong passphrase set in environment variables
- [ ] Email credentials are secure (use app passwords, not main passwords)
- [ ] reCAPTCHA keys are configured correctly
- [ ] Test submission works end-to-end
- [ ] Email is delivered to correct address (bparish@deroyal.com)
- [ ] Honeypot and CAPTCHA are both functional
- [ ] File uploads work and respect 5MB limit

### Troubleshooting

#### Issue: Emails not sending
- Check SMTP credentials in environment variables
- Verify EMAIL_HOST and EMAIL_PORT are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check Vercel function logs for error messages

#### Issue: CAPTCHA failing
- Verify RECAPTCHA_SECRET_KEY matches your reCAPTCHA secret
- Ensure your domain is added to reCAPTCHA allowed domains
- Check that VITE_RECAPTCHA_SITE_KEY is set for the frontend build

#### Issue: Passphrase not working
- Verify PASSPHRASE environment variable is set correctly
- Check for extra spaces or special characters
- Redeploy after changing environment variables

#### Issue: File uploads failing
- Vercel has a 4.5MB body size limit for serverless functions
- Files are kept in memory temporarily, so 5MB is the safe limit
- Check file type is in the allowed list

### Support

For issues with:
- **Vercel Platform**: [Vercel Support](https://vercel.com/support)
- **reCAPTCHA**: [reCAPTCHA Help](https://developers.google.com/recaptcha/docs/faq)
- **Application Issues**: Contact your IT department

### Cost

This application uses:
- **Vercel Free Tier**: Includes serverless functions and hosting
- **Google reCAPTCHA v2**: Free
- **Email**: Uses your existing email service (no additional cost)

The free tier should be sufficient for most use cases. Monitor your usage in the Vercel dashboard.
