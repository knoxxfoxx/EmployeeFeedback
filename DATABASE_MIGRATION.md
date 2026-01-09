# Database Migration Guide

## Overview

The FeedbackLoop application has been enhanced to store submissions in a database (InstantDB) instead of sending them via email. This provides better data persistence, searchability, and management capabilities.

## What Changed

### Before
- Feedback submissions were sent via email to `bparish@deroyal.com`
- No permanent storage or tracking
- No way to mark feedback as reviewed
- Manual email management required

### After
- Feedback is stored in InstantDB (real-time database)
- Admins can view all submissions in a dashboard
- Submissions can be filtered, searched, and exported
- Admin notes can be added to track resolution
- Submissions can be archived when addressed

## Migration Steps

### 1. No Data Migration Needed

Since the previous implementation used email only, there is no historical data to migrate. All new submissions will be stored in the database going forward.

### 2. Setup InstantDB

Follow the steps in `ADMIN_SETUP.md` to:
1. Create an InstantDB account
2. Get your App ID and Admin Token
3. Add environment variables

### 3. Test the New Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Submit test feedback at `http://localhost:5173/`

3. Access admin panel at `http://localhost:5173/admin`

4. Verify the feedback appears in the dashboard

### 4. Update Deployment

1. Install new dependencies:
   ```bash
   cd client && npm install
   cd ../api && npm install
   ```

2. Add InstantDB environment variables to Vercel

3. Deploy the updated application

## Email Configuration (Optional)

The email functionality has been preserved but is currently disabled in favor of database storage. If you want to enable email notifications in addition to database storage:

1. Edit `api/index.js`
2. Change `USE_DATABASE = true` to enable both email and database
3. Or implement a notification system that emails admins when new feedback arrives

## Benefits of Database Storage

1. **Data Persistence**: Never lose feedback submissions
2. **Searchability**: Find specific feedback quickly
3. **Accountability**: Track who reviewed what and when
4. **Analytics**: Analyze trends over time
5. **Efficiency**: No more manual email management
6. **Audit Trail**: Complete history of all submissions
7. **Export**: Generate reports for management

## Rollback Plan (If Needed)

If you need to revert to email-only mode:

1. Edit `api/index.js`:
   ```javascript
   const USE_DATABASE = false
   const EMAIL_TEST_MODE = false
   ```

2. Redeploy the application

3. Feedback will be sent via email instead of stored in database

## Data Retention

InstantDB data retention policies:
- **Free Tier**: Unlimited storage for reasonable use
- **Data Ownership**: You own all data
- **Backups**: InstantDB provides automatic backups
- **Export**: Data can be exported at any time via CSV

## Support

For questions about the migration or database setup, contact the development team.
