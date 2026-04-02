# Quick Fix - Contact Form Database Error

## Problem
```
error: column "ip_address" does not exist
```

## Root Cause
The `contact_submissions` table was created without the `ip_address` and `user_agent` columns.

## Solution - 3 Steps

### Step 1: Run Migration
Open browser and go to:
```
http://localhost:8888/.netlify/functions/migrate-contact-table
```

You should see:
```json
{
  "success": true,
  "message": "Contact submissions table created successfully with all columns"
}
```

### Step 2: Rebuild Project
```bash
npm run build
```

### Step 3: Test Contact Form
1. Open public page
2. Fill contact form
3. Click "Send Message"
4. Should work! ✅

---

## What the Migration Does

✅ Drops old incomplete table  
✅ Creates new table with all columns:
- id (UUID)
- page_id (UUID)
- name (VARCHAR)
- email (VARCHAR)
- message (TEXT)
- **ip_address (VARCHAR)** ← Was missing
- **user_agent (TEXT)** ← Was missing
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

✅ Creates 4 performance indexes

---

## If Migration Endpoint Doesn't Work

Use psql directly:
```bash
psql $DATABASE_URL
```

Then paste this:
```sql
DROP TABLE IF EXISTS contact_submissions CASCADE;

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  name VARCHAR(100),
  email VARCHAR(255),
  message TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_page_id ON contact_submissions(page_id);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_ip_address ON contact_submissions(ip_address);
```

---

## Verify It Worked

```sql
\d contact_submissions
```

Should show all 9 columns including `ip_address` and `user_agent`.

---

## Done! 🎉

Contact form should now work perfectly!
