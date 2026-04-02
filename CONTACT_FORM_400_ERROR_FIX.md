# Contact Form 400 Error - Debugging Guide

## Issue
Getting `400 Bad Request` when clicking "Send Message" button.

## Root Causes & Fixes

### 1. **Slug Not Being Extracted**
**Problem**: The slug parameter wasn't being properly extracted from the URL.

**Fix Applied**:
- Changed slug extraction to use `event.queryStringParameters?.slug` directly
- Added logging to debug slug extraction
- Removed fallback path parsing that was causing issues

**Verification**:
```
URL: http://localhost:8888/api/public/pages/untitled-page-6/contact
Query Params: ?slug=untitled-page-6
Expected: slug = "untitled-page-6"
```

### 2. **Table Not Existing**
**Problem**: The `contact_submissions` table might not exist in the database.

**Fix Applied**:
- Added automatic table creation in the contact handler
- Table is created with proper schema if it doesn't exist
- Indexes are created for performance

### 3. **Input Sanitization Issues**
**Problem**: Sanitized input wasn't being trimmed properly.

**Fix Applied**:
- Added `.trim()` after sanitization
- Ensures whitespace is removed before validation

---

## Testing After Fix

### Step 1: Verify Database Table
```sql
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'contact_submissions';

-- If not, run:
SELECT * FROM contact_submissions LIMIT 1;
-- This will auto-create the table
```

### Step 2: Test Contact Form Again
1. Open public page: `http://localhost:8888/p/untitled-page-6`
2. Scroll to "Get In Touch"
3. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "This is a test message"
4. Click "Send Message"

### Step 3: Check Browser Console
Open DevTools (F12) → Network tab:
- Look for request to `/api/public/pages/untitled-page-6/contact`
- Check Status Code (should be 200, not 400)
- Check Response body for success message

### Step 4: Verify Submission in Database
```sql
SELECT * FROM contact_submissions 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## Common 400 Errors & Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Page slug required" | Slug not in query params | Check URL format |
| "Invalid request body" | JSON parsing failed | Check form data format |
| "Invalid email address" | Email format wrong | Use valid email |
| "Message must be at least 10 characters" | Message too short | Add more text |
| "Name must be at least 2 characters" | Name too short | Add more characters |

---

## Debugging Steps

### If Still Getting 400:

1. **Check Network Request**:
   - Open DevTools → Network tab
   - Click "Send Message"
   - Find the `contact` request
   - Check "Request Headers" for:
     - `Content-Type: application/json`
     - Correct URL with slug
   - Check "Request Payload" for form data

2. **Check Server Logs**:
   - Look for console output in Netlify function logs
   - Should show: `Contact submission received: { slug, submission }`
   - If slug is missing, URL is wrong

3. **Verify Page is Published**:
   - Go to Dashboard
   - Check page status is "Published" (not "Draft")
   - Copy exact slug from URL

4. **Test with cURL**:
   ```bash
   curl -X POST http://localhost:8888/api/public/pages/untitled-page-6/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "message": "This is a test message"
     }'
   ```

---

## Files Modified

1. **pages-contact.ts**:
   - Fixed slug extraction from query parameters
   - Added automatic table creation
   - Added logging for debugging
   - Improved input trimming

2. **init-contact-table.ts** (new):
   - Standalone function to initialize table
   - Can be called manually if needed

---

## Next Steps

1. Rebuild the project: `npm run build`
2. Restart Netlify dev server
3. Test contact form again
4. Check browser console for any errors
5. Check network tab for response details

If still having issues, share the exact error message from the Response tab in DevTools.
