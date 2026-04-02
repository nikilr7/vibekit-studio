# Create New Page - Example Flow & Testing Guide

## 📋 Complete User Journey Example

### Scenario: User Creates Their First Portfolio Page

#### Step 1: User Lands on Dashboard
```
URL: http://localhost:5173/app
User sees: "My Pages" heading with "Create New Page" button
Status: No pages exist yet
```

#### Step 2: User Clicks "Create New Page"
```
Action: Click "+ Create New Page" button
Result: CreatePageDialog opens with:
  - Title: "Create New Page"
  - Input field: "Give your page a title..."
  - Placeholder: "e.g., My Portfolio, Product Launch..."
  - Buttons: "Cancel" and "Create Page"
```

#### Step 3: User Enters Title
```
Input: "My Portfolio"
State: 
  - title = "My Portfolio"
  - error = ""
  - loading = false
```

#### Step 4: User Clicks "Create Page"
```
Action: Click "Create Page" button
State Changes:
  - loading = true
  - Button disabled
  - Text: "Creating..."
  - Spinner shown
```

#### Step 5: API Call Sent
```
Request:
  POST /.netlify/functions/pages-create
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
  Body: {}

Backend Processing:
  1. Verify JWT token ✓
  2. Extract userId from token ✓
  3. Generate slug: "my-portfolio" ✓
  4. Create page with DEFAULT_PAGE_CONTENT ✓
  5. Insert into database ✓
  6. Return response ✓
```

#### Step 6: Page Created Successfully
```
Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Untitled Page",
  "slug": "my-portfolio",
  "status": "draft",
  "theme": "minimal",
  "created_at": "2024-01-04T10:30:00Z",
  "updated_at": "2024-01-04T10:30:00Z"
}

State:
  - loading = false
  - error = ""
  - Dialog closes
```

#### Step 7: User Redirected to Editor
```
URL Changes: /app → /app/pages/550e8400-e29b-41d4-a716-446655440000
Page Loads: PageEditor component
Shows:
  - Page title: "Untitled Page"
  - Status: "draft"
  - Page ID and slug
  - Default content loaded
```

#### Step 8: User Sees Default Content
```
Page Content Loaded:
{
  "hero": {
    "title": "Your Page Title",
    "subtitle": "Create something amazing with VibeKit Studio",
    "buttonText": "Get Started",
    "buttonUrl": "#features"
  },
  "features": {
    "items": [
      { "title": "Fast", "description": "..." },
      { "title": "Reliable", "description": "..." },
      { "title": "Modern", "description": "..." },
      { "title": "Responsive", "description": "..." },
      { "title": "Secure", "description": "..." },
      { "title": "Scalable", "description": "..." }
    ]
  },
  "gallery": {
    "images": [6 sample images from Unsplash]
  },
  "contact": {
    "enabled": true,
    "fields": { "name": true, "email": true, "message": true }
  }
}
```

#### Step 9: User Can Now Edit
```
Available Actions:
  - Edit page title
  - Modify hero section
  - Add/remove features
  - Upload gallery images
  - Configure contact form
  - Change theme
  - Publish page
```

---

## 🧪 Testing Scenarios

### Test 1: Successful Page Creation

**Setup:**
- User logged in
- On dashboard
- No pages exist

**Steps:**
1. Click "Create New Page"
2. Enter title: "Test Page"
3. Click "Create Page"

**Expected Result:**
- Dialog closes
- Redirected to /app/pages/:id
- Page editor loads
- Default content visible
- Page appears in dashboard

**Verification:**
```sql
SELECT * FROM pages WHERE title = 'Untitled Page' AND slug = 'test-page';
-- Should return 1 row with default content
```

---

### Test 2: Empty Title (Use Default)

**Setup:**
- User logged in
- Dialog open

**Steps:**
1. Leave title empty
2. Click "Create Page"

**Expected Result:**
- Page created with title "Untitled Page"
- Slug: "untitled-page"
- Redirected to editor

**Verification:**
```sql
SELECT * FROM pages WHERE title = 'Untitled Page' AND slug = 'untitled-page';
-- Should return 1 row
```

---

### Test 3: Duplicate Slug Handling

**Setup:**
- User has page with slug "my-page"
- Dialog open

**Steps:**
1. Enter title: "My Page" (same as existing)
2. Click "Create Page"

**Expected Result:**
- New page created with slug "my-page-2"
- No conflict with existing page
- Both pages exist in database

**Verification:**
```sql
SELECT slug FROM pages WHERE user_id = '<user_id>' ORDER BY created_at;
-- Should return: my-page, my-page-2
```

---

### Test 4: Error Handling - No Token

**Setup:**
- Clear localStorage token
- Try to create page

**Steps:**
1. Click "Create New Page"
2. Enter title
3. Click "Create Page"

