# Fix: Netlify Functions 404 Error

## Problem
```
POST https://vibekit-studio-nik.netlify.app/.netlify/functions/login 404 (Not Found)
```

Serverless functions are not being deployed or found by Netlify.

---

## Root Cause

The `functions` path in `netlify.toml` must be relative to the `base` directory:
- `base = "client"` means Netlify runs from the client directory
- Functions path must be `../netlify/functions` (go up one level from client)

---

## Solution

### 1. Update netlify.toml

**File:** `vibekit-studio/netlify.toml`

```toml
[build]
  base = "client"
  command = "npm run build"
  functions = "../netlify/functions"
  publish = "dist"
```

**Key Change:**
- ❌ `functions = "netlify/functions"` (WRONG - looks in client/netlify/functions)
- ✅ `functions = "../netlify/functions"` (CORRECT - goes up to root, then into netlify/functions)

### 2. Verify Folder Structure

```
vibekit-studio/
├── netlify.toml                    ✅ Root level
├── netlify/
│   └── functions/
│       ├── login.ts               ✅ Function exists
│       ├── auth.ts
│       ├── pages-create.ts
│       └── ... (other functions)
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── package.json
```

### 3. Verify Dependencies

**Root package.json** should have:
```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.20.0"
  }
}
```

---

## Deployment Steps

### Step 1: Commit Changes
```bash
cd vibekit-studio
git add netlify.toml
git commit -m "fix: correct functions path in netlify.toml"
git push origin main
```

### Step 2: Clear Netlify Cache
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site (vibekit-studio-nik)
3. Go to **Deploys** tab
4. Click **Trigger deploy** → **Clear cache and redeploy**

### Step 3: Wait for Deployment
- Netlify will rebuild and redeploy
- Check deployment logs for errors
- Should complete in 2-3 minutes

### Step 4: Verify Functions Deployed
1. Go to **Functions** tab in Netlify Dashboard
2. You should see all functions listed:
   - login
   - auth
   - pages-create
   - pages-get
   - pages-update
   - pages-delete
   - pages-publish
   - pages-unpublish
   - pages-duplicate
   - pages-public
   - pages-view
   - pages-contact
   - pages-submissions

---

## Testing

### Test Login Function
```bash
curl -X POST https://vibekit-studio-nik.netlify.app/.netlify/functions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected response:
```json
{
  "message": "User not found"
}
```
(or "Invalid password" if user exists)

### Test in Browser
1. Go to https://vibekit-studio-nik.netlify.app/login
2. Try to login
3. Check browser console (F12)
4. Should NOT see 404 error

---

## Troubleshooting

### Issue: Functions Still Not Found

**Solution 1: Check netlify.toml Syntax**
```bash
# Verify file exists and has correct content
cat netlify.toml
```

Should show:
```
functions = "../netlify/functions"
```

**Solution 2: Verify Functions Directory**
```bash
# Check functions exist
ls -la netlify/functions/
```

Should list all .ts files

**Solution 3: Check Netlify Logs**
1. Netlify Dashboard → Deploys
2. Click latest deploy
3. Scroll to "Deploy log"
4. Look for errors like:
   - "Functions directory not found"
   - "TypeScript compilation errors"

**Solution 4: Rebuild from Scratch**
```bash
# Clear everything
rm -rf node_modules client/node_modules .netlify

# Reinstall
npm install
cd client && npm install && cd ..

# Commit and push
git add .
git commit -m "fix: reinstall dependencies"
git push origin main
```

### Issue: TypeScript Compilation Error

**Check:**
- All .ts files in `netlify/functions/` are valid TypeScript
- `netlify/functions/tsconfig.json` exists
- No syntax errors in function files

**Fix:**
```bash
# Test TypeScript compilation
npx tsc --noEmit
```

---

## Updated netlify.toml

```toml
# Netlify configuration
[build]
  base = "client"
  command = "npm run build"
  functions = "../netlify/functions"
  publish = "dist"

# Function redirects (optional but helpful)
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

# SPA Fallback - Handle all routes for React Router
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ✅ Expected Result

After deployment:
- ✅ Functions appear in Netlify Dashboard → Functions tab
- ✅ Login endpoint responds (no 404)
- ✅ All API calls work
- ✅ Dashboard loads and functions properly
- ✅ No console errors

---

## Quick Checklist

- [ ] netlify.toml has `functions = "../netlify/functions"`
- [ ] netlify/functions/ directory exists with .ts files
- [ ] Root package.json has dependencies (bcryptjs, jsonwebtoken, pg)
- [ ] Changes committed and pushed to GitHub
- [ ] Netlify dashboard shows successful deployment
- [ ] Functions tab shows all functions
- [ ] Login endpoint responds without 404

---

## Support

If issues persist:
1. Check Netlify deployment logs
2. Verify netlify.toml syntax
3. Ensure functions directory structure is correct
4. Try clearing cache and redeploying
5. Contact Netlify support if needed
