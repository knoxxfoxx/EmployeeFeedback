# DeRoyal Employee Feedback System

A modern, secure web application that allows employees to anonymously submit suggestions and concerns to management.

## Features

### Employee Features
- **Passphrase Authentication**: Secure access control using environment-based passphrase
- **Modern UI**: Beautiful, responsive design with DeRoyal branding
- **Rich Text Editor**: Support for formatted text with font sizes, colors, bold, etc.
- **File Attachments**: Single file upload per submission (5MB max)
- **Anonymous or Identified**: Option to submit anonymously or include contact information
- **Bot Protection**: Honeypot field + Google reCAPTCHA v2

### Admin Features (NEW)
- **Admin Dashboard**: Secure admin panel for managing feedback submissions
- **Magic Link Authentication**: Passwordless login restricted to @deroyal.com emails
- **Real-time Updates**: View feedback submissions in real-time
- **Advanced Filtering**: Filter by status, type, date range, and search keywords
- **Admin Notes**: Document actions taken to address feedback
- **Archive System**: Mark feedback as reviewed and archive it
- **CSV Export**: Download filtered data for reporting
- **Statistics**: View key metrics and trends

## Tech Stack

- **Frontend**: React 18 + Vite + React Router, TailwindCSS, React-Quill
- **Backend**: Node.js + Express (Serverless)
- **Database**: InstantDB (real-time database)
- **Authentication**: InstantDB Magic Links
- **Email**: Nodemailer (optional)
- **CAPTCHA**: Google reCAPTCHA v2
- **Deployment**: Vercel

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google reCAPTCHA v2 keys ([Get them here](https://www.google.com/recaptcha/admin))
- InstantDB account ([Sign up here](https://www.instantdb.com/))
- Email account with SMTP access (optional, for notifications)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install API dependencies
cd ../api && npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Passphrase for employee access
PASSPHRASE=your-secret-passphrase

# Google reCAPTCHA v2 keys
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# InstantDB Configuration (REQUIRED)
INSTANT_APP_ID=your-instant-app-id
INSTANT_ADMIN_TOKEN=your-instant-admin-token
VITE_INSTANT_APP_ID=your-instant-app-id

# Email configuration (OPTIONAL - not currently used)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@deroyal.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=bparish@deroyal.com
EMAIL_TEST_MODE=true
```

**Note**: The application now uses InstantDB for data storage instead of email. Email configuration is optional and can be used for notifications in the future.

### 3. Get InstantDB Credentials

1. Sign up at [instantdb.com](https://www.instantdb.com/)
2. Create a new app
3. Copy your App ID and Admin Token from the dashboard
4. Add them to your `.env` file

See `ADMIN_SETUP.md` for detailed instructions.

### 4. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v2 "I'm not a robot" Checkbox
3. Add your domains (for development, add `localhost`)
4. Copy the Site Key to `client/.env` as `VITE_RECAPTCHA_SITE_KEY`
5. Copy the Secret Key to root `.env` as `RECAPTCHA_SECRET_KEY`

## Local Development

### Option 1: Run Frontend and Backend Separately

Terminal 1 - Backend:
```bash
cd api
node index.js
# Server runs on http://localhost:3000
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

### Option 2: Run Frontend Only (with proxy)

```bash
npm run dev
# Runs from root, starts Vite dev server with API proxy
```

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Configure Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Required:**
- `PASSPHRASE`
- `RECAPTCHA_SECRET_KEY`
- `VITE_RECAPTCHA_SITE_KEY`
- `INSTANT_APP_ID`
- `INSTANT_ADMIN_TOKEN`
- `VITE_INSTANT_APP_ID`

**Optional (for email notifications):**
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_TO`
- `EMAIL_TEST_MODE`

### 4. Update reCAPTCHA Domains

Add your Vercel domain to the reCAPTCHA allowed domains list.

## Project Structure

```
FeedbackLoop/
├── client/                     # React frontend
│   ├── src/
│   │   ├── pages/             # Landing, Form, Success, Admin pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── FeedbackForm.jsx
│   │   │   ├── SuccessPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/        # Reusable components
│   │   │   ├── FeedbackTable.jsx
│   │   │   ├── FeedbackDetailModal.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── ...
│   │   ├── lib/              # Third-party integrations
│   │   │   └── instant.js    # InstantDB client
│   │   ├── utils/            # Utilities
│   │   │   ├── auth.js       # Auth helpers
│   │   │   └── export.js     # CSV export
│   │   ├── services/         # API service
│   │   ├── App.jsx           # Main app with routing
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   └── package.json
├── api/                      # Express backend
│   ├── db/
│   │   └── instantdb-config.js  # Database configuration
│   ├── utils/
│   │   ├── email.js         # Email service
│   │   └── captcha.js       # CAPTCHA verification
│   ├── index.js             # Main API routes
│   └── package.json
├── vercel.json              # Vercel deployment config
├── .env                     # Environment variables (gitignored)
├── README.md                # This file
├── ADMIN_SETUP.md           # Admin panel setup guide
└── DATABASE_MIGRATION.md    # Migration guide
```

## Security Features

- **Passphrase Authentication**: Only authorized employees can access the form
- **Honeypot Field**: Hidden field catches simple bots
- **reCAPTCHA v2**: Prevents automated submissions
- **File Type Validation**: Whitelist of allowed file types
- **File Size Limit**: 5MB maximum
- **Input Validation**: Server-side validation of all inputs
- **XSS Prevention**: Input sanitization

## Usage

### For Employees

1. Visit the application URL
2. Enter the provided passphrase to gain access
3. Fill out the feedback form with type and description (required)
4. Optionally attach a file
5. Choose to submit anonymously or provide contact information
6. Complete the CAPTCHA
7. Submit the form
8. Receive confirmation message

### For Admins

1. Visit `/admin` to access the admin panel
2. Enter your `@deroyal.com` email address
3. Check your email for a 6-digit verification code
4. Enter the code to sign in
5. View, filter, search, and export feedback submissions
6. Add notes to document actions taken
7. Archive feedback when addressed

See `ADMIN_SETUP.md` for detailed admin panel documentation.

## Support

For issues or questions, contact the IT department or Human Resources.

## License

Proprietary - DeRoyal Industries, Inc.
