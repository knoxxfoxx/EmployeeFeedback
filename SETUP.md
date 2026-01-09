# Quick Setup Guide

Follow these steps to get the Employee Feedback System running locally.

## Step 1: Install Dependencies

```bash
# Install all dependencies for client and API
npm run install-all
```

Or manually:

```bash
npm install
cd client && npm install
cd ../api && npm install
```

## Step 2: Set Up Environment Variables

### Root Directory `.env`

Create a `.env` file in the root directory with:

```env
PASSPHRASE=DeRoyalFeedback2024
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=bparish@deroyal.com
```

### Client Directory `client/.env`

Create a `client/.env` file with:

```env
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## Step 3: Get reCAPTCHA Keys

1. Visit [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click "+" to register a new site
3. Choose **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
4. Add domains:
   - For development: `localhost`
   - For production: your domain
5. Accept terms and submit
6. Copy:
   - **Site Key** → to `client/.env` as `VITE_RECAPTCHA_SITE_KEY`
   - **Secret Key** → to root `.env` as `RECAPTCHA_SECRET_KEY`

## Step 4: Configure Email

### For Gmail (Recommended for Testing)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=the-16-char-app-password
   ```

### For Office 365

```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-password
```

## Step 5: Run the Application

### Option A: Run Both Frontend and Backend (Recommended)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd api
npm run dev
```
This starts the API server on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
This starts the frontend on http://localhost:5173

### Option B: Run Frontend Only (with API proxy)

```bash
npm run dev:client
```

Then manually start the API in another terminal:
```bash
npm run dev:api
```

## Step 6: Access the Application

1. Open your browser to http://localhost:5173
2. Enter the passphrase you set in `.env` (default: `DeRoyalFeedback2024`)
3. Fill out the feedback form
4. Complete the CAPTCHA
5. Submit and check that the email arrives at the configured address

## Troubleshooting

### Can't Send Emails

**Problem:** "Error sending email" or emails not arriving

**Solutions:**
- For Gmail: Make sure you're using an App Password, not your regular password
- Check that 2FA is enabled on your Google account
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Check spam/junk folder
- Look at API console logs for specific error messages

### CAPTCHA Not Working

**Problem:** CAPTCHA won't load or says "Invalid site key"

**Solutions:**
- Verify you added `localhost` to reCAPTCHA allowed domains
- Check that VITE_RECAPTCHA_SITE_KEY matches your site key
- Make sure you selected reCAPTCHA v2 (not v3)
- Clear browser cache and reload

### Passphrase Rejected

**Problem:** Valid passphrase not accepted

**Solutions:**
- Check for extra spaces in `.env` file
- Restart the API server after changing `.env`
- Clear browser cache and sessionStorage
- Check API console logs for errors

### Port Already in Use

**Problem:** "Port 3000 is already in use"

**Solutions:**
```bash
# Find and kill the process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

Or change the port in `api/dev.js`:
```javascript
const PORT = process.env.PORT || 3001
```

## Verify Installation

Run these checks:

- [ ] Both client and API dependencies installed without errors
- [ ] `.env` files created in root and client directories
- [ ] reCAPTCHA keys obtained and added to env files
- [ ] Email credentials configured
- [ ] API server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can authenticate with passphrase
- [ ] Form loads with all fields
- [ ] CAPTCHA displays correctly
- [ ] Test submission works
- [ ] Email received successfully

## Next Steps

Once everything works locally:

1. Read [DEPLOYMENT.md](DEPLOYMENT.md) for deploying to Vercel
2. Update the passphrase to something more secure
3. Configure your production email settings
4. Add your production domain to reCAPTCHA

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Contact your IT department for infrastructure support
