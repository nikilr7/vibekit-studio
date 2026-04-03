# 🚀 Quick Fix: Slug Parameter Not Passed

## The Problem
```
{"message":"Page slug required"}
```
The slug parameter isn't being passed to the public page function.

## The Fix

### 1. netlify.toml
Added `force = true` to the redirect:
```toml
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200
  force = true  # ✅ NEW
```

### 2. pages-public.ts
Updated to extract slug from both query params and URL path:
```typescript
let slug = event.queryStringParameters?.slug;

// Fallback: extract from path if not in query params
if (!slug && event.path) {
  const match = event.path.match(/\/p\/([^/]+)/);
  if (match) {
    slug = match[1];
  }
}
```

---

## Deploy in 3 Steps

### Step 1: Commit
```bash
cd vibekit-studio
git add netlify.toml netlify/functions/pages-public.ts
git commit -m "fix: add force=true to public page redirect and improve slug extraction"
git push origin main
```

### Step 2: Clear Cache on Netlify
1. Go to https://app.netlify.com
2. Select **vibekit-studio-nik**
3. **Deploys** → **Trigger deploy** → **Clear cache and redeploy**

### Step 3: Test
- Wait 2-3 minutes
- Go to dashboard
- Click "View Live Page"
- Should see page content ✅

---

## What Changed

**Before (WRONG):**
```toml
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200
  # No force = true
```

**After (CORRECT):**
```toml
[[redirects]]
  from = "/p/:slug"
  to = "/.netlify/functions/pages-public?slug=:slug"
  status = 200
  force = true  # ✅ Forces redirect and passes params correctly
```

---

## How It Works Now

**Request: `/p/untitled-page-4`**
1. Netlify matches `/p/:slug` rule
2. Extracts `slug = untitled-page-4`
3. Redirects to function with `?slug=untitled-page-4`
4. Function receives slug parameter ✅
5. Queries database and returns page data
6. Browser displays page content

---

## Verify It Worked

### In Browser
1. Open https://vibekit-studio-nik.netlify.app/
2. Login
3. Click "View Live Page"
4. Should see page content (not JSON error) ✅

### In DevTools
1. Open F12 → Network tab
2. Click "View Live Page"
3. Check request to `/p/{slug}`
4. Should see 200 status with JSON response ✅

---

## If Still Not Working

1. **Hard refresh:** Ctrl+Shift+R
2. **Check Netlify logs:**
   - Netlify Dashboard → Deploys → Latest → Deploy log
3. **Clear cache again:**
   - Trigger deploy → Clear cache and redeploy
4. **Wait 5 minutes** and try again

---

## Done! 🎉

Public pages should now work perfectly!
