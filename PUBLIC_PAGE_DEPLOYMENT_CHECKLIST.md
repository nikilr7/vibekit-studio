# Public Page Improvements - Deployment & Verification Checklist

## Pre-Deployment Checklist

### Code Review
- [ ] All TypeScript files compile without errors
- [ ] No console errors in development
- [ ] All imports are correct
- [ ] No unused variables or imports
- [ ] Code follows project style guide

### Testing
- [ ] View tracking works in development
- [ ] Contact form submits in development
- [ ] Form validation works
- [ ] Error handling works
- [ ] Edge cases handled (no features, no gallery, etc.)
- [ ] Responsive design verified (mobile, tablet, desktop)

### Database
- [ ] Database connection string configured
- [ ] Migration script tested locally
- [ ] Tables created successfully
- [ ] Indexes created
- [ ] Foreign keys working

### Configuration
- [ ] netlify.toml updated with new redirects
- [ ] Function timeouts configured
- [ ] Environment variables set
- [ ] CORS headers configured

---

## Deployment Steps

### Step 1: Database Migration
```bash
# Option A: Run migration function after deployment
curl -X POST https://your-domain.netlify.app/.netlify/functions/migrate-public-pages

# Option B: Run migration locally before deployment
npm run migrate:public-pages

# Verify migration
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name='pages' AND column_name='view_count';"
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_name='contact_submissions';"
```

### Step 2: Deploy Code
```bash
# Run deployment script
./deploy.sh

# Or manual deployment
git add .
git commit -m "feat: add public page improvements (view tracking, contact form)"
git push origin main
```

### Step 3: Verify Deployment
```bash
# Check function deployment
curl https://your-domain.netlify.app/.netlify/functions/pages-public
curl https://your-domain.netlify.app/.netlify/functions/pages-view
curl https://your-domain.netlify.app/.netlify/functions/pages-contact

# Check redirects
curl -I https://your-domain.com/api/public/pages/test-page
curl -I https://your-domain.com/api/public/pages/test-page/view
curl -I https://your-domain.com/api/public/pages/test-page/contact
```

---

## Post-Deployment Verification

### 1. Public Page Loading
```bash
# Test public page loads
curl https://your-domain.com/api/public/pages/test-page

# Expected response:
# {
#   "id": "...",
#   "title": "...",
#   "slug": "test-page",
#   "content": {...},
#   "theme": "minimal",
#   "view_count": 0,
#   "created_at": "...",
#   "updated_at": "..."
# }
```

- [ ] Page loads without errors
- [ ] All fields present in response
- [ ] view_count field included
- [ ] Status code 200

### 2. View Tracking
```bash
# Test view tracking
curl -X POST https://your-domain.com/api/public/pages/test-page/view

# Expected response:
# { "view_count": 1 }
```

- [ ] Returns 200 status
- [ ] view_count incremented
- [ ] No errors in logs
- [ ] Database updated

**Verification:**
```sql
SELECT view_count FROM pages WHERE slug = 'test-page';
-- Should show: 1, 2, 3, etc. after each call
```

### 3. Contact Form Submission
```bash
# Test contact form
curl -X POST https://your-domain.com/api/public/pages/test-page/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'

# Expected response:
# {
#   "id": "submission-uuid",
#   "message": "Thank you for your message. We'll get back to you soon!"
# }
```

- [ ] Returns 200 status
- [ ] Response includes id and message
- [ ] No errors in logs
- [ ] Database record created

**Verification:**
```sql
SELECT * FROM contact_submissions WHERE page_id = 'page-id' ORDER BY created_at DESC LIMIT 1;
-- Should show the submitted data
```

### 4. Form Validation
```bash
# Test invalid email
curl -X POST https://your-domain.com/api/public/pages/test-page/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "message": "Test"
  }'

# Expected response:
# { "message": "Invalid email address" }
```

- [ ] Returns 400 status
- [ ] Error message displayed
- [ ] No database record created

### 5. Edge Cases
```bash
# Test missing slug
curl https://your-domain.com/api/public/pages/

# Expected: 404 or redirect

# Test invalid slug
curl https://your-domain.com/api/public/pages/nonexistent-page

# Expected: 404 with "Page not found"

# Test unpublished page
# (Create a draft page and try to access it)
curl https://your-domain.com/api/public/pages/draft-page

# Expected: 404 with "Page not found"
```

- [ ] Invalid slug returns 404
- [ ] Unpublished page returns 404
- [ ] Error messages are user-friendly

---

## Frontend Testing

### 1. Page Load
- [ ] Navigate to `/p/test-page`
- [ ] Page loads without errors
- [ ] Theme applied correctly
- [ ] All sections render
- [ ] Page title updated

### 2. View Tracking
- [ ] Open browser DevTools (Network tab)
- [ ] Refresh page
- [ ] Verify POST to `/api/public/pages/test-page/view`
- [ ] No errors in console
- [ ] Page load not blocked

### 3. Contact Form
- [ ] Fill form with valid data
- [ ] Click "Send Message"
- [ ] Verify loading spinner appears
- [ ] Verify success toast appears
- [ ] Form clears after submission
- [ ] No errors in console

### 4. Form Validation
- [ ] Submit with invalid email
- [ ] Verify error message appears
- [ ] Fix email and resubmit
- [ ] Verify success

### 5. Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] Form usable on all sizes
- [ ] Gallery responsive

### 6. Error Handling
- [ ] Disconnect network
- [ ] Try to submit form
- [ ] Verify error message
- [ ] Reconnect network
- [ ] Try again
- [ ] Verify success

---

## Database Verification

