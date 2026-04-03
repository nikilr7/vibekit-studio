# Fix: Public Page Slug Parameter Not Passed

## Problem
```
{"message":"Page slug required"}
```

The public page function receives the request but the slug parameter is not being passed correctly.

---

## Root Cause

The redirect rule wasn't properly passing the `:slug` parameter to the function query string.

---

## Solution

### 1. Update netlify.toml

Add `force = true` to the public page redirect:

```toml
# Public page route - rewrite to function
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200
  force = true
```

**What `force = true` does:**
- Forces the redirect even if a file exists
- Ensures the redirect is applied consistently
- Passes parameters correctly

### 2. Update pages-public Function

The function now extracts slug from both query params and URL path:

```typescript
// Extract slug from query parameters (from redirect)
let slug = event.queryStringParameters?.slug;

// Fallback: extract from path if not in query params
if (!slug && event.path) {
  const match = event.path.match(/\/p\/([^/]+)/);
  if (match) {
    slug = match[1];
  }
}
```

This ensures the slug is captured regardless of how the redirect passes it.

---

## Complete Updated netlify.toml

```toml
# Netlify configuration
[build]
  base = "client"
  command = "npm run build"
  functions = "../netlify/functions"
  publish = "dist"

# Public page route - rewrite to function
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200
  force = true

# Function redirects
[[redirects]]
  from = "/.netlify/functions/login"
  to = "/.netlify/functions/login"
  status = 200

[[redirects]]
  from = "/.netlify/functions/auth"
  to = "/.netlify/functions/auth"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages"
  to = "/.netlify/functions/pages"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-create"
  to = "/.netlify/functions/pages-create"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-get"
  to = "/.netlify/functions/pages-get"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-update"
  to = "/.netlify/functions/pages-update"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-delete"
  to = "/.netlify/functions/pages-delete"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-publish"
  to = "/.netlify/functions/pages-publish"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-unpublish"
  to = "/.netlify/functions/pages-unpublish"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-duplicate"
  to = "/.netlify/functions/pages-duplicate"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-public"
  to = "/.netlify/functions/pages-public"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-view"
  to = "/.netlify/functions/pages-view"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-contact"
  to = "/.netlify/functions/pages-contact"
  status = 200

[[redirects]]
  from = "/.netlify/functions/pages-submissions"
  to = "/.netlify/functions/pages-submissions"
  status = 200

# SPA Fallback - Handle all routes for React Router (MUST BE LAST)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Deployment Steps

### Step 1: Commit Changes
```bash
cd vibekit-studio
git add netlify.toml netlify/functions/pages-public.ts
git commit -m "fix: add force=true to public page redirect and improve slug extraction"
git push origin main
```

### Step 2: Clear Netlify Cache
1. Go to https://app.netlify.com
2. Select **vibekit-studio-nik**
3. **Deploys** → **Trigger deploy** → **Clear cache and redeploy**

### Step 3: Wait for Deployment
- Wait 2-3 minutes for deployment to complete

### Step 4: Test
1. Go to https://vibekit-studio-nik.netlify.app/
2. Login to dashboard
3. Click "View Live Page" on a published page
4. Should see page content (not JSON) ✅

---

## Testing

### Test Direct URL
```bash
curl https://vibekit-studio-nik.netlify.app/p/untitled-page-4
```

Expected response: JSON with page data
```json
{
  "id": "...",
  "title": "Page Title",
  "content": {...},
  "theme": "minimal",
  "slug": "untitled-page-4",
  "view_count": 5,
  "created_at": "...",
  "updated_at": "..."
}
```

### Test in Browser
1. Open DevTools (F12)
2. Go to Network tab
3. Click "View Live Page"
4. Check request to `/p/{slug}`
5. Should see 200 status with JSON response ✅

---

## Troubleshooting

### Issue: Still Getting "Page slug required"

**Solution 1: Check Netlify Logs**
1. Netlify Dashboard → Deploys → Latest
2. Scroll to "Deploy log"
3. Look for redirect rules being processed

**Solution 2: Verify netlify.toml**
```bash
cat netlify.toml | grep -A 3 "from = \"/p/:slug\""
```

Should show:
```
from = "/p/:slug"
to = "/.netlify/functions/pages-public?slug=:slug"
status = 200
force = true
```

**Solution 3: Hard Refresh**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**Solution 4: Clear Browser Cache**
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty cache and hard refresh"

### Issue: Page Not Found (404)

**Check:**
- Page exists in database
- Page status is 'published'
- Slug matches exactly (case-sensitive)

**Test database:**
```sql
SELECT id, title, slug, status FROM pages WHERE slug = 'untitled-page-4';
```

Should return a row with `status = 'published'`

---

## How It Works Now

**Request: `/p/untitled-page-4`**

1. Netlify checks redirects top-to-bottom
2. Matches `/p/:slug` rule with `slug = untitled-page-4`
3. Redirects to `/.netlify/functions/pages-public?slug=untitled-page-4`
4. Function receives query parameter `slug = untitled-page-4`
5. Function queries database for published page with that slug
6. Returns page data as JSON
7. Browser displays page content

---

## ✅ Expected Result

After deployment:
- ✅ Public pages load with content
- ✅ Slug parameter passed correctly
- ✅ No "Page slug required" error
- ✅ Page data displays properly
- ✅ View count increments

---

## Quick Checklist

- [ ] netlify.toml has `force = true` on `/p/:slug` redirect
- [ ] pages-public.ts updated with slug extraction fallback
- [ ] Changes committed and pushed
- [ ] Netlify deployment successful
- [ ] Cache cleared on Netlify
- [ ] Public page loads with content
- [ ] No "Page slug required" error

---

## Support

If issues persist:
1. Check Netlify deployment logs
2. Verify netlify.toml syntax
3. Test function directly with curl
4. Check database for published pages
5. Contact Netlify support if needed
