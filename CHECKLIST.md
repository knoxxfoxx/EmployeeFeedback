# Installation and Deployment Checklist

Use this checklist to ensure everything is properly configured.

## 📋 Initial Setup

### Dependencies
- [ ] Root dependencies installed (`npm install`)
- [ ] Client dependencies installed (`cd client && npm install`)
- [ ] API dependencies installed (`cd api && npm install`)
- [ ] No installation errors

### Environment Files
- [ ] Root `.env` file created
- [ ] `client/.env` file created
- [ ] All required variables set (see below)
- [ ] No extra spaces around `=` signs
- [ ] Values have no quotes unless necessary

### Required Environment Variables

**Root `.env`:**
- [ ] `PASSPHRASE` - Set to secure value
- [ ] `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret key
- [ ] `EMAIL_HOST` - SMTP server address
- [ ] `EMAIL_PORT` - SMTP port (usually 587)
- [ ] `EMAIL_USER` - Email account username
- [ ] `EMAIL_PASSWORD` - Email account password (app password for Gmail)
- [ ] `EMAIL_TO` - Set to bparish@deroyal.com

**Client `.env`:**
- [ ] `VITE_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key

## 🔐 reCAPTCHA Setup

- [ ] Created reCAPTCHA v2 site at https://www.google.com/recaptcha/admin
- [ ] Selected "I'm not a robot" Checkbox (not v3)
- [ ] Added `localhost` to allowed domains (for development)
- [ ] Added production domain to allowed domains (if deploying)
- [ ] Copied Site Key to `client/.env`
- [ ] Copied Secret Key to root `.env`

## 📧 Email Configuration

### For Gmail:
- [ ] Enabled 2-Factor Authentication on Google account
- [ ] Generated App Password at https://myaccount.google.com/apppasswords
- [ ] Used App Password (not regular password) in `EMAIL_PASSWORD`
- [ ] Verified `EMAIL_HOST=smtp.gmail.com`
- [ ] Verified `EMAIL_PORT=587`

### For Office 365:
- [ ] Verified `EMAIL_HOST=smtp.office365.com`
- [ ] Verified `EMAIL_PORT=587`
- [ ] Used account credentials in `EMAIL_USER` and `EMAIL_PASSWORD`

## 🧪 Local Testing

### Backend Testing
- [ ] API server starts without errors (`cd api && npm run dev`)
- [ ] Health endpoint works: http://localhost:3000/api/health
- [ ] No configuration warnings in console
- [ ] All config items show ✅ in startup message

### Frontend Testing
- [ ] Frontend starts without errors (`cd client && npm run dev`)
- [ ] App loads at http://localhost:5173
- [ ] No console errors in browser
- [ ] CAPTCHA widget loads correctly

### Authentication Testing
- [ ] Landing page displays correctly
- [ ] Invalid passphrase is rejected
- [ ] Correct passphrase grants access
- [ ] Session persists on refresh

### Form Testing
- [ ] All form fields render correctly
- [ ] Type dropdown has all options
- [ ] Rich text editor works (formatting, colors, etc.)
- [ ] Character counter updates correctly
- [ ] File upload accepts valid files
- [ ] File upload rejects files > 5MB
- [ ] File upload rejects invalid file types
- [ ] Anonymous toggle shows/hides contact fields
- [ ] CAPTCHA displays and can be completed

### Submission Testing
- [ ] Form validation works (required fields)
- [ ] Submit without CAPTCHA is blocked
- [ ] Successful submission shows success page
- [ ] Email is received at configured address
- [ ] Email contains all submission details
- [ ] Email formatting looks good
- [ ] Attachment included in email (if uploaded)
- [ ] Contact info included in email (if not anonymous)

### Security Testing
- [ ] Honeypot field is hidden
- [ ] Filling honeypot blocks submission
- [ ] Invalid CAPTCHA tokens are rejected
- [ ] SQL injection attempts don't cause errors
- [ ] XSS attempts are sanitized

## 🚀 Production Deployment (Vercel)

### Pre-Deployment
- [ ] All local tests pass
- [ ] Code committed to Git repository
- [ ] Repository pushed to GitHub/GitLab/Bitbucket

### Vercel Setup
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Project name configured
- [ ] Build settings verified (Vercel auto-detects)

### Environment Variables (Vercel Dashboard)
- [ ] `PASSPHRASE` added
- [ ] `RECAPTCHA_SECRET_KEY` added
- [ ] `EMAIL_HOST` added
- [ ] `EMAIL_PORT` added
- [ ] `EMAIL_USER` added
- [ ] `EMAIL_PASSWORD` added
- [ ] `EMAIL_TO` added
- [ ] `VITE_RECAPTCHA_SITE_KEY` added
- [ ] All variables set for Production, Preview, and Development

### reCAPTCHA Production
- [ ] Production domain added to reCAPTCHA allowed domains
- [ ] Custom domain (if using) added to reCAPTCHA allowed domains

### Post-Deployment Testing
- [ ] Production site loads correctly
- [ ] Can authenticate with passphrase
- [ ] Form displays all fields correctly
- [ ] CAPTCHA loads on production
- [ ] Can submit test feedback
- [ ] Email received from production submission
- [ ] No errors in Vercel function logs

### DNS Configuration (If Using Custom Domain)
- [ ] Custom domain added in Vercel
- [ ] DNS records configured as instructed
- [ ] SSL certificate issued (automatic)
- [ ] Domain accessible via HTTPS

## 📚 Documentation

- [ ] Team knows where to find documentation
- [ ] Passphrase communicated to employees (securely)
- [ ] HR/Management knows where feedback emails go
- [ ] IT team has access to Vercel project
- [ ] Backup person identified for maintenance

## 🔒 Security Review

- [ ] `.env` files added to `.gitignore`
- [ ] No secrets committed to repository
- [ ] Passphrase is strong and secure
- [ ] Email credentials are secure (app passwords, not main passwords)
- [ ] Environment variables in Vercel are correct
- [ ] Access to Vercel project is limited to appropriate personnel

## 📊 Monitoring

- [ ] Know how to access Vercel logs
- [ ] Know how to check email delivery
- [ ] Know who to contact for issues
- [ ] Have tested the entire flow end-to-end

## 🎉 Launch Readiness

All items above checked? You're ready to launch! 🚀

### Final Pre-Launch Steps
1. [ ] Run one final end-to-end test
2. [ ] Verify email delivery to bparish@deroyal.com
3. [ ] Communicate the passphrase to employees
4. [ ] Share the URL with the organization
5. [ ] Monitor for any issues in the first few hours

### Post-Launch
- [ ] Monitor Vercel analytics for usage
- [ ] Check email delivery regularly
- [ ] Collect feedback on the system itself
- [ ] Plan for any needed improvements

## 📞 Support Contacts

- **Technical Issues**: IT Department
- **Process Questions**: HR Department  
- **Vercel Platform**: https://vercel.com/support
- **Email Issues**: Email administrator
- **reCAPTCHA Issues**: https://support.google.com/recaptcha

---

**Completion Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Notes**: 
_______________________________________________________
_______________________________________________________
_______________________________________________________