### 1. Tables Created
```sql
-- Check pages table
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'pages' 
ORDER BY ordinal_position;

-- Should include: view_count INTEGER
```

- [ ] view_count column exists
- [ ] Type is INTEGER
- [ ] Default is 0

```sql
-- Check contact_submissions table
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'contact_submissions' 
ORDER BY ordinal_position;

-- Should include: id, page_id, name, email, message, created_at, updated_at
```

- [ ] All columns present
- [ ] Correct data types
- [ ] Foreign key constraint exists

### 2. Indexes Created
```sql
-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'contact_submissions';

-- Should include:
-- idx_contact_submissions_page_id
-- idx_contact_submissions_created_at
```

- [ ] page_id index exists
- [ ] created_at index exists

### 3. Data Integrity
```sql
-- Check foreign key constraint
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'contact_submissions' 
AND constraint_type = 'FOREIGN KEY';

-- Should show: contact_submissions_page_id_fkey
```

- [ ] Foreign key constraint exists
- [ ] Cascade delete configured

---

## Performance Testing

### 1. Page Load Time
- [ ] Measure page load time (should be < 3s)
- [ ] Verify view tracking doesn't impact load time
- [ ] Check Network tab for waterfall

### 2. View Tracking Performance
- [ ] Measure view tracking request time (should be < 100ms)
- [ ] Verify non-blocking (doesn't wait for response)
- [ ] Check database query performance

### 3. Contact Form Performance
- [ ] Measure form submission time (should be < 1s)
- [ ] Verify loading state appears immediately
- [ ] Check database insert performance

### 4. Database Performance
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM pages WHERE slug = 'test-page' AND status = 'published';

-- Should use index scan
```

- [ ] Queries use indexes
- [ ] No sequential scans
- [ ] Response time < 10ms

---

## Security Verification

### 1. Input Validation
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts
- [ ] Test long strings
- [ ] Test special characters

### 2. Authentication
- [ ] Verify public pages don't require auth
- [ ] Verify only published pages accessible
- [ ] Verify draft pages return 404

### 3. CORS
- [ ] Test cross-origin requests
- [ ] Verify headers configured
- [ ] Test from different domains

### 4. Rate Limiting
- [ ] Test rapid requests
- [ ] Verify no rate limiting (or configured correctly)
- [ ] Check for abuse patterns

---

## Monitoring Setup

### 1. Error Tracking
- [ ] Set up Sentry or similar
- [ ] Configure error alerts
- [ ] Test error reporting

### 2. Performance Monitoring
- [ ] Set up performance tracking
- [ ] Configure alerts for slow requests
- [ ] Monitor database performance

### 3. Logging
- [ ] Verify function logs visible
- [ ] Check log retention
- [ ] Set up log alerts

### 4. Metrics
- [ ] Track view count trends
- [ ] Track contact form submissions
- [ ] Monitor error rates

---

## Rollback Plan

### If Issues Found
1. [ ] Identify issue
2. [ ] Check logs for errors
3. [ ] Verify database state
4. [ ] Decide: fix or rollback

### Rollback Steps
```bash
# Revert code
git revert <commit-hash>
git push origin main

# Rollback database (if needed)
# Option 1: Drop new columns/tables
ALTER TABLE pages DROP COLUMN view_count;
DROP TABLE contact_submissions;

# Option 2: Restore from backup
# (Contact database provider)
```

- [ ] Code reverted
- [ ] Database reverted (if needed)
- [ ] Verified working
- [ ] Notified team

---

## Sign-Off Checklist

### Development Team
- [ ] Code reviewed
- [ ] Tests passed
- [ ] No console errors
- [ ] Performance acceptable

### QA Team
- [ ] All features tested
- [ ] Edge cases verified
- [ ] Responsive design verified
- [ ] Error handling verified

### DevOps Team
- [ ] Deployment successful
- [ ] Monitoring configured
- [ ] Logs accessible
- [ ] Rollback plan ready

### Product Team
- [ ] Feature meets requirements
- [ ] User experience acceptable
- [ ] Performance acceptable
- [ ] Ready for production

---

## Post-Deployment Monitoring (First 24 Hours)

### Hourly Checks
- [ ] No error spikes
- [ ] View tracking working
- [ ] Contact form submissions received
- [ ] Database performance normal
- [ ] Function execution times normal

### Daily Summary
- [ ] Total views tracked
- [ ] Total contact submissions
- [ ] Error rate
- [ ] Performance metrics
- [ ] User feedback

---

## Documentation

- [ ] README updated
- [ ] API documentation updated
- [ ] Deployment guide updated
- [ ] Troubleshooting guide created
- [ ] Team notified

---

## Success Criteria

✅ All tests passing
✅ No errors in production
✅ View tracking working
✅ Contact form working
✅ Performance acceptable
✅ Database integrity maintained
✅ Security verified
✅ Monitoring configured
✅ Team trained
✅ Documentation complete

---

## Contact & Support

**Issues Found?**
1. Check logs: Netlify dashboard → Functions
2. Check database: Query contact_submissions table
3. Check browser console: DevTools → Console
4. Review troubleshooting guide: PUBLIC_PAGE_IMPROVEMENTS.md

**Questions?**
- Review: PUBLIC_PAGE_IMPROVEMENTS.md
- Review: PUBLIC_PAGE_ARCHITECTURE.md
- Review: PUBLIC_PAGE_QUICK_REFERENCE.md

---

## Deployment Sign-Off

- [ ] All checklists completed
- [ ] All tests passed
- [ ] All verifications successful
- [ ] Team approved
- [ ] Ready for production

**Deployed by:** ________________
**Date:** ________________
**Time:** ________________
**Status:** ✅ PRODUCTION READY
