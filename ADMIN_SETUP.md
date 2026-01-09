# Admin Panel Setup Guide

## Overview

The FeedbackLoop application now includes a full-featured admin panel for managing employee feedback submissions. Admin access is restricted to users with `@deroyal.com` email addresses.

## Features

- **Magic Link Authentication**: Secure, passwordless login with 6-digit codes
- **Real-time Dashboard**: View all feedback submissions in real-time
- **Advanced Filtering**: Filter by status, type, date range, and search keywords
- **Admin Notes**: Add notes documenting actions taken for each submission
- **Archive System**: Mark feedback as reviewed and archive it
- **CSV Export**: Download filtered feedback data for reporting
- **Statistics**: View key metrics at a glance

## Setup Instructions

### 1. InstantDB Configuration

1. Sign up for a free account at [instantdb.com](https://www.instantdb.com/)
2. Create a new app
3. Get your credentials:
   - **App ID**: Found in dashboard settings
   - **Admin Token**: Found in dashboard settings (keep this secret!)

### 2. Environment Variables

Add these variables to your `.env` file in the project root:

```env
# InstantDB Configuration
INSTANT_APP_ID=your-instant-app-id
INSTANT_ADMIN_TOKEN=your-instant-admin-token
VITE_INSTANT_APP_ID=your-instant-app-id
```

**Important**: 
- `INSTANT_APP_ID` is used by the backend
- `VITE_INSTANT_APP_ID` is used by the frontend (the `VITE_` prefix exposes it to the client)
- `INSTANT_ADMIN_TOKEN` should NEVER be exposed to the client

### 3. InstantDB Schema

InstantDB uses a flexible schema. The app will automatically create the necessary structure when the first feedback is submitted. The schema includes:

```javascript
{
  feedback: {
    id: uuid,
    type: string,
    description: string,
    isAnonymous: boolean,
    email: string | null,
    name: string | null,
    title: string | null,
    location: string | null,
    attachmentUrl: string | null,
    attachmentName: string | null,
    status: string,           // 'new' or 'archived'
    adminNotes: string | null,
    createdAt: number,
    updatedAt: number,
    archivedAt: number | null,
    archivedBy: string | null
  }
}
```

### 4. Email Domain Restriction

The admin login is automatically restricted to `@deroyal.com` email addresses. This is enforced in the `AdminLogin.jsx` component using the `isValidDeRoyalEmail()` utility function.

To change the allowed domain, edit `client/src/utils/auth.js`:

```javascript
export function isValidDeRoyalEmail(email) {
  return email && email.toLowerCase().endsWith('@deroyal.com')
}
```

### 5. Deploy to Vercel

1. Install dependencies:
   ```bash
   cd client && npm install
   cd ../api && npm install
   ```

2. Build the project:
   ```bash
   cd client && npm run build
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file

## Accessing the Admin Panel

### Admin URL

- **Development**: `http://localhost:5173/admin`
- **Production**: `https://your-domain.vercel.app/admin`

### Login Flow

1. Navigate to `/admin`
2. Enter your `@deroyal.com` email address
3. Check your email for a 6-digit code
4. Enter the code to authenticate
5. Access the dashboard

### First-Time Setup

The first time you access the admin panel:

1. Use a `@deroyal.com` email address
2. Complete the magic link authentication
3. The dashboard will be empty until employees submit feedback
4. Test by submitting feedback through the employee form at `/`

## Admin Dashboard Features

### Statistics Cards

The top of the dashboard shows:
- **Total Submissions**: All feedback ever submitted
- **New Submissions**: Unreviewed feedback
- **Archived**: Reviewed and archived feedback

### Filtering

Use the filter bar to narrow down submissions:
- **Status**: All, New, or Archived
- **Type**: Filter by submission type (e.g., Suggestion, Concern)
- **Date Range**: Filter by submission date
- **Search**: Search in description, type, contact info, and notes

### Viewing Details

Click "View Details" on any submission to see:
- Full description with formatting
- Contact information (if not anonymous)
- Attachments (if any)
- Admin notes
- Archive status and history

### Admin Notes

In the detail modal:
1. Type notes in the "Admin Notes" textarea
2. Click "Save Notes" to record actions taken
3. Notes are saved in real-time to InstantDB

### Archiving

To archive feedback:
1. Open the detail modal
2. Add admin notes documenting resolution
3. Click "Archive"
4. The submission moves to archived status with timestamp and your email

To unarchive:
1. Filter to show archived submissions
2. Open the detail modal
3. Click "Unarchive"

### Exporting Data

To export feedback data:
1. Apply filters if desired (export includes filtered results)
2. Click "Export to CSV" button
3. File downloads with all feedback data in Excel format
4. Includes: ID, date, type, description, contact info, notes, status

## Security Considerations

1. **Email Restriction**: Only `@deroyal.com` addresses can access admin panel
2. **Admin Token**: Never expose `INSTANT_ADMIN_TOKEN` to the client
3. **Session Storage**: Admin sessions persist until logout or browser close
4. **Magic Links**: 6-digit codes expire after a short time

## Troubleshooting

### "Missing VITE_INSTANT_APP_ID environment variable"

- Ensure `VITE_INSTANT_APP_ID` is set in your `.env` file
- Restart the dev server after adding environment variables
- For Vercel, ensure it's set in the dashboard

### Can't log in with email

- Verify your email ends with `@deroyal.com`
- Check spam folder for magic link code
- Ensure InstantDB app is properly configured

### No feedback showing in dashboard

- Verify feedback is being submitted successfully
- Check browser console for errors
- Verify `INSTANT_APP_ID` matches between frontend and backend

### Export not working

- Ensure browser allows downloads
- Try with a smaller data set
- Check browser console for errors

## Admin User Management

### Adding Admins

Any user with a `@deroyal.com` email can access the admin panel. No pre-registration required.

### Limiting Access (Optional)

To restrict to specific email addresses, edit `client/src/utils/auth.js`:

```javascript
const ALLOWED_ADMINS = [
  'john.doe@deroyal.com',
  'jane.smith@deroyal.com'
]

export function isValidDeRoyalEmail(email) {
  return ALLOWED_ADMINS.includes(email.toLowerCase())
}
```

## Future Enhancements

Potential improvements:
- Role-based permissions (view-only vs full access)
- Email notifications when new feedback arrives
- Analytics dashboard with charts and trends
- Bulk operations (archive multiple at once)
- Comment threads on feedback
- Assignment system (assign feedback to specific admins)

## Support

For technical issues or questions, contact the development team.
