# Contributing Guide

Thank you for your interest in improving the DeRoyal Employee Feedback System!

## Development Setup

1. Follow [SETUP.md](SETUP.md) to get the application running locally
2. Make sure all tests in [TESTING.md](TESTING.md) pass before making changes

## Project Structure

```
FeedbackLoop/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components (Landing, Form, Success)
│   │   ├── services/          # API communication layer
│   │   ├── utils/             # Utility functions and constants
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # Application entry point
│   │   └── index.css          # Global styles and Tailwind
│   ├── index.html
│   └── package.json
│
├── api/                        # Express backend
│   ├── utils/
│   │   ├── captcha.js         # reCAPTCHA verification
│   │   ├── email.js           # Email sending logic
│   │   └── config.js          # Configuration management
│   ├── index.js               # Main API routes and middleware
│   ├── dev.js                 # Development server script
│   └── package.json
│
├── vercel.json                # Vercel deployment configuration
├── .env.sample                # Sample environment variables
└── Documentation files
```

## Making Changes

### Frontend Changes

Location: `client/src/`

1. **UI Components**: Add to `components/` if reusable, or modify existing pages in `pages/`
2. **Styling**: Use Tailwind CSS classes. Global styles go in `index.css`
3. **API Calls**: Update `services/api.js` for new endpoints
4. **Constants**: Add to `utils/constants.js`
5. **Validation**: Add to `utils/validation.js`

### Backend Changes

Location: `api/`

1. **Routes**: Add new routes in `index.js`
2. **Email Templates**: Modify `utils/email.js`
3. **Validation**: Use express-validator in route handlers
4. **Configuration**: Update `utils/config.js` for new env variables

## Code Style

### JavaScript/React
- Use ES6+ features (arrow functions, destructuring, etc.)
- Functional components with hooks (not class components)
- Meaningful variable names
- Comments for complex logic

### CSS
- Use Tailwind utility classes
- Custom styles only when necessary
- Maintain responsive design (mobile-first)

### Git Commits
- Clear, descriptive commit messages
- Format: `<type>: <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`

Examples:
```
feat: add file size preview in upload component
fix: resolve CAPTCHA reset issue on error
docs: update deployment instructions for Vercel
style: improve mobile responsiveness of form
```

## Testing

Before submitting changes:

1. Test locally with both frontend and backend running
2. Verify all features still work (see [TESTING.md](TESTING.md))
3. Test on multiple screen sizes
4. Check browser console for errors
5. Verify email delivery still works

## Common Tasks

### Adding a New Feedback Type

1. Update `client/src/utils/constants.js`:
```javascript
export const FEEDBACK_TYPES = [
  'Suggestion',
  'Concern',
  'Safety Issue',
  'Process Improvement',
  'New Type Here',  // Add here
  'Other'
]
```

### Changing Email Template

Edit `api/utils/email.js`, specifically the `emailHTML` variable.

### Modifying Form Fields

1. Update state in `client/src/pages/FeedbackForm.jsx`
2. Add UI elements in the form
3. Update validation in `handleSubmit`
4. Update API endpoint in `api/index.js` to handle new field
5. Update email template to include new field

### Adding New Validation

Frontend: `client/src/utils/validation.js`
Backend: `api/index.js` using express-validator

## Deployment

After making changes:

1. Test locally thoroughly
2. Commit changes with clear message
3. Push to repository
4. If connected to Vercel, deployment is automatic
5. Or manually deploy: `vercel --prod`
6. Test on production environment
7. Verify email delivery in production

## Environment Variables

When adding new configuration:

1. Add to `.env.sample` with documentation
2. Add to `api/utils/config.js` for backend
3. Add to `client/.env.sample` if needed for frontend (with VITE_ prefix)
4. Update README.md and SETUP.md with instructions
5. Update Vercel environment variables (document in DEPLOYMENT.md)

## Security Considerations

- Never commit `.env` files
- Never expose secret keys to frontend
- Validate all user input on backend
- Sanitize HTML content
- Keep dependencies updated
- Use HTTPS in production

## Getting Help

- Check existing documentation (README.md, SETUP.md, etc.)
- Review code comments
- Contact IT department for infrastructure questions
- For Vercel issues: [Vercel Docs](https://vercel.com/docs)

## Feature Requests

When proposing new features:

1. Describe the problem it solves
2. Explain the proposed solution
3. Consider impact on existing functionality
4. Note any new dependencies or configuration needed
5. Consider security and privacy implications

## Bug Reports

When reporting bugs:

1. Describe what you expected to happen
2. Describe what actually happened
3. Provide steps to reproduce
4. Include relevant error messages
5. Note your environment (browser, OS, etc.)

## License

This is proprietary software for DeRoyal Industries, Inc. Contributions become property of DeRoyal.

## Questions?

Contact the IT department or Human Resources for guidance.
