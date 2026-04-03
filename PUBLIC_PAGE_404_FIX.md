# Fix: Public Page 404 Error

## Problem
```
Error fetching public page: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

When clicking "View Live Page", it opens a new tab but shows 404 error.

---

## Root Cause

The SPA fallback redirect `from = "/*"` is catching the `/p/{slug}` route and redirecting it to `/index.html` (which returns HTML, not JSON).

**Order matters in netlify.toml!** Redirects are processed top-to-bottom. The first matching rule wins.

---

## Solution

### Update netlify.toml

**Key Change:** Add explicit redirect for `/p/:slug` BEFORE the SPA fallback

```toml
# Public page route - must come BEFORE SPA fallback
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200

# ... other function redirects ...

# SPA Fallback - Handle all routes for React Router (MUST BE LAST)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Why This Works:**
1. Request comes in: `/p/untitled-page-5`
2. Netlify checks redirects top-to-bottom
3. Matches `/p/:slug` rule first ✅
4. Routes to `/.netlify/functions/pages-public?slug=untitled-page-5`
5. Function returns JSON with page data
6. Browser displays public page

---

## Complete Updated netlify.toml

```toml
# Netlify configuration
[build]
  base = "client"
  command = "npm run build"
  functions = "../netlify/functions"
  publish = "dist"

# Public page route - must come BEFORE SPA fallback
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200

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
git add netlify.toml
git commit -m "fix: add explicit redirect for public pages before SPA fallback"
git push origin main
```

### Step 2: Clear Netlify Cache
1. Go to https://app.netlify.com
2. Select **vibekit-studio-nik**
3. **Deploys** tab → **Trigger deploy** → **Clear cache and redeploy**

### Step 3: Wait for Deployment
- Wait 2-3 minutes for deployment to complete
- Check deployment logs for any errors

### Step 4: Test
1. Go to https://vibekit-studio-nik.netlify.app/
2. Login to dashboard
3. Click "Share" on a published page
4. Click "View Live Page"
5. Should open new tab with public page ✅

---

## Testing

### Test Public Page URL Directly
```bash
# Replace with your actual slug
curl https://vibekit-studio-nik.netlify.app/p/untitled-page-5
```

Expected response: JSON with page data
```json
{
  "id": "...",
  "title": "Page Title",
  "content": {...},
  "theme": "minimal",
  "slug": "untitled-page-5",
  "view_count": 5,
  "created_at": "...",
  "updated_at": "..."
}
```

### Test in Browser
1. Open DevTools (F12)
2. Go to Network tab
3. Click "View Live Page"
4. Check the request to `/p/{slug}`
5. Should see 200 status with JSON response ✅

---

## Troubleshooting

### Issue: Still Getting 404

**Solution 1: Hard Refresh**
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

**Solution 2: Check Netlify Logs**
1. Netlify Dashboard → Deploys
2. Click latest deploy
3. Scroll to "Deploy log"
4. Look for redirect rules being processed

**Solution 3: Verify netlify.toml**
```bash
# Check file content
cat netlify.toml

# Verify /p/:slug redirect comes BEFORE /* redirect
```

**Solution 4: Clear Browser Cache**
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty cache and hard refresh"

### Issue: Still Getting HTML Instead of JSON

**Check:**
- pages-public function exists in Netlify Functions tab
- Function has no errors in logs
- Database connection is working
- Page exists in database with status = 'published'

**Test function directly:**
```bash
curl "https://vibekit-studio-nik.netlify.app/.netlify/functions/pages-public?slug=untitled-page-5"
```

Should return JSON, not HTML.

---

## How Redirects Work in netlify.toml

Redirects are processed **top-to-bottom**. The first matching rule wins.

**Example:**
```toml
# Rule 1 - Specific route
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200

# Rule 2 - Catch-all (MUST BE LAST)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Request: `/p/my-page`**
1. Check Rule 1: `/p/:slug` matches ✅ → Use this rule
2. Don't check Rule 2

**Request: `/dashboard`**
1. Check Rule 1: `/p/:slug` doesn't match ❌
2. Check Rule 2: `/*` matches ✅ → Use this rule

---

## ✅ Expected Result

After deployment:
- ✅ Public pages load without 404
- ✅ Page data displays correctly
- ✅ View count increments
- ✅ Contact form works
- ✅ No JSON parsing errors

---

## Quick Checklist

- [ ] netlify.toml has `/p/:slug` redirect BEFORE `/*`
- [ ] `/p/:slug` redirect points to pages-public function
- [ ] Changes committed and pushed
- [ ] Netlify deployment successful
- [ ] Cache cleared on Netlify
- [ ] Public page loads in new tab
- [ ] No 404 or JSON errors

---

## Support

If issues persist:
1. Check Netlify deployment logs
2. Verify redirect order in netlify.toml
3. Test function directly with curl
4. Check database for published pages
5. Contact Netlify support if needed
