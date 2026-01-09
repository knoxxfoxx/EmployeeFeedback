# Quick Start Guide

Get the DeRoyal Employee Feedback System running in 5 minutes!

## 🚀 Super Quick Setup (for Testing)

If you just want to see the app running quickly:

### 1. Install Dependencies
```bash
cd client && npm install
cd ../api && npm install
```

### 2. Create Basic Environment Files

**Root `.env`:**
```bash
PASSPHRASE=test123
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=bparish@deroyal.com
```

**`client/.env`:**
```bash
VITE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

> ⚠️ The reCAPTCHA keys above are Google's TEST keys for localhost only!

### 3. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Open and Test
1. Open http://localhost:5173
2. Enter passphrase: `test123`
3. Fill out the form
4. Complete CAPTCHA (will auto-pass with test keys)
5. Submit!

---

## 📧 To Actually Send Emails

The test setup above won't send real emails. To enable email:

### Gmail Setup (Easiest)

1. **Enable 2FA** on your Google account
2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" → Generate
   - Copy the 16-character password
3. **Update `.env`:**
   ```bash
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # The app password from step 2
   ```
4. **Restart the API server**

### Office 365 Setup

```bash
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-account-password
```

---

## 🔐 To Use Real reCAPTCHA

The test keys work for localhost but won't work in production.

1. **Get Keys:** https://www.google.com/recaptcha/admin
2. **Create Site:**
   - Choose reCAPTCHA v2
   - Select "I'm not a robot" Checkbox
   - Add domain: `localhost` (for dev)
3. **Update Environment:**
   - Site Key → `client/.env` → `VITE_RECAPTCHA_SITE_KEY`
   - Secret Key → root `.env` → `RECAPTCHA_SECRET_KEY`
4. **Restart both servers**

---

## ✅ Verify It's Working

### Check 1: Backend Running
Visit http://localhost:3000/api/health
Should see: `{"status":"ok"}`

### Check 2: Frontend Running
Visit http://localhost:5173
Should see: Landing page with passphrase field

### Check 3: Can Authenticate
Enter your passphrase → Should see feedback form

### Check 4: Can Submit
Fill form → Complete CAPTCHA → Submit → Should see success page

### Check 5: Email Received
Check bparish@deroyal.com inbox → Should have email with feedback

---

## 🐛 Quick Troubleshooting

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules api/node_modules
cd client && npm install
cd ../api && npm install
```

### "Port 3000 already in use"
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <number> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### "CAPTCHA not loading"
- Check `VITE_RECAPTCHA_SITE_KEY` is set in `client/.env`
- Make sure you added `localhost` to reCAPTCHA domains
- Clear browser cache

### "Email not sending"
- For Gmail: Must use App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Look at API terminal for specific error
- Check spam/junk folder

### "Invalid passphrase" but it's correct
- Check for spaces in `.env`: `PASSPHRASE=test123` (no spaces around `=`)
- Restart API server after changing `.env`
- Clear browser sessionStorage

---

## 📚 Next Steps

Once you have it running:

- **Change passphrase**: Update `PASSPHRASE` in `.env` to something secure
- **Configure production email**: Set up proper SMTP credentials
- **Read full docs:**
  - [README.md](README.md) - Complete documentation
  - [SETUP.md](SETUP.md) - Detailed setup instructions
  - [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy to Vercel
  - [TESTING.md](TESTING.md) - Test all features

---

## 🚢 Deploy to Production

When ready to deploy:

1. **Push to Git** (GitHub, GitLab, Bitbucket)
2. **Connect to Vercel:**
   - Sign up at https://vercel.com
   - Import your repository
   - Add environment variables
   - Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 💡 Tips

- Use **different terminals** for frontend and backend
- **Restart API** after changing `.env`
- **Rebuild frontend** after changing `client/.env`
- Check **browser console** for frontend errors
- Check **terminal output** for backend errors

---

## 🆘 Still Stuck?

1. Check the detailed [SETUP.md](SETUP.md) guide
2. Review the [TESTING.md](TESTING.md) checklist
3. Contact your IT department

---

**Happy Feedback Collecting! 🎉**
