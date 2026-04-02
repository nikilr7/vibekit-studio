# Contact Form Testing Guide

## Fixed Issues

### 1. **Client-Side Validation**
- Added required field validation before submission
- Shows specific error messages for missing fields
- Prevents submission if required fields are empty

### 2. **Button Click Handler**
- Added explicit `onClick={handleSubmit}` to button
- Ensures form submission is triggered properly
- Button disables during submission with visual feedback

### 3. **Backend Validation**
- Improved JSON parsing with error handling
- Better IP address extraction with fallbacks
- Validates at least one field has content
- Proper error messages for all validation failures

### 4. **Error Handling**
- Client-side errors display immediately
- Backend errors show user-friendly messages
- Console logging for debugging

---

## Testing Steps

### Step 1: Publish a Page
1. Go to Dashboard
2. Create or select a page
3. Enable Contact Form in page settings
4. Select which fields to show (Name, Email, Message)
5. Click "Publish" button
6. Copy the public page URL

### Step 2: Test Contact Form

#### Test Case 1: Valid Submission
1. Open the public page URL in browser
2. Scroll to "Get In Touch" section
3. Fill in all fields:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Message: "This is a test message for the contact form"
4. Click "Send Message" button
5. **Expected Result**: 
   - Button shows "Sending..." with spinner
   - Success toast appears: "Message sent!"
   - Form clears automatically
   - No errors in console

#### Test Case 2: Missing Required Fields
1. Open the public page URL
2. Scroll to "Get In Touch" section
3. Leave Name field empty
4. Fill Email and Message
5. Click "Send Message"
6. **Expected Result**: 
   - Error message: "Name is required"
   - Form does NOT submit
   - Button remains enabled

#### Test Case 3: Invalid Email
1. Fill Name: "John Doe"
2. Fill Email: "invalid-email"
3. Fill Message: "Test message here"
4. Click "Send Message"
5. **Expected Result**: 
   - Error message: "Invalid email address"
   - Form does NOT submit

#### Test Case 4: Message Too Short
1. Fill Name: "John Doe"
2. Fill Email: "john@example.com"
3. Fill Message: "Short" (less than 10 characters)
4. Click "Send Message"
5. **Expected Result**: 
   - Error message: "Message must be at least 10 characters"
   - Form does NOT submit

#### Test Case 5: Rate Limiting
1. Submit 5 valid contact forms from same IP
2. Try to submit 6th form
3. **Expected Result**: 
   - Error message: "Too many submissions. Please try again later."
   - Rate limit resets after 1 hour

#### Test Case 6: Partial Form (Only Email)
1. Enable only Email field in page settings
2. Publish page
3. Open public page
4. Fill Email: "test@example.com"
5. Click "Send Message"
6. **Expected Result**: 
   - Form submits successfully
   - Success message appears
   - Message stored in database

---

## Verification Checklist

- [ ] Contact form appears on published pages
- [ ] All enabled fields display correctly
- [ ] "Send Message" button is clickable
- [ ] Form validates required fields
- [ ] Form validates email format
- [ ] Form validates message length
- [ ] Success toast appears on valid submission
- [ ] Error toast appears on invalid submission
- [ ] Form clears after successful submission
- [ ] Button shows loading state during submission
- [ ] Rate limiting works (5 per hour per IP)
- [ ] Submissions appear in Messages tab
- [ ] No console errors

---

## Debugging

### If Button Doesn't Work:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for JavaScript errors
4. Look for network requests to `/api/public/pages/:slug/contact`
5. Check response status and error message

### If Form Doesn't Submit:
1. Check browser console for errors
2. Verify page is published (status = "published")
3. Verify contact form is enabled in page settings
4. Verify at least one field is enabled
5. Check network tab for API response

### If Submissions Don't Appear:
1. Verify database connection
2. Check if `contact_submissions` table exists
3. Run migration: `migrate-contact-submissions.ts`
4. Check page ownership in Messages tab

---

## API Response Examples

### Success Response (200)
```json
{
  "success": true,
  "message": "Thank you for your message. We'll get back to you soon!",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Response (400)
```json
{
  "message": "Invalid email address"
}
```

### Rate Limit Response (429)
```json
{
  "message": "Too many submissions. Please try again later."
}
```

---

## Database Query to View Submissions

```sql
SELECT * FROM contact_submissions 
WHERE page_id = 'your-page-id' 
ORDER BY created_at DESC;
```

---

## Summary of Fixes

| Issue | Fix | Status |
|-------|-----|--------|
| Button not responding | Added explicit onClick handler | ✅ Fixed |
| Form not validating | Added client-side validation | ✅ Fixed |
| Missing error messages | Improved error handling | ✅ Fixed |
| JSON parsing errors | Added try-catch for parsing | ✅ Fixed |
| IP extraction issues | Added fallback IP sources | ✅ Fixed |
| No field validation | Added "at least one field" check | ✅ Fixed |

