# Contact Form - Database Migration Guide

## Issue
The `contact_submissions` table was missing the `ip_address` and `user_agent` columns, causing the contact form to fail with:
```
error: column "ip_address" does not exist
```

## Solution
Run the migration to recreate the table with all required columns.

---

## How to Run Migration

### Option 1: Using Netlify Function (Recommended)

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Call the migration endpoint** in your browser or terminal:
   ```
   http://localhost:8888/.netlify/functions/migrate-contact-table
   ```

3. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Contact submissions table created successfully with all columns"
   }
   ```

### Option 2: Using psql (Direct Database)

1. **Connect to your database**:
   ```bash
   psql $DATABASE_URL
   ```

2. **Run these commands**:
   ```sql
   -- Drop existing table
   DROP TABLE IF EXISTS contact_submissions CASCADE;

   -- Create new table with all columns
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

   -- Create indexes
   CREATE INDEX idx_contact_submissions_page_id ON contact_submissions(page_id);
   CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
   CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
   CREATE INDEX idx_contact_submissions_ip_address ON contact_submissions(ip_address);
   ```

3. **Verify table was created**:
   ```sql
   \d contact_submissions
   ```

---

## Verify Migration Success

### Check Table Structure
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position;
```

**Expected Output**:
```
column_name    | data_type
---------------+-----------
id             | uuid
page_id        | uuid
name           | character varying
email          | character varying
message        | text
ip_address     | character varying
user_agent     | text
created_at     | timestamp
updated_at     | timestamp
```

### Check Indexes
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'contact_submissions';
```

**Expected Output**:
```
idx_contact_submissions_page_id
idx_contact_submissions_created_at
idx_contact_submissions_email
idx_contact_submissions_ip_address
```

---

## After Migration

1. **Rebuild the project**:
   ```bash
   npm run build
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Test the contact form**:
   - Open public page
   - Fill contact form
   - Click "Send Message"
   - Should now work! ✅

---

## Files Modified

1. **netlify/functions/migrate-contact-table.ts** (new)
   - Drops and recreates the table with proper schema
   - Creates all necessary indexes
   - Can be called via HTTP endpoint

2. **netlify/functions/pages-contact.ts**
   - Removed inline table creation
   - Now relies on migration for schema setup

---

## Troubleshooting

### If Migration Fails

1. **Check database connection**:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. **Check if pages table exists**:
   ```sql
   SELECT * FROM pages LIMIT 1;
   ```

3. **Check for foreign key issues**:
   ```sql
   SELECT * FROM information_schema.table_constraints 
   WHERE table_name = 'pages';
   ```

### If Contact Form Still Fails

1. **Verify table exists**:
   ```sql
   SELECT * FROM contact_submissions LIMIT 1;
   ```

2. **Check all columns exist**:
   ```sql
   \d contact_submissions
   ```

3. **Check indexes**:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'contact_submissions';
   ```

---

## Summary

| Step | Status |
|------|--------|
| Create migration function | ✅ Done |
| Drop old table | ✅ Will do on migration |
| Create new table with all columns | ✅ Will do on migration |
| Create indexes | ✅ Will do on migration |
| Test contact form | ⏳ After migration |

**Next**: Run the migration, then test the contact form!
