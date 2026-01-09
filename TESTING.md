# Testing Guide

This guide will help you test all features of the Employee Feedback System.

## Prerequisites

- Application running locally or deployed
- Valid passphrase
- reCAPTCHA configured
- Email receiving configured

## Test Cases

### 1. Landing Page Tests

#### Test 1.1: Page Load
- **Action**: Navigate to the application URL
- **Expected**: Modern landing page displays with passphrase field
- **Pass Criteria**: Page loads without errors, branding visible

#### Test 1.2: Invalid Passphrase
- **Action**: Enter incorrect passphrase and submit
- **Expected**: Error message "Invalid passphrase. Please try again."
- **Pass Criteria**: Error displays, form doesn't proceed

#### Test 1.3: Valid Passphrase
- **Action**: Enter correct passphrase and submit
- **Expected**: Redirected to feedback form page
- **Pass Criteria**: Form page loads with all fields visible

#### Test 1.4: Session Persistence
- **Action**: After authentication, refresh the page
- **Expected**: Remain on feedback form (don't need to re-authenticate)
- **Pass Criteria**: sessionStorage maintains authentication

### 2. Feedback Form Tests

#### Test 2.1: Form Display
- **Action**: Verify all form elements are present
- **Expected**: Type dropdown, rich text editor, file upload, anonymous toggle, contact fields, CAPTCHA, submit button all visible
- **Pass Criteria**: All fields render correctly

#### Test 2.2: Type Selection
- **Action**: Open type dropdown
- **Expected**: Options: Suggestion, Concern, Safety Issue, Process Improvement, Other
- **Pass Criteria**: All 5 options present and selectable

#### Test 2.3: Rich Text Editor
- **Actions**:
  1. Type text in editor
  2. Bold some text
  3. Change font size
  4. Change text color
  5. Add bullet list
- **Expected**: All formatting options work, character counter updates
- **Pass Criteria**: Text formats correctly, counter shows accurate count

#### Test 2.4: Character Limit
- **Action**: Type or paste more than 5000 characters
- **Expected**: Editor stops accepting input at 5000 characters
- **Pass Criteria**: Character limit enforced, counter shows 5000/5000

#### Test 2.5: File Upload - Valid File
- **Action**: Upload a PDF file under 5MB
- **Expected**: File displays with name and size, remove button available
- **Pass Criteria**: File attached successfully

#### Test 2.6: File Upload - File Too Large
- **Action**: Attempt to upload a file over 5MB
- **Expected**: Error message "File size must be less than 5MB"
- **Pass Criteria**: File rejected, error message shown

#### Test 2.7: File Upload - Invalid Type
- **Action**: Attempt to upload an .exe or other invalid file type
- **Expected**: Error message about invalid file type
- **Pass Criteria**: File rejected with appropriate error

#### Test 2.8: File Removal
- **Action**: Upload a file, then click remove button
- **Expected**: File removed, upload area returns to initial state
- **Pass Criteria**: File successfully removed

#### Test 2.9: Anonymous Toggle - Checked
- **Action**: Ensure "Submit Anonymously" is checked
- **Expected**: Contact fields (email, name, title, location) not visible
- **Pass Criteria**: Contact section hidden

#### Test 2.10: Anonymous Toggle - Unchecked
- **Action**: Uncheck "Submit Anonymously"
- **Expected**: Contact fields appear, email field marked required
- **Pass Criteria**: Contact fields visible and functional

#### Test 2.11: CAPTCHA Display
- **Action**: Verify reCAPTCHA widget loads
- **Expected**: "I'm not a robot" checkbox appears
- **Pass Criteria**: CAPTCHA widget renders correctly

### 3. Validation Tests

#### Test 3.1: Submit Empty Form
- **Action**: Click submit without filling any fields
- **Expected**: Error message requesting required fields
- **Pass Criteria**: Submission blocked, appropriate error shown

#### Test 3.2: Submit Without Type
- **Action**: Fill description but leave type empty, complete CAPTCHA, submit
- **Expected**: Error "Please select a feedback type"
- **Pass Criteria**: Validation catches missing type

#### Test 3.3: Submit Without Description
- **Action**: Select type but leave description empty, complete CAPTCHA, submit
- **Expected**: Error "Please provide a description"
- **Pass Criteria**: Validation catches empty description

#### Test 3.4: Submit Without CAPTCHA
- **Action**: Fill all required fields but don't complete CAPTCHA
- **Expected**: Submit button disabled OR error about CAPTCHA
- **Pass Criteria**: Can't submit without CAPTCHA

#### Test 3.5: Submit Non-Anonymous Without Email
- **Action**: Uncheck anonymous, fill form but leave email empty, complete CAPTCHA
- **Expected**: Error "Email is required when not submitting anonymously"
- **Pass Criteria**: Email validation works for non-anonymous

#### Test 3.6: Invalid Email Format
- **Action**: Enter invalid email (e.g., "notanemail"), submit
- **Expected**: Error about invalid email format
- **Pass Criteria**: Email format validation works

### 4. Honeypot Tests

#### Test 4.1: Honeypot Empty (Normal User)
- **Action**: Submit form normally (honeypot field should be invisible and empty)
- **Expected**: Submission proceeds normally
- **Pass Criteria**: Honeypot doesn't interfere with legitimate submissions

#### Test 4.2: Honeypot Filled (Bot Detection)
- **Action**: Using browser console, fill the honeypot field: `document.querySelector('input[name="honeypot"]').value = 'bot'`, then submit
- **Expected**: Submission rejected with generic error
- **Pass Criteria**: Bot detected and blocked

### 5. Submission Tests

#### Test 5.1: Successful Anonymous Submission
- **Actions**:
  1. Fill type: "Suggestion"
  2. Fill description: "Test anonymous feedback"
  3. Keep anonymous checked
  4. Complete CAPTCHA
  5. Submit
- **Expected**: 
  - Success page appears
  - Email received at configured address
  - Email shows "Anonymous" submission
- **Pass Criteria**: Submission succeeds, email received

#### Test 5.2: Successful Non-Anonymous Submission
- **Actions**:
  1. Fill type: "Concern"
  2. Fill description: "Test identified feedback"
  3. Uncheck anonymous
  4. Fill email, name, title, location
  5. Complete CAPTCHA
  6. Submit
- **Expected**: 
  - Success page appears
  - Email received with contact information
- **Pass Criteria**: Submission succeeds, contact info in email

#### Test 5.3: Submission With Attachment
- **Actions**:
  1. Fill required fields
  2. Upload a PDF file
  3. Complete CAPTCHA
  4. Submit
- **Expected**: 
  - Success page appears
  - Email received with attachment
- **Pass Criteria**: File successfully attached to email

#### Test 5.4: Submission With Rich Text
- **Actions**:
  1. Fill description with formatted text (bold, colors, lists)
  2. Complete other fields and CAPTCHA
  3. Submit
- **Expected**: 
  - Email received with HTML formatting preserved
- **Pass Criteria**: Formatting appears in email

### 6. Success Page Tests

#### Test 6.1: Success Page Display
- **Action**: After successful submission, verify success page
- **Expected**: Thank you message, confirmation of submission
- **Pass Criteria**: Success page displays with appropriate messaging

#### Test 6.2: Submit Another Feedback
- **Action**: Click "Submit Another Feedback" button
- **Expected**: Return to landing page, authentication cleared
- **Pass Criteria**: Can start new submission

#### Test 6.3: Close Window
- **Action**: Click "Close Window" button
- **Expected**: Browser window/tab attempts to close
- **Pass Criteria**: Close action triggered

### 7. Email Tests

#### Test 7.1: Email Delivery
- **Action**: Submit feedback
- **Expected**: Email arrives at bparish@deroyal.com within 1-2 minutes
- **Pass Criteria**: Email received successfully

#### Test 7.2: Email Content - Anonymous
- **Action**: Check email from anonymous submission
- **Expected**: 
  - Subject: "New Employee Feedback Submission - [Type]"
  - Body contains type and description
  - Shows "Anonymous" submission
  - No contact information
- **Pass Criteria**: Email formatted correctly

#### Test 7.3: Email Content - Identified
- **Action**: Check email from non-anonymous submission
- **Expected**: 
  - Body contains contact information
  - Email, name, title, location all present
  - Shows "Not Anonymous"
- **Pass Criteria**: Contact info included in email

#### Test 7.4: Email Content - With Attachment
- **Action**: Check email from submission with attachment
- **Expected**: Email has file attached, downloadable
- **Pass Criteria**: Attachment present and accessible

### 8. Security Tests

#### Test 8.1: SQL Injection Attempt
- **Action**: Enter SQL injection strings in text fields (e.g., `'; DROP TABLE--`)
- **Expected**: Treated as regular text, no security issues
- **Pass Criteria**: No errors, text stored/sent safely

#### Test 8.2: XSS Attempt
- **Action**: Enter `<script>alert('xss')</script>` in description
- **Expected**: Text sanitized or escaped, no script execution
- **Pass Criteria**: Script doesn't execute, stored safely

#### Test 8.3: CAPTCHA Bypass Attempt
- **Action**: Try submitting form without CAPTCHA or with invalid token
- **Expected**: Submission rejected
- **Pass Criteria**: CAPTCHA required and validated server-side

#### Test 8.4: Passphrase Brute Force
- **Action**: Attempt multiple incorrect passphrases rapidly
- **Expected**: Each rejected (rate limiting ideal but not implemented)
- **Pass Criteria**: Invalid passphrases consistently rejected

### 9. Responsive Design Tests

#### Test 9.1: Mobile View (375px)
- **Action**: Resize browser to mobile width
- **Expected**: All elements stack vertically, remain readable and functional
- **Pass Criteria**: Mobile-friendly layout

#### Test 9.2: Tablet View (768px)
- **Action**: Resize browser to tablet width
- **Expected**: Layout adjusts appropriately
- **Pass Criteria**: Tablet-friendly layout

#### Test 9.3: Desktop View (1920px)
- **Action**: View on large desktop screen
- **Expected**: Layout centered, not stretched excessively
- **Pass Criteria**: Desktop layout looks good

### 10. Browser Compatibility Tests

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

#### Test 10.1: Basic Functionality
- **Action**: Complete full submission flow in each browser
- **Expected**: All features work consistently
- **Pass Criteria**: No browser-specific issues

### 11. Error Recovery Tests

#### Test 11.1: Network Error During Submission
- **Action**: Disconnect network, attempt submission
- **Expected**: Error message about connection failure
- **Pass Criteria**: Graceful error handling, form data preserved

#### Test 11.2: Server Error
- **Action**: Stop API server, attempt submission
- **Expected**: Error message about server unavailability
- **Pass Criteria**: User-friendly error message

#### Test 11.3: CAPTCHA Expiration
- **Action**: Complete CAPTCHA, wait 2+ minutes without submitting
- **Expected**: May need to re-verify CAPTCHA (depends on Google's timeout)
- **Pass Criteria**: Handles expired CAPTCHA gracefully

### 12. Accessibility Tests

#### Test 12.1: Keyboard Navigation
- **Action**: Navigate entire form using only Tab and Enter keys
- **Expected**: Can access all fields and submit form
- **Pass Criteria**: Full keyboard accessibility

#### Test 12.2: Screen Reader
- **Action**: Use screen reader (if available) to navigate form
- **Expected**: All fields properly labeled and announced
- **Pass Criteria**: Screen reader compatible

#### Test 12.3: Focus Indicators
- **Action**: Tab through form, observe focus indicators
- **Expected**: Clear visual indication of focused element
- **Pass Criteria**: Focus visible on all interactive elements

## Test Results Template

Create a test results document:

```markdown
# Test Results - [Date]

## Environment
- Browser: 
- OS:
- Deployment: Local / Vercel

## Test Summary
- Total Tests: 
- Passed: 
- Failed: 
- Skipped: 

## Failed Tests
[List any failed tests with details]

## Notes
[Any additional observations]

## Sign-off
Tested by: 
Date:
```

## Automated Testing (Future Enhancement)

For production deployments, consider adding:
- Jest/Vitest for unit tests
- Playwright/Cypress for E2E tests
- API endpoint tests with Supertest

## Conclusion

All tests should pass before deploying to production. Pay special attention to:
- Email delivery (most critical)
- CAPTCHA functionality
- File upload validation
- Data validation
- Security measures