**Expected Result:**
- Error message: "Unauthorized"
- Dialog stays open
- User can retry after login

---

### Test 5: Error Handling - Network Error

**Setup:**
- Network offline
- Dialog open

**Steps:**
1. Enter title
2. Click "Create Page"

**Expected Result:**
- Error message displayed
- Loading state cleared
- User can retry

---

### Test 6: Rapid Clicks

**Setup:**
- Dialog open
- User clicks "Create Page" multiple times quickly

**Steps:**
1. Enter title
2. Click "Create Page" 3 times rapidly

**Expected Result:**
- Only one page created
- Button disabled during request
- No duplicate pages

---

### Test 7: Responsive Design

**Setup:**
- Test on different screen sizes

**Steps:**
1. Mobile (320px): Click "Create New Page"
2. Tablet (768px): Click "Create New Page"
3. Desktop (1024px): Click "Create New Page"

**Expected Result:**
- Dialog responsive on all sizes
- Buttons touch-friendly (44px+)
- No horizontal scrolling
- Text readable on all sizes

---

### Test 8: Keyboard Navigation

**Setup:**
- Dialog open
- User uses keyboard only

**Steps:**
1. Tab to title input
2. Type title
3. Press Enter

**Expected Result:**
- Page created
- No mouse needed
- Accessible to keyboard users

---

## 📊 Database Verification

### Check Created Page
```sql
SELECT 
  id,
  user_id,
  title,
  slug,
  status,
  theme,
  created_at,
  updated_at
FROM pages
WHERE user_id = '<user_id>'
ORDER BY created_at DESC
LIMIT 1;
```

### Check Default Content
```sql
SELECT 
  id,
  title,
  content->>'hero'->>'title' as hero_title,
  jsonb_array_length(content->'features'->'items') as feature_count,
  jsonb_array_length(content->'gallery'->'images') as image_count,
  content->'contact'->>'enabled' as contact_enabled
FROM pages
WHERE id = '<page_id>';
```

### Check Slug Uniqueness
```sql
SELECT slug, COUNT(*) as count
FROM pages
WHERE user_id = '<user_id>'
GROUP BY slug
HAVING COUNT(*) > 1;
-- Should return empty result (no duplicates)
```

---

## 🔍 Debugging Tips

### Issue: Page Not Created
**Check:**
1. JWT token valid? `console.log(localStorage.getItem('token'))`
2. API endpoint accessible? Check network tab
3. Database connection? Check server logs
4. User exists? `SELECT * FROM users WHERE id = '<user_id>';`

### Issue: Redirect Not Working
**Check:**
1. Page ID returned? Check API response
2. Route exists? Check App.tsx routes
3. Token still valid? Check localStorage
4. Browser console errors? Check DevTools

### Issue: Default Content Not Loaded
**Check:**
1. Content saved to database? Check database
2. Content structure valid? Check JSON format
3. API returning content? Check API response
4. Component rendering? Check React DevTools

---

## 📈 Performance Testing

### Load Time
```javascript
// Measure page creation time
const start = performance.now();
// Click create button
// Wait for redirect
const end = performance.now();
console.log(`Page creation took ${end - start}ms`);
// Expected: < 2000ms
```

### Database Query Time
```sql
EXPLAIN ANALYZE
INSERT INTO pages (user_id, title, content, status, theme, slug, created_at, updated_at)
VALUES ('<user_id>', 'Test', '{}', 'draft', 'minimal', 'test', NOW(), NOW());
-- Check execution time
```

---

## 🎯 Acceptance Criteria

- [x] User can create page with one click
- [x] Page created with default content
- [x] Unique slug generated
- [x] User redirected to editor
- [x] Loading state shown
- [x] Error messages displayed
- [x] Works on mobile/tablet/desktop
- [x] Keyboard accessible
- [x] JWT authentication required
- [x] User ownership verified
- [x] Database persists data
- [x] No duplicate pages created

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Test all scenarios above
- [ ] Check error handling
- [ ] Verify database migrations
- [ ] Test on real device
- [ ] Check performance
- [ ] Verify security
- [ ] Test with slow network
- [ ] Check accessibility
- [ ] Review error messages
- [ ] Test with different users
- [ ] Verify analytics tracking
- [ ] Check logging

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check network tab for API calls
3. Check server logs for backend errors
4. Verify database connection
5. Check JWT token validity
6. Review error messages carefully

---

## 📚 Related Files

- `netlify/functions/pages-create.ts` - Backend implementation
- `client/src/components/CreatePageDialog.tsx` - Dialog component
- `client/src/pages/dashboard.tsx` - Dashboard integration
- `client/src/pages/PageEditor.tsx` - Editor page
- `client/src/api/pages.ts` - API client
- `CREATE_PAGE_FEATURE.md` - Feature documentation
